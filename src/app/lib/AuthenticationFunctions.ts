import { sign, verify } from 'jsonwebtoken';
import moment from 'moment';
import { secret } from '../../config/jwt.secretconfig.json';
import { ITokenPayload } from '../../types/Authentication';
import { log } from '../../util/Logger';
import { SignInEntry, User } from './database/models/Models';
import { Op } from '@sequelize/core';
import crypto from 'crypto';

export async function verifyToken(token: string): Promise<boolean> {
  const decodedPayload = verify(token, secret) as ITokenPayload;

  const { userId, email, createdAt } = decodedPayload;

  if (!(userId && email && createdAt)) {
    log('Checked token has an invalid payload.', 'warning');
    return false;
  }

  const lastSignInEntry = await SignInEntry.findOne({
    where: {
      userId,
    },
    order: [['createdAt', 'DESC']],
  });

  if (lastSignInEntry == null) {
    log(`There was no last sign-in entry found to the user id ${userId}`, 'warning');
    return false;
  }

  const lastSignInMoment = moment(lastSignInEntry.createdAt);
  const differenceInDays = moment().diff(lastSignInMoment, 'days');

  if (differenceInDays > 30) {
    log(`Token was too old`, 'warning');
    return false;
  }

  const user = await User.findOne({
    where: {
      id: userId,
      email,
    },
  });

  return Boolean(user);
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

export function generateToken(userId: number, email: string): string {
  const now = moment().format('DD.MM.YYYY');
  return sign({ userId, email, createdAt: now } as ITokenPayload, secret);
}

export function hashPassword(password: string): string {
  const hasher = crypto.createHash('sha512');
  return hasher.update(password).update(secret).digest('hex');
}
