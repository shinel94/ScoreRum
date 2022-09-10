import styles from "./scoreBody.module.scss";
import { RumFile, Score } from "../../definition/derived";
import FileIcon from "../file/fileIcon";

type scoreBodyType = {
  file: RumFile;
  score: Score
};

export default function ScoreBody(props: scoreBodyType) {
  return (
    <div >
      ScoreBody
    </div>
  );
}
