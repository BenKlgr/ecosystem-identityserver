import moment from 'moment';
import { IMiddlewareFunction, IRequest, IResponse } from '../../types/ExpressTypes';
import { hashPassword, signIn } from '../lib/AuthenticationFunctions';
import { User } from '../lib/database/models/Models';
import EndpointManager from '../lib/EndpointManager';
import { Failure, Ok } from '../lib/ResponseFunctions';
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
      async (req: IRequest, res: IResponse) => {
        const { usernameOrEmail, password } = req.body;

        if (!(usernameOrEmail && password)) {
          return res.json(Failure('invalid body'));
        }

        const token: string | null = await signIn(usernameOrEmail, password);

        if (!token) {
          return res.json(Failure('invalid credentials'));
        } else {
          return res.json(Ok(token));
        }
      },
      {
        description: 'Performs an sign in',
      }
    );

    this.post(
      '/debug',
      async (req: IRequest, res: IResponse) => {
        const createdUser = await User.create({
          email: 'benklingeler@gmail.com',
          username: 'bklingeler',
          password: hashPassword('testpass'),

          firstname: 'Ben',
          lastname: 'Klingeler',
          birthday: moment().toDate(),
        });

        res.json(createdUser);
      },
      {
        description: 'Creates a debug user',
      }
    );
  }
}
