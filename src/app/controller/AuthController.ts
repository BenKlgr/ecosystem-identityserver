import moment from 'moment';
import { IMiddlewareFunction, IRequest, IResponse } from '../../types/ExpressTypes';
import {
  getTokenPayload,
  hashPassword,
  registerUser,
  signIn,
  verifyToken,
} from '../lib/AuthenticationFunctions';
import { User } from '../lib/database/models/Models';
import EndpointManager from '../lib/EndpointManager';
import { Failure, Ok } from '../lib/ResponseFunctions';
import { getUserById } from '../lib/UserFunctions';
import { AntispamMiddleware } from '../middleware/AntispamMiddleware';
import LoggingMiddleware from '../middleware/LoggingMiddleware';
import BaseController from './BaseController';

export default class AuthController extends BaseController {
  baseUrl: string = '/auth';
  defaultMiddleware: IMiddlewareFunction[] = [LoggingMiddleware, AntispamMiddleware];

  public registerRoutes(): void {
    this.get(
      '/',
      async (req: IRequest, res: IResponse) => {
        const headers = req.headers;
        const authorizationHeader = headers.authorization;

        if (!authorizationHeader) {
          return res.json(Failure('invalid_headers'));
        }

        const token = authorizationHeader.split(' ')[1];

        if (!token) {
          return res.json(Failure('invalid_token'));
        }

        const tokenValid: boolean = await verifyToken(token, req);

        if (tokenValid) {
          const userId = getTokenPayload(token).userId;
          const user = (await getUserById(userId)).toJSON();

          user.password = undefined;

          return res.json(Ok(user));
        } else {
          return res.json(Failure('invalid_token'));
        }
      },
      { description: 'Gets the current session' }
    );

    this.get(
      '/token/:token',
      async (req: IRequest, res: IResponse) => {
        const token = req.params.token;

        if (!token) {
          return res.json(Failure('invalid_token'));
        }

        const tokenValid: boolean = await verifyToken(token, req);

        if (tokenValid) {
          const userId = getTokenPayload(token).userId;
          const user = (await getUserById(userId)).toJSON();

          user.password = undefined;

          return res.json(Ok(user));
        } else {
          return res.json(Failure('invalid_token'));
        }
      },
      { description: 'Gets user by token' }
    );

    this.post(
      '/',
      async (req: IRequest, res: IResponse) => {
        const { usernameOrEmail, password } = req.body;

        if (!(usernameOrEmail && password)) {
          return res.json(Failure('invalid_body'));
        }

        const token: string | null = await signIn(usernameOrEmail, password);

        if (!token) {
          return res.json(Failure('invalid_credentials'));
        } else {
          return res.json(Ok(token));
        }
      },
      {
        description: 'Performs an sign in',
      }
    );

    this.post(
      '/register',
      async (req: IRequest, res: IResponse) => {
        const { username, email, firstname, lastname, birthday, password } = req.body;

        if (!(username && email && firstname && lastname && birthday && password)) {
          return res.json(Failure('invalid_body'));
        }

        const userCreateResponse = await registerUser(
          username,
          email,
          firstname,
          lastname,
          birthday,
          password
        );

        res.json(Failure(userCreateResponse));
      },
      {
        description: 'Performs an sign in',
      }
    );
  }
}
