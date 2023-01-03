import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { clientGetIsExistId, clientPostCreateUser } from "../../clientAPI/auth";
import { useToast } from "../../store/toastContext";
import { isEmail } from "../../utils/regex";
import styles from "./signUp.module.scss";

let buffer: number | NodeJS.Timeout | undefined = undefined;

const SignUp = () => {
  const [idInput, setIdInput] = useState("");
  const [pwdInput, setPwdInput] = useState("");
  const [nickNameInput, setNickNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const [validate, setValidate] = useState({
    id: false,
    pwd: false,
    nickName: false,
    email: false,
  });

  const isValidate =
    validate.id && validate.pwd && validate.nickName && validate.email;

  const idExistMessageRef = useRef<HTMLSpanElement>(null);
  const invalidEmailMessageRef = useRef<HTMLSpanElement>(null);
  const shortPasswordMessageRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    clearTimeout(buffer);
    if (idInput.length > 0) {
      buffer = setTimeout(() => {
        clientGetIsExistId(idInput).then((exist) => {
          if (exist) {
            idExistMessageRef.current?.classList.remove("u-hide");
          } else {
            idExistMessageRef.current?.classList.add("u-hide");
            setValidate((prev) => {
              return {
                ...prev,
                id: true,
              };
            });
          }
        });
      });
    }
  }, [idInput]);

  useEffect(() => {
    setValidate((prev) => {
      return {
        ...prev,
        nickName: nickNameInput.length > 0,
      };
    });
  }, [nickNameInput]);

  useEffect(() => {
    if (isEmail(emailInput)) {
      invalidEmailMessageRef.current?.classList.add("u-hide");
      setValidate((prev) => {
        return {
          ...prev,
          email: true,
        };
      });
    } else {
      invalidEmailMessageRef.current?.classList.remove("u-hide");
      setValidate((prev) => {
        return {
          ...prev,
          email: false,
        };
      });
    }
  }, [emailInput]);

  useEffect(() => {
    if (pwdInput.length >= 8) {
      shortPasswordMessageRef.current?.classList.add("u-hide");
      setValidate((prev) => {
        return {
          ...prev,
          pwd: true,
        };
      });
    } else {
      shortPasswordMessageRef.current?.classList.remove("u-hide");
      setValidate((prev) => {
        return {
          ...prev,
          pwd: false,
        };
      });
    }
  }, [pwdInput]);

  const signUp = () => {
    if (isValidate) {
      clientPostCreateUser(idInput, pwdInput, nickNameInput, emailInput)
        .then((userInfo) => {
          if (userInfo) {
            router.push(
              `/dashboard?id=${userInfo.dbId}&name=${userInfo.nickName}&email=${userInfo.email}&auth=${userInfo.isEmailAuth}&loginName=${userInfo.loginName}&token=${userInfo.token}`,
              "/dashboard"
            );
          } else {
            toast("error", "fail create user", 3000);
          }
        })
        .catch((error) => {
          toast("error", "fail login score rum", 1000);
        });
    }
  };
  return (
    <div className={styles.formWrapper}>
      <div className={styles.inputWrapper}>
        <input
          className={styles.formInput}
          type={"text"}
          placeholder="ID"
          onChange={(event) => {
            setIdInput(event.target.value);
          }}
        ></input>
        <div className={styles.invalidMessage}>
          <span ref={idExistMessageRef}>이미 존재하는 아이디입니다.</span>
        </div>
      </div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.formInput}
          type={"text"}
          placeholder="Nickname"
          onChange={(event) => {
            setNickNameInput(event.target.value);
          }}
        ></input>
      </div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.formInput}
          type={"text"}
          placeholder="Email"
          onChange={(event) => {
            setEmailInput(event.target.value);
          }}
        ></input>
        <div className={styles.invalidMessage}>
          <span ref={invalidEmailMessageRef}>정확한 이메일을 입력해주세요</span>
        </div>
      </div>
      <div className={styles.inputWrapper}>
        <input
          className={styles.formInput}
          type={"password"}
          placeholder="PASSWORD"
          onChange={(event) => {
            setPwdInput(event.target.value);
          }}
        ></input>
        <div className={styles.invalidMessage}>
          <span ref={shortPasswordMessageRef}>8자 이상으로 설정해주세요</span>
        </div>
      </div>
      <div className={styles.buttonWrapper}>
        <button onClick={signUp} disabled={!isValidate}>
          <span>SIGN UP</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
