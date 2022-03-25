import express, { Express } from 'express';
import { host, port } from '../config/webserver.config.json';
import { log } from '../util/Logger';
import AuthController from './controller/AuthController';
import { IExpress } from '../types/ExpressTypes';
import GeneralController from './controller/GeneralController';
import DatabaseManager from './lib/database/DatabaseManager';

const WebServerSystem = {
  controllers: [GeneralController, AuthController],
  middlewares: [],
};

export const Server: IExpress = express();

function WebServer() {
  DatabaseManager.connectDatabase();

  log('Applying use-functions.');
  Server.use(express.json());

  log('Loading Controllers.');
  WebServerSystem.controllers.forEach((Controller: any) => {
    new Controller(Server).registerRoutes();
  });

  Server.listen(port, host, () => {
    log(`WebServer started on ${host}:${port}`, 'info');
  });
}

export default WebServer;
