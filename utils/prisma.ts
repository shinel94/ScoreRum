import { PrismaClient } from "@prisma/client";
import { UserInfo } from "../definition/primary";
import { generateToken, hashing } from "./hash";
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

export const postUser: (
  loginName: string,
  nickName: string,
  email: string,
  pwd: string
) => Promise<UserInfo> = (loginName, nickName, email, pwd) => {
  return prisma.user
    .create({
      data: {
        loginName: loginName,
        nickName: nickName,
        email: email,
        password: hashing(pwd),
        hash: hashing(loginName + email),
        isEmailAuth: false,
        isDeleted: false,
      },
    })
    .then(() => {
      return getUserInfo(loginName, pwd).then((userInfo) => {
        if (userInfo) {
          return userInfo;
        } else {
          throw Error("fail create user");
        }
      });
    });
};

export const getUserInfo: (
  loginName: string,
  pwd: string
) => Promise<UserInfo | undefined> = (loginName, pwd) => {
  return prisma.user
    .findFirst({
      where: {
        loginName: loginName,
        password: hashing(pwd),
      },
      select: {
        id: true,
        nickName: true,
        email: true,
        isEmailAuth: true,
        isDeleted: true,
      },
    })
    .then((value) => {
      if (value) {
        if (value.isDeleted) {
          return undefined;
        }
        const token = generateToken(loginName, pwd);
        return prisma.user
          .update({
            where: {
              id: value.id,
            },
            data: {
              token: token,
            },
          })
          .then((value) => {
            const userInfo: UserInfo = {
              dbId: value.id,
              loginName: loginName,
              nickName: value.nickName,
              email: value.email,
              isEmailAuth: value.isEmailAuth,
              token: generateToken(loginName, pwd),
            };
            return userInfo;
          });
      } else {
        return undefined;
      }
    });
};
