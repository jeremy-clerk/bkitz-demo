import { prisma } from '@documenso/prisma';

export const getUserByEmail = async ({ email }: { email: string }) => {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
    include: {
      ownedTeams: true,
    },
  });

  if (!user) {
    throw new Error('Invalid token');
  }

  return user;
};
