import { sign, verify } from 'jsonwebtoken';
import moment from 'moment';
import { secret } from '../../config/jwt.secretconfig.json';
import { ITokenPayload } from '../../types/Authentication';
import { log } from '../../util/Logger';
import { TokenUseHistory, User } from './database/models/Models';
import { Op } from '@sequelize/core';
import crypto from 'crypto';
import { IRequest } from '../../types/ExpressTypes';

export async function verifyToken(token: string, req: IRequest): Promise<boolean> {
  const decodedPayload = getTokenPayload(token);

  if (decodedPayload == null) {
    return false;
  }

  const { userId, email, createdAt } = decodedPayload;

  if (!(userId && email && createdAt)) {
    log('Checked token has an invalid payload.', 'warning');
    return false;
  }

  const lastTokenUseHistoryEntry = await TokenUseHistory.findOne({
    where: {
      userId,
    },
    order: [['createdAt', 'DESC']],
  });

  const agent = req.get('User-Agent');
  const address = (req.headers['x-forwarded-for'] || req.socket.remoteAddress) as string;

  if (!lastTokenUseHistoryEntry) {
    TokenUseHistory.create({
      userId,
      token,
      address,
      agent,
      location: '',
      timestamp: moment().toDate(),
    });
  } else {
    if (
      (lastTokenUseHistoryEntry.agent != agent &&
        lastTokenUseHistoryEntry.address != address) ||
      lastTokenUseHistoryEntry.token != token
    ) {
      TokenUseHistory.create({
        userId,
        token,
        address,
        agent,
        location: '',
        timestamp: moment().toDate(),
      });
    } else {
      const lastSignInMoment = moment(lastTokenUseHistoryEntry.createdAt);
      const differenceInDays = moment().diff(lastSignInMoment, 'days');

      if (differenceInDays > 14) {
        log(`Token was too old`, 'warning');
        return false;
      }
    }
  }

  const user = await User.findOne({
    where: {
      id: userId,
      email,
    },
  });

  return Boolean(user);
}

export function getTokenPayload(token: string) {
  try {
    const decodedPayload = verify(token, secret) as ITokenPayload;
    return decodedPayload;
  } catch (error) {
    return null;
  }
}

export async function signIn(
  usernameOrEmail: string,
  password: string
): Promise<string | null> {
  const user = await User.findOne({
    where: {
      password: hashPassword(password),
      [Op.or]: [
        {
          username: usernameOrEmail,
        },
        {
          email: usernameOrEmail,
        },
      ],
    },
  });

  if (!user) {
    return null;
  }

  return generateToken(user.id, user.email);
}

export async function registerUser(
  username: string,
  email: string,
  firstname: string,
  lastname: string,
  birthday: string,
  password: string
) {
  const user = await User.findOne({
    where: {
      [Op.or]: [
        {
          username,
        },
        {
          email,
        },
      ],
    },
  });

  if (user) {
    return 'username_or_email_taken';
  }

  await User.create({
    username,
    email,
    password: hashPassword(password),
    firstname,
    lastname,
    birthday: moment(birthday, 'DD.MM.YYYY').toDate(),
  });

  return 'created';
}

export function generateToken(userId: number, email: string): string {
  const now = moment().format('DD.MM.YYYY');
  return sign({ userId, email, createdAt: now } as ITokenPayload, secret);
}

export function hashPassword(password: string): string {
  const hasher = crypto.createHash('sha512');
  return hasher.update(password).update(secret).digest('hex');
}
