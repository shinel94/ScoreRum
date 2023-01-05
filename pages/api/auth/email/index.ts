import type { NextApiRequest, NextApiResponse } from "next";
import {
  AUTH_EMAIL_CONTENT,
  AUTH_EMAIL_SUBJECT,
} from "../../../../definition/constant";
import { hashing } from "../../../../utils/hash";
import { sendMail } from "../../../../utils/smtp";

type Data = {
  exist: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { email, loginName } = JSON.parse(req.body);
    const hash = hashing(loginName + email)
    if (hash) {
      sendMail(
        email,
        AUTH_EMAIL_SUBJECT,
        AUTH_EMAIL_CONTENT.replace("{hash}", hash)
      );
      return res.status(200)
    }
  }
}
