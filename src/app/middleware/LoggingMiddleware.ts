import { IRequest, IResponse } from '../../types/ExpressTypes';
import { log } from '../../util/Logger';

export default function LoggingMiddleware<IMiddlewareFunction>(
  req: IRequest,
  res: IResponse,
  next: Function
) {
  log(`${req.method} request to ${req.url} from ${req.ip}`);
  next();
}
