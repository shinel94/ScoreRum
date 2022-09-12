import styles from "./scoreBody.module.scss";
import Vex from "vexflow";
import { RumFile, Score } from "../../definition/derived";
import { useEffect, useState } from "react";
import ScoreController from "./scoreController";
import ScoreHeader from "./scoreHeader";
import { updateScoreContent } from "../../clientAPI/dashboard";

type scoreBodyType = {
  file: RumFile;
  score: Score;
  deleteScoreEventListener: () => void;
  scoreCloseEventListener: () => void;
};

const { Renderer, Stave, StaveNote, Formatter, Beam } = Vex.Flow;

export default function ScoreBody(props: scoreBodyType) {
  const staveNum = 12;
  const [pageNum, setPageNum] = useState(0);

  const [scoreNoteList, setScoreNoteList] = useState<Vex.StaveNote[][]>(
    props.score.getScoreNoteList()
  );

  const [pageNoteList, setPageNoteList] = useState<Vex.StaveNote[]>(
    scoreNoteList[pageNum]
  );

  const addNoteEventListener = (keyList: string[], duration: string) => {
    if (keyList.length === 0) {
      return;
    }
    scoreNoteList[pageNum] = [
      ...scoreNoteList[pageNum],
      new StaveNote({ keys: keyList, duration: duration }),
    ];
    setScoreNoteList(scoreNoteList);
    setPageNoteList(scoreNoteList[pageNum]);
  };

  const deleteNoteEventListener = () => {
    scoreNoteList[pageNum] = scoreNoteList[pageNum].slice(
      0,
      scoreNoteList[pageNum].length - 1
    );
    setScoreNoteList(scoreNoteList);
    setPageNoteList(scoreNoteList[pageNum]);
  };

  const nextPage = () => {
    setPageNum(pageNum + 1);
  };
  const prevPage = () => {
    setPageNum(pageNum > 0 ? pageNum - 1 : pageNum);
  };

  const saveScoreEventHandler = () => {
    props.score.noteList = scoreNoteList;
    updateScoreContent(props.score.scoreId, props.score.toContent());
  };

  useEffect(() => {
    if (scoreNoteList.length < pageNum + 1) {
      scoreNoteList.push([]);
      setScoreNoteList([...scoreNoteList]);
    }
    setPageNoteList(scoreNoteList[pageNum]);
  }, [pageNum]);

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
          let sNowNoteList: Vex.StaveNote[] = [];
          let sConnectedNoteList: Vex.StaveNote | Vex.StemmableNote[] = [];
          let sBeamNoteList: Vex.Beam[] = [];
          while (sSelectedNoteIdx < pageNoteList.length && sNowLength > 0) {
            const sDuration =
              4 / parseInt(pageNoteList[sSelectedNoteIdx].getDuration());

            sNowNoteList.push(pageNoteList[sSelectedNoteIdx]);
            sConnectedNoteList.push(pageNoteList[sSelectedNoteIdx]);
            sNowLength -= sDuration;
            if (sDuration > 1) {
              sConnectedNoteList.splice(0, sConnectedNoteList.length);
            } else {
              if (pageNoteList[sSelectedNoteIdx].getNoteType() === "r") {
                sConnectedNoteList.splice(0, sConnectedNoteList.length);
              } else if (sNowLength - Math.floor(sNowLength) === 0) {
                sBeamNoteList.push(
                  ...Beam.generateBeams(
                    sConnectedNoteList.splice(0, sConnectedNoteList.length),
                    { stem_direction: 1 }
                  )
                );
              }
            }

            //
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
          }
          if (sNowNoteList.length !== 0) {
            Formatter.FormatAndDraw(context, stave, sNowNoteList);
            sBeamNoteList.forEach((beam) => {
              beam.setContext(context).draw();
            });
          }
        }
      }
    }
  }, [staveNum, pageNoteList]);

  return (
    <div className={styles.score}>
      <ScoreHeader
        file={props.file}
        score={props.score}
        scoreDeleteEventListener={props.deleteScoreEventListener}
        retrunEventListener={props.scoreCloseEventListener}
        shareEventListener={() => {
          alert("Developing Score share");
        }}
        saveEventListener={saveScoreEventHandler}
      />
      <div
        className={styles.socrePage + " u-nondraggable"}
      >{`- Page ${pageNum} - `}</div>
      <div className={styles.scoreBody} />
      <ScoreController
        addSoundEventListener={addNoteEventListener}
        deleteSoundEventListener={deleteNoteEventListener}
        nextPage={nextPage}
        prevPage={prevPage}
      />
    </div>
  );
}
