import { useRef } from "react";
import styles from "./signUp.module.scss";

const SignUp = () => {
  const idRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  const nickNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const signUp = () => {};
  return (
    <div className={styles.formWrapper}>
      <div className={styles.inputWrapper}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            className={styles.formInput}
            type={"text"}
            placeholder="ID"
            ref={idRef}
          ></input>
          <span className={styles.invalidMessage}>
            이미 존재하는 아이디입니다.
          </span>
        </div>
      </div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.formInput}
          type={"text"}
          placeholder="Nickname"
          ref={nickNameRef}
        ></input>
      </div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.formInput}
          type={"text"}
          placeholder="Email"
          ref={emailRef}
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
        <button onClick={signUp}>
          <span>SIGN UP</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
