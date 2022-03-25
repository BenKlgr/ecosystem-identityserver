import { Express } from 'express';
import { ICallbackFunction, IMiddlewareFunction } from '../../types/ExpressTypes';
import EndpointManager from '../lib/EndpointManager';

type IMethodOptions = {
  middlewares?: IMiddlewareFunction[];
  description?: string;
};

type IMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export default class BaseController {
  public Server: Express;
  public baseUrl: string = '';
  public defaultMiddleware: IMiddlewareFunction[] = [];

  constructor(ExpressInstance: Express) {
    this.Server = ExpressInstance;
  }

  public registerRoutes(): void {}

  public get(url: string, callback: ICallbackFunction, options: IMethodOptions = {}) {
    this.createEndpoint(`${this.baseUrl}${url}`, 'GET', callback, options);
  }

  public post(url: string, callback: ICallbackFunction, options: IMethodOptions = {}) {
    this.createEndpoint(`${this.baseUrl}${url}`, 'POST', callback, options);
  }

  public put(url: string, callback: ICallbackFunction, options: IMethodOptions = {}) {
    this.createEndpoint(`${this.baseUrl}${url}`, 'PUT', callback, options);
  }

  public delete(url: string, callback: ICallbackFunction, options: IMethodOptions = {}) {
    this.createEndpoint(`${this.baseUrl}${url}`, 'DELETE', callback, options);
  }

  private createEndpoint(
    completeUrl: string,
    method: IMethod,
    callback: ICallbackFunction,
    options: IMethodOptions
  ) {
    const { middlewares = [], description = '' } = options;

    EndpointManager.registerEndpoint(completeUrl, method, description);

    const serverFunction =
      method == 'GET'
        ? this.Server.get
        : method == 'POST'
        ? this.Server.post
        : method == 'PUT'
        ? this.Server.put
        : this.Server.delete;
    serverFunction.bind(this.Server)(
      completeUrl,
      [...middlewares, ...this.defaultMiddleware],
      callback
    );
  }
}
