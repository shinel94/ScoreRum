import { useRef } from "react";
import styles from "./signIn.module.scss";
const SignIn = () => {
  const idRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.formWrapper}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.formInput}
          type={"text"}
          placeholder="ID"
          ref={idRef}
        ></input>
      </div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.formInput}
          type={"password"}
          placeholder="PASSWORD"
          ref={pwdRef}
        ></input>
      </div>
      <div className={styles.buttonWrapper}>
        <button>
          <span>SIGN IN</span>
        </button>
      </div>
    </div>
  );
};

export default SignIn;
