import type { NextApiRequest, NextApiResponse } from "next";
import { UserInfo } from "../../../definition/primary";
import { getUserInfoByToken } from "../../../utils/prisma";

type Data = {
  userInfo: UserInfo;
};
type ErrorData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>
) {
  if (req.method === "GET") {
    return getUserInfoByToken(
      +(req.query.id as string),
      req.query.token as string
    ).then((userInfo) => {
      if (userInfo)
      return res.status(200).json({
        userInfo: userInfo,
      });
    }).catch(() => {
      return res.status(400).json({
        message: "fail get user info"
      })
    });
  }
}
