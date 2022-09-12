import { ObjectId } from "mongodb";
import Vex from "vexflow";
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
  private static KEY_SEP = "-";
  private static NOTE_ELE_SEP = "_";
  private static NOTE_SEP = "~";
  private static PAGE_SEP = "|";
  constructor(public scoreId: string, public noteList: Vex.StaveNote[][]) {}
  public static fromContent(scoreId: string, content: string) {
    const noteList: Vex.StaveNote[][] = [];
    if (content) {
      const pageContent = content.split(Score.PAGE_SEP);
      for (let i = 0; i < pageContent.length; i++) {
        const noteContent = pageContent[i].split(Score.NOTE_SEP);
        const pageNoteList: Vex.StaveNote[] = [];
        for (let j = 0; j < noteContent.length; j++) {
          const noteInfo = noteContent[j].split(Score.NOTE_ELE_SEP);
          pageNoteList.push(
            new Vex.Flow.StaveNote({
              keys: noteInfo[0].split(Score.KEY_SEP),
              duration: noteInfo[2] + (noteInfo[1] === "r" ? "r" : ""),
            })
          );
        }
        noteList.push(pageNoteList);
      }
    } else {
      noteList.push([]);
    }

    return new Score(scoreId, noteList);
  }
  public toContent(): string {
    const content = [];
    for (let i = 0; i < this.noteList.length; i++) {
      let pageContent = [];
      for (let j = 0; j < this.noteList[i].length; j++) {
        pageContent.push(
          `${this.noteList[i][j].getKeys().join(Score.KEY_SEP)}${
            Score.NOTE_ELE_SEP
          }${this.noteList[i][j].getNoteType()}${
            Score.NOTE_ELE_SEP
          }${this.noteList[i][j].getDuration()}`
        );
      }
      content.push(pageContent.join(Score.NOTE_SEP));
    }

    return content.join(Score.PAGE_SEP);
  }
  // public static fromString(scoreId, content) {
  //   return new Score(scoreId, )
  // }
  public getScoreNoteList(): Vex.StaveNote[][] {
    return this.noteList;
  }
}
