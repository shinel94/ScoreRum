import type { NextApiRequest, NextApiResponse } from "next";
import { getFileContent } from "../../../utils/mongo";

type Data = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    return getFileContent(req.query.score_id as string).then((data) => {
        if (data) {
            return res.status(200).json({
                content: data.content
              });
        } else {
            return res.status(500).send({message: 'error in score content'})
        }
      
    })
  }
  if (req.method === "POST") {
    return res.status(404).send({error: "Not Support POST Method"});
  }
}
