import { IMiddlewareFunction } from '../../types/ExpressTypes';
import EndpointManager from '../lib/EndpointManager';
import LoggingMiddleware from '../middleware/LoggingMiddleware';
import BaseController from './BaseController';

export default class GeneralController extends BaseController {
  defaultMiddleware: IMiddlewareFunction[] = [LoggingMiddleware];

  public registerRoutes(): void {
    this.get('/', async (req, res) => {
      const endpoints = await EndpointManager.getEndpoints();
      res.json(endpoints);
    });
  }
}
