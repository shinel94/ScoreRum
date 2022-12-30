import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const isExistId: (id: string) => Promise<boolean> = (id) => {
  return prisma.user
    .findFirst({
      where: {
        loginName: id,
      },
      select: {
        id: true,
      },
    })
    .then((value) => {
      return value ? true : false;
    });
};
