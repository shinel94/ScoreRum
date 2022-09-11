import styles from "./scoreBody.module.scss";
import Vex from "vexflow";
import { RumFile, Score } from "../../definition/derived";
import { useEffect, useState } from "react";
import ScoreController from "./scoreController";

type scoreBodyType = {
  file: RumFile;
  score: Score;
};

const { Renderer, Stave, StaveNote, Formatter } = Vex.Flow;

export default function ScoreBody(props: scoreBodyType) {
  const [pageNum, setPageNum] = useState(1);
  const [staveNum, setStaveNum] = useState(12);
  // const [noteList, setNoteList] = useState(props.score.getNoteList());

  const [noteList, setNoteList] = useState<Vex.StaveNote[]>([]);

  const addNoteEventListener = (keyList: string[], duration: string) => {
    if (keyList.length === 0) {
      return;
    }
    setNoteList([
      ...noteList,
      new StaveNote({ keys: keyList, duration: duration }),
    ]);
  };

  const deleteNoteEventListener = () => {
    setNoteList([...noteList.slice(0, noteList.length - 1)]);
    console.log(noteList)
  };

  useEffect(() => {
    const targetElement = document.getElementsByClassName(
      styles.scoreBody
    )[0] as HTMLCanvasElement;

    if (targetElement) {
      while (targetElement.lastElementChild) {
        targetElement.removeChild(targetElement.lastElementChild);
      }

      const staveWidth = Math.floor((targetElement.clientWidth - 25 - 120) / 4);

      const renderer = new Renderer(targetElement, Renderer.Backends.SVG);
      renderer.resize(targetElement.clientWidth, 50 + 150 * staveNum);
      const context = renderer.getContext();
      let sSelectedNoteIdx = 0;
      for (let i = 0; i < staveNum; i++) {
        for (let j = 0; j < 4; j++) {
          const stave = new Stave(
            25 + j * staveWidth,
            50 + 150 * i,
            staveWidth
          );
          if (j === 0) {
            stave.addClef("treble");
            if (i === 0) {
              stave.addClef("percussion");
            }
          }
          stave.setContext(context).draw();

          let sNowLength = 4;
          let sNowNoteList = [];
          while (sSelectedNoteIdx < noteList.length && sNowLength > 0) {
            sNowLength -=
              4 / parseInt(noteList[sSelectedNoteIdx].getDuration());
            sNowNoteList.push(noteList[sSelectedNoteIdx]);
            sSelectedNoteIdx += 1;
          }
          while (sNowNoteList.length !== 0 && sNowLength < 4) {
            if (sNowLength === 0) {
              break;
            }
            let restLength = 0;
            if (sNowLength >= 4 * Math.pow(2, 0)) {
              restLength = 1;
            } else if (sNowLength >= 4 * Math.pow(2, -1)) {
              restLength = 2;
            } else if (sNowLength >= 4 * Math.pow(2, -2)) {
              restLength = 4;
            } else if (sNowLength >= 4 * Math.pow(2, -3)) {
              restLength = 8;
            } else if (sNowLength >= 4 * Math.pow(2, -4)) {
              restLength = 16;
            } else if (sNowLength >= 4 * Math.pow(2, -5)) {
              restLength = 32;
            } else if (sNowLength >= 4 * Math.pow(2, -6)) {
              restLength = 64;
            } else {
              break;
            }
            sNowLength = sNowLength - 4 / restLength;

            sNowNoteList.push(
              new StaveNote({ keys: ["c/5"], duration: `${restLength}r` })
            );
            console.log(sNowLength);
          }
          if (sNowNoteList.length !== 0) {
            Formatter.FormatAndDraw(context, stave, sNowNoteList);
          }
        }
      }
    }
  }, [staveNum, noteList]);

  return (
    <>
      <div className={styles.scoreBody} />
      <ScoreController
        addSoundEventListener={addNoteEventListener}
        deleteSoundEventListener={deleteNoteEventListener}
      />
    </>
  );
}
