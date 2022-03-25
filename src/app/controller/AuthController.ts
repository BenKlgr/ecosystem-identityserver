import { IMiddlewareFunction, IRequest, IResponse } from '../../types/ExpressTypes';
import EndpointManager from '../lib/EndpointManager';
import LoggingMiddleware from '../middleware/LoggingMiddleware';
import BaseController from './BaseController';

export default class AuthController extends BaseController {
  baseUrl: string = '/auth';
  defaultMiddleware: IMiddlewareFunction[] = [LoggingMiddleware];

  public registerRoutes(): void {
    this.get(
      '/',
      (req: IRequest, res: IResponse) => {
        res.send('Hallo 123');
      },
      { description: 'Gets the current session' }
    );

    this.post(
      '/',
      (req: IRequest, res: IResponse) => {
        res.send('sign in');
      },
      {
        description: 'Performs an sign in',
      }
    );
  }
}
