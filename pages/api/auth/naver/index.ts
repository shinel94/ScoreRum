import type { NextApiRequest, NextApiResponse } from "next";
import { UserInfo } from "../../../../definition/primary";
import { readUser, writeUser } from "../../../../utils/mongo";

type Data = {
    user: UserInfo | undefined
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    readUser(req.query.id as string).then((result: UserInfo| undefined) => {
      res.status(200).json({user: result});
    });
  }
  if (req.method === "POST") {
    const userInfo: UserInfo = JSON.parse(req.body)
    writeUser(userInfo).then((result) => {
      res.status(200).json({
        user: userInfo
      });
    });
  }
}
