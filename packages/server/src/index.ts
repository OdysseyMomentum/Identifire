import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Request, Response } from 'express';
import { Routes } from './routes';
import * as http from 'http';
import { Server, Socket } from 'socket.io';

dotenv.config();

function setupWsConnect(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('hi', (event) => {
      console.log('ihdidjidjidjdijdij');
      console.log(event);
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
    const io = new Server(server);
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
