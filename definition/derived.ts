import { ObjectId } from "mongodb";
import { FileType } from "./primary";

export class RumFile {
  constructor(
    public fileId: ObjectId,
    public basePath: string,
    public name: string,
    public fileType: FileType,
    public scoreId: string
  ) {}

  public static fromFileListResponse: (
    response: {
      _id: ObjectId;
      userId: string;
      basePath: string;
      fileName: string;
      fileType: FileType;
      scoreId: string;
    }[]
  ) => RumFile[] = (response) => {
    return response.map((fileInfo) => {
      return new RumFile(
        fileInfo._id,
        fileInfo.basePath,
        fileInfo.fileName,
        fileInfo.fileType,
        fileInfo.scoreId
      );
    });
  };
}

export class Score {
  constructor(public scoreId: string, public content: string) {}
  public convertToString() {
    return "";
  }
  public getNoteList() {
    return []
  }
}
