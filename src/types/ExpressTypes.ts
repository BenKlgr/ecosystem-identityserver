import { Express, Request, Response } from 'express';

export type IExpress = Express;
export type IRequest = Request;
export type IResponse = Response;
export type ICallbackFunction = {
  (req: IRequest, res: IResponse): any;
};
export type IMiddlewareFunction = {
  (req: IRequest, res: IResponse, next: Function): any;
};
