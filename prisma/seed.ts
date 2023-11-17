import db from './db.setup';
import { saltValue } from '../src/utils/auth';
import { avatars } from '../_data/avatar';

interface AvatarObject {
  title: string;
  avatarURL: string;
}

const avatarsToDB = async (avatars: AvatarObject[]) => {
  const mappedAvatars: Promise<any>[] = avatars.map((avatarObject) => {
    return db.avatar.create({
      data: {
        title: avatarObject.title,
        avatarURL: avatarObject.avatarURL,
      },
    });
  });

  await Promise.all(mappedAvatars);

  console.log('Avatar Seeding complete');
};

const clearDb = async () => {
  await db.user.deleteMany();
  await db.password.deleteMany();
};

export const seed = async () => {
  console.log('Seeding the database...');
  await clearDb();

  await avatarsToDB(avatars);

  const listOfAvatars = await db.avatar.findMany();

  // seed here
  const michael = await db.user.create({
    data: {
      email: 'michael.sanchez@devspace.com',
      username: 'michael.sanchez',
      avatarId: listOfAvatars[0].id,
      password: {
        create: {
          password: await saltValue('12345678'),
        },
      },
    },
  });

  const Charles = await db.user.create({
    data: {
      email: 'charles.best.zambrana@devspace.com',
      username: 'charles.best.zambrana',
      avatarId: listOfAvatars[1].id,
      friendIds: [michael.id],
      topEight: [michael.id],
      password: {
        create: {
          password: await saltValue('12345678'),
        },
      },
    },
  });

  await db.user.update({
    where: { id: michael.id },
    data: {
      friendIds: [Charles.id],
      topEight: [Charles.id],
    },
  });

  const Richard = await db.user.create({
    data: {
      email: 'richard.olpindo@devspace.com',
      username: 'richard.olpindo',
      avatarId: listOfAvatars[2].id,
      friendIds: [michael.id],
      topEight: [michael.id],
      password: {
        create: {
          password: await saltValue('12345678'),
        },
      },
    },
  });

  const Quallin = await db.user.create({
    data: {
      email: 'quallin.games@devspace.com',
      username: 'quallin.games',
      avatarId: listOfAvatars[3].id,
      friendIds: [michael.id],
      topEight: [michael.id],
      password: {
        create: {
          password: await saltValue('12345678'),
        },
      },
    },
  });

  const Craig = await db.user.create({
    data: {
      email: 'craig.howard@devspace.com',
      username: 'craig.howard',
      avatarId: listOfAvatars[4].id,
      friendIds: [michael.id],
      topEight: [michael.id],
      password: {
        create: {
          password: await saltValue('12345678'),
        },
      },
    },
  });

  const users = [michael, Charles, Richard, Quallin, Craig];
  console.log({ users });
};

seed()
  .then(() => {
    console.log('Seeding complete');
  })
  .catch((e: any) => {
    console.error(e);
  })
  .finally(async () => {
    await db.$disconnect();
  });
