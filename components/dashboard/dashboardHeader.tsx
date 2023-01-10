import Icon from "@mdi/react";
import { mdiAccountCircle } from "@mdi/js";
import { mdiFolderPlus } from "@mdi/js";
import { mdiFileMusicOutline } from "@mdi/js";
import { mdiTrashCanOutline } from "@mdi/js";

import styles from "./dashboardHeader.module.scss";
import { useToast } from "../../store/toastContext";

type dashboardHeader = {
  basePath: string;
  auth: boolean;
  setCreateDirectoryEventListener: () => void;
  setCreateScoreEventListener: () => void;
  setUserInfoEventListener: () => void;
  returnToPrevious: () => void;
  deleteDirectoryEventListener: () => void;
};

export default function DashboardHeader(props: dashboardHeader) {
  const { toast } = useToast();
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
          onClick={
            props.auth
              ? props.setCreateDirectoryEventListener
              : () => {
                  toast(
                    "warning",
                    "폴더를 생성하기 위해서는 계정 인증이 필요합니다.",
                    3000
                  );
                }
          }
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
