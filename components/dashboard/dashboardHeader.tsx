import Icon from "@mdi/react";
import { mdiAccountCircle } from "@mdi/js";
import { mdiFolderPlus } from "@mdi/js";
import { mdiFileMusicOutline } from "@mdi/js";
import { mdiTrashCanOutline } from "@mdi/js";

import styles from "./dashboardHeader.module.scss";

type dashboardHeader = {
  basePath: string;
  setCreateDirectoryEventListener: () => void;
  setCreateScoreEventListener: () => void;
  setUserInfoEventListener: () => void;
  returnToPrevious: () => void;
  deleteDirectoryEventListener: () => void;
};

export default function DashboardHeader(props: dashboardHeader) {
  return (
    <div className={styles.dashboardHeader}>
      <div
        className={styles.dashboardHeaderText + " u-nondraggable"}
        onClick={props.returnToPrevious}
      >
        <div className={styles.pathTitle}>
          <span>Path</span>
          <span>{">>"}</span>
        </div>
        <div className={styles.pathContent}>{props.basePath}</div>
      </div>
      <div className={styles.dashboardHeaderActions}>
        <div
          className={styles.dashboardHeaderButton}
          onClick={props.deleteDirectoryEventListener}
        >
          <Icon path={mdiTrashCanOutline} size="2rem" />
        </div>
        <div
          className={styles.dashboardHeaderButton}
          onClick={props.setCreateDirectoryEventListener}
        >
          <Icon path={mdiFolderPlus} size="2rem" />
        </div>
        <div
          className={styles.dashboardHeaderButton}
          onClick={props.setCreateScoreEventListener}
        >
          <Icon path={mdiFileMusicOutline} size="2rem" />
        </div>
        <div
          className={styles.dashboardHeaderButton}
          onClick={props.setUserInfoEventListener}
        >
          <Icon path={mdiAccountCircle} size="2rem" />
        </div>
      </div>
    </div>
  );
}
