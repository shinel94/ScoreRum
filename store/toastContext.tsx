import { createContext, useContext } from "react";
import React, { useState } from "react";
import { ToastLevel } from "../definition/primary";

// 알림창 Context의 State
interface State {
  show: boolean;
  level: ToastLevel;
  content: string;
  toast: (level: ToastLevel, contnet: string, duration: number) => void;
  close: () => void;
}

// 최초 useState에 들어가는 값
const defaultState: State = {
  show: false,
  level: "info",
  content: "",
  toast: (level, content, duration) => {},
  close: () => {},
};

// Provider에 들어갈 value를 생성한다.
const StateContext = createContext(defaultState);

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(defaultState);
  var closeTimeout: NodeJS.Timeout | undefined = undefined;

  // 작업 성공 시 초록색 알림창을 띄우는 함수
  const toast = (
    level: ToastLevel,
    content: string,
    duration: number = 3000
  ) => {
    close();
    clearTimeout(closeTimeout);
    setState((prev) => ({
      ...prev,
      show: true,
      level: level,
      content: content,
    }));
    closeTimeout = setTimeout(() => {
      close();
    }, duration);
  };

  // 알림창을 닫는 함수
  const close = () => {
    clearTimeout(closeTimeout);
    setState(defaultState);
  };

  const toastCtx: State = {
    show: state.show,
    level: state.level,
    content: state.content,
    toast,
    close,
  };

  return (
    <StateContext.Provider value={toastCtx}>{children}</StateContext.Provider>
  );
};

// 사용하기 편하게 훅으로 만들어준다.
export const useToast = () => {
  return useContext(StateContext);
};

export default ToastProvider;
