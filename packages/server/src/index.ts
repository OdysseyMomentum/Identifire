import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection, getRepository, Repository } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Request, Response } from 'express';
import { Routes } from './routes';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { WebSocket } from 'common-types';
import { User } from './entity/User';
import { EmergencyEvent } from './entity/EmergencyEvent';
import { eventNames } from 'process';
import { CredentialType } from './entity/CredentialType';
import { EmergencyEventType } from './entity/EmergencyEventType';

dotenv.config();

function validateUserCredentials(
  userCreds: string[],
  requiredCreds: string[]
): boolean {
  const overlappingCreds = userCreds.filter((x) => requiredCreds.includes(x));
  if (overlappingCreds.length <= 1) {
    return false;
  }
  return true;
}

async function handleUserAcceptEvent(
  action: WebSocket.AcceptEvent,
  userRepo: Repository<User>,
  emergencyEventRepo: Repository<EmergencyEvent>,
  credentialTypeRepo: Repository<CredentialType>,
  socket: Socket
) {
  let user = await userRepo.findOne(action.payload.userId);

  let searchCriteria = [];

  for (const c of action.payload.credentials) {
    searchCriteria.push({
      name: c,
    });
  }
  const credentialObjects = await credentialTypeRepo.find({
    where: searchCriteria,
  });

  user.credentialTypes = credentialObjects;
  user.webSocketConnection = socket;
  let emergency = await emergencyEventRepo.findOne(action.payload.eventId);
  const requiredCreds = emergency.emergencyType.credentialTypes.map(
    (x) => x.name
  );
  const userCreds = action.payload.credentials.map((x) => x.type);
  if (!validateUserCredentials(userCreds, requiredCreds)) {
    console.error('User credentials are not sufficient, ignoring request');
    return;
  }

  emergency.users.push(user);
  await emergencyEventRepo.save(emergency);
  await userRepo.save(user);
}

function setupWsConnect(io: Server) {
  let userRepo = getRepository(User);
  let emergencyEventRepo = getRepository(EmergencyEvent);
  let credentialTypeRepo = getRepository(CredentialType);
  io.on('connection', (socket: Socket) => {
    socket.on('msg', async (action: WebSocket.Action) => {
      switch (action.type) {
        case 'mobile->server/accept-event':
          await handleUserAcceptEvent(
            action,
            userRepo,
            emergencyEventRepo,
            credentialTypeRepo,
            socket
          );
          break;
        case 'mobile->dispatch/participant-location-update':
          const user = await userRepo.findOne(action.payload.userId);
          user.latitude = action.payload.location.latitude;
          user.longitude = action.payload.location.longitude;
          await userRepo.save(user);
          break;
        case 'dispatch->server/subscribe-to-event':
          setInterval(async () => {
            let event = await emergencyEventRepo.findOne(
              action.payload.eventId
            );
            socket.emit('msg', [...event.users]);
          }, 5000);
          break;
      }
    });
  });
}

async function seedDb() {
  const credentialTypeRepo = getRepository(CredentialType);
  const emergencyTypeRepo = getRepository(EmergencyEventType);

  const credType = new CredentialType();
  credType.name = 'CPR';

  const emergencyType1 = new EmergencyEventType();
  emergencyType1.code = 'fire';
  emergencyType1.title = 'BURN BABY BABY BABY';
  emergencyType1.credentialTypes = [];
  emergencyType1.credentialTypes.push(credType);
  await emergencyTypeRepo.save(emergencyType1);
}

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();

    app.use(cors({ origin: '*' }));
    app.use(bodyParser.json());
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: '*' } });
    setupWsConnect(io);
    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    // setup express app here
    // ...
    await seedDb();

    // start express server
    server.listen(process.env.PORT);

    // insert new users for test
    console.log(`Server started on ${process.env.PORT}`);
  })
  .catch((error) => console.log(error));
