import Joyride from "react-joyride";
import styles from "./scoreBody.module.scss";
import controllerStyles from "./scoreController.module.scss";
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
  const [runTour, setRunTour] = useState<boolean>(false);
  const steps = [
    {
      target: `.${styles.scoreBody}`,
      content: "Drummer를 위한 악보 툴 Score rum에 오신 것을 환영합니다.",
    },
    {
      target: `.${styles.scoreBody}`,
      content:
        "드럼 악보를 볼줄 안다고 생각하고, shot을 채우는 방법을 알려드리겠습니다.",
    },
    {
      target: `.${controllerStyles.scoreController}`,
      content:
        "마우스를 통해서 이 패널을 제어해서 악보를 그릴 수 있습니다.",
    },
    {
      target: `.${controllerStyles.length}`,
      content:
        "이것을 통해서 음표의 길이를 제어할 수 있습니다.",
    },
    {
      target: `.${controllerStyles.rest}`,
      content:
        "이 버튼을 통해서 쉼표를 입력할 수 있습니다. 이때 쉼표를 선택하면, 다른 악기 음표는 표시되지 않습니다.",
    },
    {
      target: `.${controllerStyles.soundList}`,
      content:
        "이 패널을 통해서 드럼 악기의 음표를 그릴 수 있습니다.",
    },
    {
      target: `.${controllerStyles.soundList}`,
      content:
        "다음과 같이 약어로 악기를 표현합니다.",
    },
    {
      target: `.${controllerStyles.soundList}`,
      content:
        "HH: high hat / CR: crash / RI: ride / SN: snare",
    },
    {
      target: `.${controllerStyles.soundList}`,
      content:
        "HT: high top / MT: middle top / FT: floor top / BA: base drum",
    },
    
    {
      target: `.${controllerStyles.soundList}`,
      content:
        "각각 악기는 토글 형태로, 선택됨과 선택되지 않음으로 나뉩니다.",
    },
    {
      target: `.${controllerStyles.soundActions}`,
      content:
        "ADD 버튼을 통해서 선택된 악기를 선택한 길이의 음표로 추가합니다.",
    },
    {
      target: `.${controllerStyles.soundActions}`,
      content:
        "DEL 버튼을 통해서 마지막에 추가된 음표를 제거합니다.",
    },
    {
      target: `.${styles.scoreBody}`,
      content:
        "제어 패널을 사용하지 않고 키보드로도 악보를 그릴 수 있습니다.",
    },
    {
      target: `.${styles.scoreBody}`,
      content:
        "음표 길이 제어는 Q(늘리기)와 E(줄이기)로 할 수 있습니다.",
    },
    {
      target: `.${styles.scoreBody}`,
      content:
        "쉼표는 R 로 선택 및 해제할 수 있습니다.",
    },
    {
      target: `.${styles.scoreBody}`,
      content:
        "그리고 악기의 경우, 패널의 첫번째 줄은 순서대로 ASDF",
    },
    {
      target: `.${styles.scoreBody}`,
      content:
        "패널의 두번째 줄은 순서대로 ZXCV 를 나타냅니다.",
    },
    {
      target: `.${styles.scoreBody}`,
      content:
        "다시말해서 A는 high hat / F는 snare / V는 base drum을 나타냅니다.",
    },
    {
      target: `.${styles.scoreBody}`,
      content:
        "그리고 숫자패드의 +와 -로 각각 음표를 추가하고 제거할 수 있습니다.",
    },
    {
      target: `.${styles.scoreBody}`,
      content:
        "그럼 이제 여러분의 악보를 그려보세요",
    },
  ];

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
    setRunTour(true);
  }, []);

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
      <Joyride
        steps={steps}
        continuous
        hideCloseButton
        showProgress
        run={runTour}
      />
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
