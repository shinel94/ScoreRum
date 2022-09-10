import styles from "./scoreHeader.module.scss";
import { RumFile, Score } from "../../definition/derived";
import FileIcon from "../file/fileIcon";

type scoreHeaderType = {
  file: RumFile;
  score: Score
};

export default function ScoreHeader(props: scoreHeaderType) {
  return (
    <div >
      ScoreHeader
    </div>
  );
}
