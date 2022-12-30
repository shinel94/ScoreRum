import type { NextApiRequest, NextApiResponse } from "next";
import { UserInfo } from "../../../definition/primary";
import { postUser } from "../../../utils/prisma";

type Data = {
  userInfo: UserInfo | undefined;
};
type ErrorResponse = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  if (req.method === "POST") {
    const signUpInfo: {
      loginName: string;
      password: string;
      nickName: string;
      email: string;
    } = JSON.parse(req.body);
    return postUser(
      signUpInfo.loginName,
      signUpInfo.nickName,
      signUpInfo.email,
      signUpInfo.password
    )
      .then((result) => {
        return res.status(200).json({ userInfo: result });
      })
      .catch((error) => {
        return res.status(400).json({ message: error.message });
      });
  }
}
