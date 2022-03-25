import express, { Express } from 'express';
import { host, port } from '../config/webserver.config.json';
import { log } from '../util/Logger';
import AuthController from './controller/AuthController';
import { IExpress } from '../types/ExpressTypes';

const WebServerSystem = {
  controllers: [AuthController],
  middlewares: [],
};

function WebServer() {
  const Server: IExpress = express();

  WebServerSystem.controllers.forEach((Controller: any) => {
    new Controller(Server).registerRoutes();
  });

  Server.listen(port, host, () => {
    log(`WebServer started on ${host}:${port}`, 'info');
  });
}

export default WebServer;
