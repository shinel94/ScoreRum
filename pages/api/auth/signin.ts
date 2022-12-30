import type { NextApiRequest, NextApiResponse } from "next";
import { UserInfo } from "../../../definition/primary";
import { readUser, writeUser } from "../../../utils/mongo";

type Data = {
  user: UserInfo | undefined;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    return readUser(req.query.id as string).then(
      (result: UserInfo | undefined) => {
        return res.status(200).json({ user: result });
      }
    );
  }
  if (req.method === "POST") {
    const userInfo: UserInfo = JSON.parse(req.body);
    return writeUser(userInfo).then((result) => {
      return res.status(200).json({
        user: userInfo,
      });
    });
  }
}
