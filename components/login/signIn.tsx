import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { clientGetUserInfo } from "../../clientAPI/auth";
import { useToast } from "../../store/toastContext";
import styles from "./signIn.module.scss";
const SignIn = () => {
  const idRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const signIn = () => {
    const idInput = idRef ? (idRef.current ? idRef.current.value : "") : "";
    const pwdInput = pwdRef ? (pwdRef.current ? pwdRef.current.value : "") : "";
    if (idInput.length * pwdInput.length > 0) {
      clientGetUserInfo(idInput, pwdInput)
        .then((userInfo) => {
          if (userInfo) {
            router.push(
              `/dashboard?id=${userInfo.dbId}&name=${userInfo.nickName}&email=${userInfo.email}&auth=${userInfo.isEmailAuth}&loginName=${userInfo.loginName}&token=${userInfo.token}`,
              "/dashboard"
            );
          } else {
            toast("error", "fail login score rum", 1000);
          }
        })
        .catch((error) => {
          toast("error", "fail login score rum", 1000);
        });
    }
  };

  useEffect(() => {
    const current = pwdRef.current;
    const enterKeyEvent = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        signIn();
      }
    };
    if (pwdRef) {
      current?.addEventListener("keydown", enterKeyEvent);
    }
    return () => {
      current?.removeEventListener("keydown", enterKeyEvent);
    };
  }, [pwdRef]);
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
        <button onClick={signIn}>
          <span>SIGN IN</span>
        </button>
      </div>
    </div>
  );
};

export default SignIn;
