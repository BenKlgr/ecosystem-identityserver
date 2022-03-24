import { IMiddlewareFunction } from '../../types/ExpressTypes';
import LoggingMiddleware from '../middleware/LoggingMiddleware';
import BaseController from './BaseController';

export default class AuthController extends BaseController {
  baseUrl: string = '/auth';
  defaultMiddleware: IMiddlewareFunction[] = [LoggingMiddleware];

  public registerRoutes(): void {
    this.get('/', (req, res) => {
      res.send('Hallo 123');
    });
  }
}
