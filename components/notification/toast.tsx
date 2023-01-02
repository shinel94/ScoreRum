import { useEffect } from "react";
import { useToast } from "../../store/toastContext";
import styles from "./toast.module.scss";

const Toast: React.FC = () => {
  // Context 사용
  const { show, level, content, toast, close } = useToast();

  const getLevelStyle = () => {
    switch (level) {
      case "info":
        return styles.info;
      case "warning":
        return styles.warning;
      case "error":
        return styles.error;
      case "success":
        return styles.success;
      default:
        return styles.info;
    }
  };
  return (
    <div
      className={`${styles.toast} ${getLevelStyle()} ${
        show ? styles.toastShow : ""
      }`}
    >
      <div>
        <div>{content}</div>
        <button onClick={close}>✕</button>
      </div>
    </div>
  );
};

export default Toast;
