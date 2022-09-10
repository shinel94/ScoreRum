import type { NextApiRequest, NextApiResponse } from "next";
import { FileType } from "../../../definition/primary";
import { createFile, deleteFile, getFileList } from "../../../utils/mongo";

type Data = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    return getFileList(
      req.query.id as string,
      req.query.base_path as string
    ).then((data) => {
      return res.status(200).json({
        files: data,
      });
    });
  }
  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    return createFile(
      body.id,
      body.base_path,
      body.file_name,
      body.file_type
    ).then(() => {
      return res.status(200).json({});
    });
  }
  if (req.method === "DELETE") {
    return deleteFile(req.query.user_id as string, req.query.file_name as string, req.query.base_path as string).then((data) => {
      return res.status(200).json({
        files: data,
      });
    });
  }
}
