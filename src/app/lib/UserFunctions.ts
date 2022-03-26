import { User } from './database/models/Models';

export async function getUserById(id: number) {
  const user = await User.findOne({
    where: {
      id,
    },
  });

  return user;
}
