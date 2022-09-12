import type { NextApiRequest, NextApiResponse } from "next";
import { getFileContent, updateScore } from "../../../utils/mongo";

type Data = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    return getFileContent(req.query.score_id as string).then((data) => {
      if (data) {
        return res.status(200).json({
          content: data.content,
        });
      } else {
        return res.status(500).send({ message: "error in score content" });
      }
    });
  }
  if (req.method === "POST") {
    const scoreInfo = JSON.parse(req.body);
    return updateScore(scoreInfo.score_id, scoreInfo.score_content).then(() => {
      return res.status(200).json({});
    });
  }
}
