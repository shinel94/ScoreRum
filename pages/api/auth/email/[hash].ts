import type { NextApiRequest, NextApiResponse } from "next";
import { authEmail } from "../../../../utils/prisma";

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
