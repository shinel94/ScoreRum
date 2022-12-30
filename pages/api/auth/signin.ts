import type { NextApiRequest, NextApiResponse } from "next";
import { UserInfo } from "../../../definition/primary";

type Data = {
  user: UserInfo | undefined;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    return res.status(200);
  }
  if (req.method === "POST") {
    return res.status(200);
  }
}
