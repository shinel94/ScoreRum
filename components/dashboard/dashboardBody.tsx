import { useCallback, useEffect, useState } from "react";
import {
  createFile,
  deleteFile,
  getScoreContent,
  getFileList,
} from "../../clientAPI/dashboard";
import { RumFile, Score } from "../../definition/derived";
import { FileType } from "../../definition/primary";
import { Modal } from "../modal/modal";
import ScoreBody from "../scores/scoreBody";
import ScoreHeader from "../scores/scoreHeader";
import styles from "./dashboardBody.module.scss";
import DashboardFileList from "./dashboardFileList";
import DashboardHeader from "./dashboardHeader";

type dashboardBodyType = {
  id: string;
  name: string;
  email: string;
};

export default function DashboardBody(props: dashboardBodyType) {
  const [basePathList, setBasePathList] = useState<string[]>([props.name]);
  const [fileList, setFileList] = useState<RumFile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isFileCreateModalShow, setIsFileCreateModalShow] = useState(false);
  const [isScoreCreateModalShow, setIsScoreCreateModalShow] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<RumFile | undefined>(
    undefined
  );
  const [selectedScore, setSelectedScore] = useState<Score | undefined>(
    undefined
  );

  const fetchFileList = useCallback((basePath: string) => {
    getFileList(props.id, basePath).then((data) => {
      setFileList(data);
    });
  }, []);

  const clickFile = (file: RumFile) => {
    if (file.fileType === FileType.directory) {
      setBasePathList([...basePathList, file.name]);
    } else {
      getScoreContent(file.scoreId).then((scoer) => {
        if (scoer !== undefined) {
          setSelectedFile(file);
          setSelectedScore(scoer);
        }
      });
    }
  };

  const createFileEventListener = (fileType: FileType) => {
    if (fileName.trim().length === 0) {
      alert("File name can't be empty");
      return;
    }
    setIsCreating(true);
    createFile(props.id, basePathList.join("/"), fileName, fileType)
      .then(() => {
        setIsFileCreateModalShow(false);
        setIsScoreCreateModalShow(false);
        fetchFileList(basePathList.join("/"));
      })
      .finally(() => {
        setIsCreating(false);
      });
  };

  const returnToPrevious = () => {
    if (basePathList.length > 1) {
      basePathList.pop();
      setBasePathList([...basePathList]);
    }
  };

  const deleteDirectoryEventListener = () => {
    if (fileList.length !== 0) {
      alert("Directory can remove when fileList is empty");
      return;
    } else if (basePathList.length === 1) {
      alert("Base Directory Can't remove");
      return;
    } else {
      deleteFile(
        props.id,
        basePathList[basePathList.length - 1],
        basePathList.slice(0, basePathList.length - 1).join("/")
      ).then(() => {
        setBasePathList(basePathList.slice(0, basePathList.length - 1));
      });
    }
  };

  useEffect(() => {
    fetchFileList(basePathList.join("/"));
  }, [fetchFileList, basePathList]);

  return (
    <div className={styles.dashboardBody}>
      {selectedScore === undefined || selectedFile === undefined ? (
        <>
          <DashboardHeader
            basePath={basePathList.join(" / ")}
            setCreateDirectoryEventListener={() => {
              setFileName("");
              setIsFileCreateModalShow(true);
            }}
            setCreateScoreEventListener={() => {
              setFileName("");
              setIsScoreCreateModalShow(true);
            }}
            returnToPrevious={returnToPrevious}
            deleteDirectoryEventListener={deleteDirectoryEventListener}
          />

          <section className="dashboardContent">
            <DashboardFileList
              fileList={fileList}
              fileClickEventListener={clickFile}
            />
          </section>

          <section className="modal">
            <Modal
              header="Create Directory"
              open={isFileCreateModalShow}
              modalCloseEventListener={() => {
                setIsFileCreateModalShow(false);
              }}
              modalCreateEventListener={() => {
                createFileEventListener(FileType.directory);
              }}
            >
              <div className={styles.modalBody}>
                <label>Name</label>
                <input
                  onChange={(event) => {
                    event.target.value = event.target.value
                      .replaceAll("/", "")
                      .replaceAll("\\", "");
                    setFileName(event.target.value);
                  }}
                />
              </div>
            </Modal>
            <Modal
              header="Create New Score"
              open={isScoreCreateModalShow}
              modalCloseEventListener={() => {
                setIsScoreCreateModalShow(false);
              }}
              modalCreateEventListener={() => {
                createFileEventListener(FileType.file);
              }}
            >
              <div className={styles.modalBody}>
                <label>Name</label>
                <input
                  onChange={(event) => {
                    event.target.value = event.target.value
                      .replaceAll("/", "")
                      .replaceAll("\\", "");
                    setFileName(event.target.value);
                  }}
                />
              </div>
            </Modal>
          </section>
        </>
      ) : (
        <>
          <ScoreHeader file={selectedFile} score={selectedScore} />
          <ScoreBody file={selectedFile} score={selectedScore} />
        </>
      )}
    </div>
  );
}
