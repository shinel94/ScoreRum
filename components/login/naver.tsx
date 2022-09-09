import { useEffect } from "react";
import styles from "./naver.module.scss";
type loginNaverProps = {
  NAVER_CLIENT_ID: string;
};

export default function LoginNaver(props: loginNaverProps) {
  const loginFormWithNaver = () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: props.NAVER_CLIENT_ID,
      callbackUrl: "http://localhost:3000/naver",
      isPopup: false,
      loginButton: { color: "white", type: 2, height: "45" },
    });
    naverLogin.init();
  };

  useEffect(() => {
    loginFormWithNaver();
  }, []);

  return <div id="naverIdLogin" className={styles.loginWrapper} />;
}
