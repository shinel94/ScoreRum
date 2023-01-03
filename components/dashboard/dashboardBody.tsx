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
import { StaveNote } from "vexflow";
import ScoreBody from "../scores/scoreBody";
import ScoreHeader from "../scores/scoreHeader";
import styles from "./dashboardBody.module.scss";
import DashboardFileList from "./dashboardFileList";
import DashboardHeader from "./dashboardHeader";
import { useToast } from "../../store/toastContext";

type dashboardBodyType = {
  id: string;
  name: string;
  email: string;
  auth: boolean;
  logoutHander: () => void;
};

export default function DashboardBody(props: dashboardBodyType) {
  const [basePathList, setBasePathList] = useState<string[]>([props.name]);
  const [fileList, setFileList] = useState<RumFile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isFileCreateModalShow, setIsFileCreateModalShow] = useState(false);
  const [isScoreCreateModalShow, setIsScoreCreateModalShow] = useState(false);
  const [isUserInfoModalShow, setIsUserInfoModalShow] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<RumFile | undefined>(
    undefined
  );
  const [selectedScore, setSelectedScore] = useState<Score | undefined>(
    undefined
  );
  const { toast } = useToast();

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
    if (!props.auth && fileList.length > 3) {
      toast(
        "error",
        "need to account authorization for create more score",
        3000
      );
      setIsFileCreateModalShow(false);
      setIsScoreCreateModalShow(false);
      setIsCreating(false);
      return;
    }

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
  const deleteScoreEventListener = () => {
    if (selectedFile === undefined) {
      return;
    }
    deleteFile(props.id, selectedFile.name, selectedFile.basePath).then(() => {
      setFileList(
        fileList.filter((file) => {
          return file.fileId !== (selectedFile ? selectedFile.fileId : "");
        })
      );
      setSelectedFile(undefined);
      setSelectedScore(undefined);
    });
  };

  const scoreCloseEventListener = () => {
    setSelectedFile(undefined);
    setSelectedScore(undefined);
  };

  useEffect(() => {
    fetchFileList(basePathList.join("/"));
  }, [fetchFileList, basePathList]);

  return (
    <div>
      {selectedScore === undefined || selectedFile === undefined ? (
        <div className={styles.dashboard}>
          <DashboardHeader
            auth={props.auth}
            basePath={basePathList.join(" / ")}
            setCreateDirectoryEventListener={() => {
              setFileName("");
              setIsFileCreateModalShow(true);
            }}
            setCreateScoreEventListener={() => {
              setFileName("");
              setIsScoreCreateModalShow(true);
            }}
            setUserInfoEventListener={() => {
              setIsUserInfoModalShow(true);
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
              eventButtonName="create"
              eventButtonListener={() => {
                createFileEventListener(FileType.directory);
              }}
            >
              <div className={styles.modalBody}>
                <div>
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
              </div>
            </Modal>
            <Modal
              header="Create New Score"
              open={isScoreCreateModalShow}
              modalCloseEventListener={() => {
                setIsScoreCreateModalShow(false);
              }}
              eventButtonName="create"
              eventButtonListener={() => {
                createFileEventListener(FileType.file);
              }}
            >
              <div className={styles.modalBody}>
                <div>
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
              </div>
            </Modal>
            <Modal
              header="UserInfo"
              open={isUserInfoModalShow}
              modalCloseEventListener={() => {
                setIsUserInfoModalShow(false);
              }}
              eventButtonName="Logout"
              eventButtonListener={() => {
                props.logoutHander();
              }}
            >
              <div className={styles.modalBody}>
                <div>
                  <label>Name</label>
                  <input readOnly value={props.name} />
                </div>
                <div>
                  <label>Email</label>
                  <input readOnly value={props.email} />
                </div>
              </div>
            </Modal>
          </section>
        </div>
      ) : (
        <div className={styles.score}>
          <ScoreBody
            file={selectedFile}
            score={selectedScore}
            deleteScoreEventListener={deleteScoreEventListener}
            scoreCloseEventListener={scoreCloseEventListener}
          />
        </div>
      )}
    </div>
  );
}
