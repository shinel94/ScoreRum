import { useEffect, useState } from "react";
import { Length, Sound } from "../../definition/primary";
import Icon from "@mdi/react";
import styles from "./scoreController.module.scss";
import { mdiMusicNotePlus } from "@mdi/js";
import { mdiMusicNoteMinus } from "@mdi/js";
import { mdiMinus } from "@mdi/js";

type scoreControllerType = {
  addSoundEventListener: (keyList: string[], duration: string) => void;
  deleteSoundEventListener: () => void;
};

type drumSound = {
  hihat: Sound;
  crash: Sound;
  ride: Sound;
  snare: Sound;
  highTom: Sound;
  middleTom: Sound;
  lowTom: Sound;
  floorTom: Sound;
  base: Sound;
};

export default function ScoreController(props: scoreControllerType) {
  const lengthList: Length[] = [
    { value: "1", label: "1/1" },
    { value: "2", label: "1/2" },
    { value: "4", label: "1/4" },
    { value: "8", label: "1/8" },
    { value: "16", label: "1/16" },
    { value: "32", label: "1/32" },
  ];

  const soundList: drumSound = {
    hihat: {
      label: "HH",
      value: "g/5/x2",
    },
    crash: {
      label: "CR",
      value: "a/5/x3",
    },
    ride: {
      label: "RI",
      value: "g/5/d1",
    },
    snare: {
      label: "SN",
      value: "c/5",
    },
    highTom: {
      label: "HT",
      value: "e/5",
    },
    middleTom: {
      label: "MT",
      value: "d/5",
    },
    floorTom: {
      label: "FT",
      value: "f/4",
    },
    base: {
      label: "BA",
      value: "d/4",
    },
  };
  const [selectedLengthIdx, setSelectedLengthIdx] = useState(0);
  const [selectedSoundList, setSelectedSoundList] = useState<string[]>([]);
  const [isMinimize, setIsMinimize] = useState(false);
  const selectDrumSound = (soundValue: string) => {
    if (selectedSoundList.indexOf(soundValue) !== -1) {
      setSelectedSoundList(
        selectedSoundList.filter((sound) => {
          return sound !== soundValue;
        })
      );
    } else {
      setSelectedSoundList([...selectedSoundList, soundValue]);
    }
  };
  useEffect(() => {
    let nowIdx = selectedLengthIdx;
    const keyboardClickEvent = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyQ":
          nowIdx = nowIdx - 1;
          nowIdx = nowIdx < 0 ? 0 : nowIdx;
          setSelectedLengthIdx(nowIdx);
          return;
        case "KeyE":
          nowIdx = nowIdx + 1;
          nowIdx =
            nowIdx > lengthList.length - 1 ? lengthList.length - 1 : nowIdx;
          setSelectedLengthIdx(nowIdx);
          return;
        case "KeyA":
          selectDrumSound(soundList.hihat.value);
          return;
        case "KeyS":
          selectDrumSound(soundList.crash.value);
          return;
        case "KeyD":
          selectDrumSound(soundList.ride.value);
          return;
        case "KeyF":
          selectDrumSound(soundList.snare.value);
          return;
        case "KeyZ":
          selectDrumSound(soundList.highTom.value);
          return;
        case "KeyX":
          selectDrumSound(soundList.middleTom.value);
          return;
        case "KeyC":
          selectDrumSound(soundList.floorTom.value);
          return;
        case "KeyV":
          selectDrumSound(soundList.base.value);
          return;
        case "KeyM":
          setIsMinimize(!isMinimize);
          return;
        case "NumpadAdd":
          props.addSoundEventListener(selectedSoundList, lengthList[selectedLengthIdx].value);
          return;
        case "NumpadSubtract":
          props.deleteSoundEventListener();
        default:
          return;
      }
    };
    window.addEventListener("keydown", keyboardClickEvent);
    return () => {
      window.removeEventListener("keydown", keyboardClickEvent);
    };
  }, [selectedLengthIdx, selectedSoundList, isMinimize, props]);

  return (
    <div className={styles.scoreController} onMouseEnter={() => {
      setIsMinimize(false)
    }} onMouseLeave={() => {
      setIsMinimize(true)
    }}>
      {isMinimize ? (
        <div className={styles.scoreMinimized}>
          C
        </div>
      ) : (
        <div className={styles.scoreMaximized}>
          <div
            className={styles.scoreControllerHeader + " u-nondraggable"}
            onClick={() => {
              setIsMinimize(true);
            }}
          >
            <span>Controller</span>
            <div>
              <Icon path={mdiMinus} size="1rem" />
            </div>
          </div>
          <div className={styles.length + " u-nondraggable"}>
            <label>Length</label>
            <select
              value={selectedLengthIdx.toString()}
              onChange={(event) => {
                setSelectedLengthIdx(Number.parseInt(event.target.value));
              }}
            >
              {lengthList.map((length, index) => {
                return (
                  <option key={length.label} value={index}>
                    {length.label}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={styles.soundList}>
            <div className={styles.soundHeader + " u-nondraggable"}>
              Selected Set
            </div>
            <div className={styles.soundLine}>
              <div
                className={
                  styles.sound +
                  " " +
                  (selectedSoundList.indexOf(soundList.hihat.value) !== -1
                    ? styles.selectedSound
                    : "")
                }
                onClick={() => {
                  selectDrumSound(soundList.hihat.value);
                }}
              >
                {soundList.hihat.label}
              </div>
              <div
                className={
                  styles.sound +
                  " " +
                  (selectedSoundList.indexOf(soundList.crash.value) !== -1
                    ? styles.selectedSound
                    : "")
                }
                onClick={() => {
                  selectDrumSound(soundList.crash.value);
                }}
              >
                {soundList.crash.label}
              </div>
              <div
                className={
                  styles.sound +
                  " " +
                  (selectedSoundList.indexOf(soundList.ride.value) !== -1
                    ? styles.selectedSound
                    : "")
                }
                onClick={() => {
                  selectDrumSound(soundList.ride.value);
                }}
              >
                {soundList.ride.label}
              </div>
              <div
                className={
                  styles.sound +
                  " " +
                  (selectedSoundList.indexOf(soundList.snare.value) !== -1
                    ? styles.selectedSound
                    : "")
                }
                onClick={() => {
                  selectDrumSound(soundList.snare.value);
                }}
              >
                {soundList.snare.label}
              </div>
            </div>
            <div className={styles.soundLine}>
              <div
                className={
                  styles.sound +
                  " " +
                  (selectedSoundList.indexOf(soundList.highTom.value) !== -1
                    ? styles.selectedSound
                    : "")
                }
                onClick={() => {
                  selectDrumSound(soundList.highTom.value);
                }}
              >
                {soundList.highTom.label}
              </div>
              <div
                className={
                  styles.sound +
                  " " +
                  (selectedSoundList.indexOf(soundList.middleTom.value) !== -1
                    ? styles.selectedSound
                    : "")
                }
                onClick={() => {
                  selectDrumSound(soundList.middleTom.value);
                }}
              >
                {soundList.middleTom.label}
              </div>
              <div
                className={
                  styles.sound +
                  " " +
                  (selectedSoundList.indexOf(soundList.floorTom.value) !== -1
                    ? styles.selectedSound
                    : "")
                }
                onClick={() => {
                  selectDrumSound(soundList.floorTom.value);
                }}
              >
                {soundList.floorTom.label}
              </div>
              <div
                className={
                  styles.sound +
                  " " +
                  (selectedSoundList.indexOf(soundList.base.value) !== -1
                    ? styles.selectedSound
                    : "")
                }
                onClick={() => {
                  selectDrumSound(soundList.base.value);
                }}
              >
                {soundList.base.label}
              </div>
            </div>
          </div>
          <div className={styles.soundActions}>
            <div onClick={() => {props.addSoundEventListener(selectedSoundList, lengthList[selectedLengthIdx].value)}}>
              <Icon path={mdiMusicNotePlus} size="1rem" />
              ADD
            </div>
            <div onClick={props.deleteSoundEventListener}>
              <Icon path={mdiMusicNoteMinus} size="1rem" />
              DEL
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
