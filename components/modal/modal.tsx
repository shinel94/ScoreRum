import React from "react";
import styles from "./modal.module.scss";

type ModalType = {
  open: boolean;
  modalCloseEventListener: () => void;
  modalCreateEventListener: () => void;
  header: string;
  children?: JSX.Element;
};

export const Modal = (props: ModalType) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, modalCloseEventListener, modalCreateEventListener, header } =
    props;
  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div
      className={open ? styles.openModal : styles.modal}
      onClick={modalCloseEventListener}
    >
      {open ? (
        <section
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
        >
          <header>
            {header}
            <button className="close" onClick={modalCloseEventListener}>
              &times;
            </button>
          </header>
          <main>{props.children}</main>
          <footer>
            <button
              className={styles.create}
              onClick={modalCreateEventListener}
            >
              Create
            </button>
            <button className="close" onClick={modalCloseEventListener}>
              close
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};
