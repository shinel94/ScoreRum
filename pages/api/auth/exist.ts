import type { NextApiRequest, NextApiResponse } from "next";
import { isExistId } from "../../../utils/prisma";

type Data = {
  exist: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    return isExistId(req.query.id as string).then((exist) => {
      return res.status(200).json({
        exist: exist,
      });
    });
  }
}
