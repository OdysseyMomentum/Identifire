import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
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

function setupWsConnect(io: Server) {
  let userRepo = getRepository(User);
  let emergencyEventRepo = getRepository(EmergencyEvent);
  io.on('connection', (socket: Socket) => {
    socket.on('msg', async (action: WebSocket.Action) => {
      switch (action.type) {
        case 'mobile->server/accept-event':
          console.log('nanana')
          
          let user = await userRepo.findOne(action.payload.userId);
          user.webSocketConnection = socket;
          let emergency = await emergencyEventRepo.findOne(
            action.payload.eventId
          );
          const requiredCreds = emergency.emergencyType.credentialTypes.map(
            (x) => x.name
          );
          const userCreds = action.payload.credentials.map((x) => x.type);
          if (!validateUserCredentials(userCreds, requiredCreds)) {
            console.error(
              'User credentials are not sufficient, ignoring request'
            );
            return;
          }

          emergency.users.push(user);
          emergencyEventRepo.save(emergency);
          break;
      }
    });
  });
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

    // start express server
    server.listen(process.env.PORT);

    // insert new users for test
    console.log(`Server started on ${process.env.PORT}`);
  })
  .catch((error) => console.log(error));
