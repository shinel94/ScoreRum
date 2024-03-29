import type { NextApiRequest, NextApiResponse } from "next";
import {
  AUTH_EMAIL_CONTENT,
  AUTH_EMAIL_SUBJECT,
} from "../../../../definition/constant";
import { authEmail } from "../../../../utils/prisma";
import { sendMail } from "../../../../utils/smtp";

type Data = {
  exist: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { hash } = req.query;
    if (hash) {
      authEmail(hash.toString()).then(() => {
        res.redirect(307, "/").end();
      });
    }
  }
}
