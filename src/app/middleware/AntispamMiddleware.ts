import moment, { Moment } from 'moment';
import { IRequest, IResponse, IMiddlewareFunction } from '../../types/ExpressTypes';
import { Failure } from '../lib/ResponseFunctions';

type HistoryEntry = {
  address: string;
  timestamp: Moment;
};
let requestHistory: HistoryEntry[] = [];

export function AntispamMiddleware<IMiddlewareFunction>(
  req: IRequest,
  res: IResponse,
  next: Function
) {
  requestHistory = requestHistory.filter((request) => {
    return moment().diff(request.timestamp, 'seconds') < 5;
  });

  const address = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;
  if (address == '127.0.0.1') return next();

  const filteredEntries = requestHistory.filter((request) => request.address == address);

  const blocked = filteredEntries.length > 5;

  if (blocked) {
    res.json(Failure('antispam'));
  } else {
    requestHistory.push({
      address,
      timestamp: moment(),
    });
    next();
  }
}
