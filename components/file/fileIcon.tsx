import styles from "./fileIcon.module.scss";
import { RumFile } from "../../definition/derived";
import Icon from "@mdi/react";
import { mdiFolder } from "@mdi/js";
import { mdiFileMusicOutline } from '@mdi/js';
import { FileType } from "../../definition/primary";

type fileIconType = {
  file: RumFile;
  fileIconClickEventListener: (file: RumFile) => void;
};

export default function FileIcon(props: fileIconType) {
  return (
    <div className={styles.iconWrapper} onClick={() => {props.fileIconClickEventListener(props.file)}}>
      <Icon className={styles.iconImage} path={props.file.fileType === FileType.directory ? mdiFolder : mdiFileMusicOutline} size="2rem" />
      <div className={styles.iconText}>{props.file.name}</div>
    </div>
  );
}
