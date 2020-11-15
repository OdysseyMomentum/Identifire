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
import { RestAPI, WebSocket } from 'common-types';
import { User } from './entity/User';
import { EmergencyEvent } from './entity/EmergencyEvent';
import { eventNames } from 'process';
import { CredentialType } from './entity/CredentialType';
import { EmergencyEventType } from './entity/EmergencyEventType';
import { geoToH3 } from 'h3-js';
import * as path from 'path';

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
      name: c.type,
    });
  }
  const credentialObjects = await credentialTypeRepo.find({
    where: searchCriteria,
  });

  user.credentialTypes = credentialObjects;
  user.webSocketConnection = socket;
  let emergency = await emergencyEventRepo.findOne(action.payload.eventId);
  console.log(
    'handling user accept event. Got emergency',
    emergency,
    'and got user',
    user
  );
  socket.join(`/${emergency.id}`);
  // const requiredCreds = emergency.emergencyType.credentialTypes.map(
  //   (x) => x.name
  // );
  // TODO fix this
  // const requiredCreds = emergency.emergencyType.credentialTypes.map(
  //   (x) => x.name
  // );
  // const userCreds = action.payload.credentials.map((x) => x.type);
  // if (!validateUserCredentials(userCreds, requiredCreds)) {
  //   console.error('User credentials are not sufficient, ignoring request');
  //   return;
  // }
  if (!emergency.users) {
    emergency.users = [];
  }
  emergency.users.push(user);
  await emergencyEventRepo.save(emergency);
  user.activeEmergencyEvent = emergency;
  console.log('handling user accept after save', emergency, user);
  await userRepo.save(user);
}

function setupWsConnect(io: Server) {
  let userRepo = getRepository(User);
  let emergencyEventRepo = getRepository(EmergencyEvent);
  let credentialTypeRepo = getRepository(CredentialType);
  io.on('connection', (socket: Socket) => {
    socket.on('message', async (action: WebSocket.Action) => {
      console.log('Received websocket event', action);
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
          console.log('action.payload', action.payload);
          user.latitude = action.payload.location.latitude;
          user.longitude = action.payload.location.longitude;
          user.locationIndex = geoToH3(
            user.latitude,
            user.longitude,
            Number(process.env.H3_RESOLUTION)
          );
          await userRepo.save(user);
          break;
        case 'dispatch->server/subscribe-to-event':
          console.log('dispatch subscribing to event');
          let event = await emergencyEventRepo.findOne(action.payload.eventId);
          socket.join(`/${event.id}`);
          // event.socketId = socket.id
          // await emergencyEventRepo.save(event)
          setInterval(async () => {
            let users = await userRepo.find({
              where: {
                activeEmergencyEvent: {
                  id: action.payload.eventId,
                },
              },
            });

            let event = await emergencyEventRepo.findOne(
              action.payload.eventId
            );
            console.log(
              `sending event info to dispatch. ${users.length} can help`,
              users,
              'and found event',
              event
            );

            const actionToSend: WebSocket.ServerUpdateLocation = {
              type: 'server->dispatch/participant-location-update',
              payload: {
                users: event.users.map((u) => ({
                  id: u.id,
                  credentialType: 'BHV', // u.credentialTypes[0].name,
                  location: {
                    latitude: u.latitude,
                    longitude: u.longitude,
                  },
                })),
              },
            };

            socket.emit('message', actionToSend);
          }, 5000);
          break;
        case 'mobile<->dispatch/chat':
          const e = await emergencyEventRepo.findOne(action.payload.eventId);
          console.log('sending chat message for event', e.id);
          // io.allSockets()[event.socketId].emit('message', action.payload)
          io.to(`/${e.id}`).emit('message', action);
          break;
      }
    });
  });
}

async function seedDb() {
  const credentialTypeRepo = getRepository(CredentialType);
  const emergencyTypeRepo = getRepository(EmergencyEventType);

  // CPR
  const cpr = new CredentialType();
  cpr.name = 'CPR';
  await credentialTypeRepo.save(cpr);

  // BHV
  const bhv = new CredentialType();
  bhv.name = 'BHV';
  await credentialTypeRepo.save(bhv);

  // Fire
  const fireEmergency = new EmergencyEventType();
  fireEmergency.code = 'Fire';
  fireEmergency.title = 'Fire';
  fireEmergency.credentialTypes = [bhv, cpr];
  await emergencyTypeRepo.save(fireEmergency);

  // Heart Attack
  const heartAttack = new EmergencyEventType();
  heartAttack.code = 'Cardiac Arrest';
  heartAttack.title = 'Cardiac Arrest';
  heartAttack.credentialTypes = [cpr];
  await emergencyTypeRepo.save(heartAttack);

  // Car Crash
  const carCrashEmergency = new EmergencyEventType();
  carCrashEmergency.code = 'Car Crash';
  carCrashEmergency.title = 'Car Crash';
  carCrashEmergency.credentialTypes = [bhv, cpr];
  await emergencyTypeRepo.save(carCrashEmergency);
}

createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();

    app.use(cors({ origin: '*' }));
    app.use(bodyParser.json());
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: { origin: '*' },
    });
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

    app.use(express.static(path.join(__dirname, '../../dispatch-app/dist')));

    app.use((req, res, next) => {
      res.sendFile(path.join(__dirname, '../../dispatch-app/dist/index.html'));
    });

    // setup express app here
    // ...
    if (process.argv[2] === '--seed') {
      console.log('seeding db');
      await seedDb();
    }

    // start express server
    server.listen(process.env.PORT);
    // insert new users for test
    console.log(`Server started on ${process.env.PORT}`);
  })
  .catch((error) => console.log(error));
