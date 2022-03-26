import moment from 'moment';
import { Moment } from 'moment';
import { IRequest, IResponse } from '../../types/ExpressTypes';
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
  requestHistory = requestHistory.filter(
    (request) => request.timestamp.diff(moment(), 'minutes') <= 1
  );

  const address = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;
  const filteredEntries = requestHistory.filter((request) => request.address == address);

  const blocked = filteredEntries.length > 10;

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
