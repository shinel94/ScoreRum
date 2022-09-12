import styles from "./scoreHeader.module.scss";
import { RumFile, Score } from "../../definition/derived";
import { mdiTrashCanOutline } from "@mdi/js";
import { mdiShareVariantOutline } from "@mdi/js";
import { mdiKeyboardReturn } from "@mdi/js";
import { mdiContentSave } from "@mdi/js";
import Icon from "@mdi/react";

type scoreHeaderType = {
  file: RumFile;
  score: Score;
  scoreDeleteEventListener: () => void;
  retrunEventListener: () => void;
  shareEventListener: () => void;
  saveEventListener: () => void;
};

export default function ScoreHeader(props: scoreHeaderType) {
  return (
    <div className={styles.scoreHeader}>
      <div className={styles.scoredHeaderText + " u-nondraggable"}>
        {props.file.name}
      </div>
      <div className={styles.scoreHeaderActions}>
        <div
          className={styles.scoreHeaderButton}
          onClick={props.saveEventListener}
        >
          <Icon path={mdiContentSave} size="2rem" />
        </div>
        <div
          className={styles.scoreHeaderButton}
          onClick={props.scoreDeleteEventListener}
        >
          <Icon path={mdiTrashCanOutline} size="2rem" />
        </div>
        <div
          className={styles.scoreHeaderButton}
          onClick={props.shareEventListener}
        >
          <Icon path={mdiShareVariantOutline} size="2rem" />
        </div>
        <div
          className={styles.scoreHeaderButton}
          onClick={props.retrunEventListener}
        >
          <Icon path={mdiKeyboardReturn} size="2rem" />
        </div>
      </div>
    </div>
  );
}
