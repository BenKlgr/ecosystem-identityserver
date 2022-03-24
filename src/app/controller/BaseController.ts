import { Express } from 'express';
import { ICallbackFunction, IMiddlewareFunction } from '../../types/ExpressTypes';

export default class BaseController {
  public Server: Express;
  public baseUrl: string = '';
  public defaultMiddleware: IMiddlewareFunction[] = [];

  constructor(ExpressInstance: Express) {
    this.Server = ExpressInstance;
  }

  public registerRoutes(): void {}

  public get(
    url: string,
    callback: ICallbackFunction,
    middlewares: IMiddlewareFunction[] = []
  ) {
    this.Server.get(
      `${this.baseUrl}${url}`,
      [...middlewares, ...this.defaultMiddleware],
      callback
    );
  }

  public post(
    url: string,
    callback: ICallbackFunction,
    middlewares: IMiddlewareFunction[] = []
  ) {
    this.Server.post(
      `${this.baseUrl}${url}`,
      [...middlewares, ...this.defaultMiddleware],
      callback
    );
  }
}
