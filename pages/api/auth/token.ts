import type { NextApiRequest, NextApiResponse } from "next";
import { isValidateToken } from "../../../utils/prisma";

type Data = {
  validate: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    return isValidateToken(
      +(req.query.id as string),
      req.query.token as string
    ).then((validate) => {
      return res.status(200).json({
        validate: validate,
      });
    });
  }
}
