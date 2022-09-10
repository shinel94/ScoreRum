import styles from "./dashboardFileList.module.scss";
import { RumFile } from "../../definition/derived";
import FileIcon from "../file/fileIcon";

type dashboardFileList = {
  fileList: RumFile[];
  fileClickEventListener: (file: RumFile) => void
};

export default function DashboardFileList(props: dashboardFileList) {
  return (
    <div className={styles.fileListWrapper}>
      {props.fileList.map((rumFile) => {
        return <FileIcon key={rumFile.fileId.toString()} file={rumFile} fileIconClickEventListener={props.fileClickEventListener}/>;
      })}
    </div>
  );
}
