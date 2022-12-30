import type { NextApiRequest, NextApiResponse } from "next";
import { UserInfo } from "../../../definition/primary";
import { getUserInfo } from "../../../utils/prisma";

type Data = {
  userInfo: UserInfo;
};
type ErrorResponse = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  if (req.method === "POST") {
    const signInInfo: {
      loginName: string;
      password: string;
    } = JSON.parse(req.body);
    return getUserInfo(signInInfo.loginName, signInInfo.password)
      .then((result) => {
        if (result) {
          return res.status(200).json({ userInfo: result });
        } else {
          return res.status(400).json({ message: "login fail" });
        }
      })
      .catch((error) => {
        return res.status(400).json({ message: "login fail" });
      });
  }
}
