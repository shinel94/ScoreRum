import { PrismaClient } from "@prisma/client";
import { FileType, UserInfo } from "../definition/primary";
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
          throw new Error("fail create user");
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

export async function getFileList(dbId: string, basePath: string) {
  try {
    const fileList = prisma.files.findMany({
      where: {
        id: Number.parseInt(dbId),
        basePath: basePath,
      },
    });
    if (fileList) {
      return fileList;
    } else {
      return [];
    }
  } finally {
  }
}

export async function createFile(
  userId: string,
  basePath: string,
  fileName: string,
  fileType: FileType
) {
  try {
    let scoreId = -1;
    if (fileType === FileType.file) {
      fileName = fileName + ".shot";
      const score = await prisma.score.create({
        data: {
          fileName: fileName,
          content: "",
        },
        select: {
          id: true,
        },
      });
      scoreId = score.id;
    }
    const result = await prisma.files.create({
      data: {
        userId: Number.parseInt(userId),
        basePath: basePath,
        fileName: fileName,
        fileType: fileType,
        scoreId: scoreId,
        isDeleted: false,
      },
    });
    return result;
  } finally {
  }
}

export async function updateScore(scoreId: string, content: string) {
  try {
    const result = await prisma.score.update({
      where: {
        id: Number.parseInt(scoreId),
      },
      data: {
        content: content,
      },
    });
    return result;
  } finally {
  }
}

export async function deleteFile(
  userId: string,
  fileName: string,
  basePath: string
) {
  try {
    const file = await prisma.files.findFirst({
      where: {
        userId: Number.parseInt(userId),
        fileName: fileName,
      },
      select: {
        id: true,
        fileType: true,
        scoreId: true,
      },
    });
    if (file) {
      await prisma.files.delete({
        where: {
          id: file.id,
        },
      });
      if (file.fileType === FileType.file) {
        await prisma.score.delete({
          where: {
            id: file.scoreId,
          },
        });
      }
    }
  } finally {
  }
}

export async function getFileContent(scoreId: string) {
  try {
    const score = await prisma.score.findFirst({
      where: {
        id: Number.parseInt(scoreId),
      },
      select: {
        content: true,
      },
    });
    return score;
  } finally {
  }
}
