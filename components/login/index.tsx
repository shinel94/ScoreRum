import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";

import SignIn from "./signIn";

type loginProps = {};

export default function Login(props: loginProps) {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    if (window.location.href.includes("access_token")) {
      window.localStorage.setItem(
        "token",
        window.location.href.split("=")[1].split("&")[0] ?? "none"
      );
      router.push("/");
    }
  }, [router]);

  return (
    <>
      {showLogin ? <SignIn /> : <></>}
      <div className={styles.signText}>
        {showLogin ? (
          <div onClick={() => {setShowLogin(false)}}>
            계정이 없으신가요? <span>생성</span>
          </div>
        ) : (
          <div onClick={() => {setShowLogin(true)}}>
            로그인 화면 <span>돌아가기</span>
          </div>
        )}
      </div>
    </>
  );
}
