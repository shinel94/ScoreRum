import type { NextApiRequest, NextApiResponse } from "next";
import {
  AUTH_EMAIL_CONTENT,
  AUTH_EMAIL_SUBJECT,
} from "../../../definition/constant";
import { UserInfo } from "../../../definition/primary";
import { postUser } from "../../../utils/prisma";
import { sendMail } from "../../../utils/smtp";

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
        if (result.hash) {
          sendMail(
            result.email,
            AUTH_EMAIL_SUBJECT,
            AUTH_EMAIL_CONTENT.replace("{hash}", result.hash)
          );
        }

        return res.status(200).json({ userInfo: result });
      })
      .catch((error) => {
        return res.status(400).json({ message: error.message });
      });
  }
}
