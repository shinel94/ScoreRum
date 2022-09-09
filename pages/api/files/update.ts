import type { NextApiRequest, NextApiResponse } from "next";

type Data = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    console.log(req);
  }
  if (req.method === "POST") {
    console.log(req);
  }
}
