import { useRouter } from "next/router";
import { useEffect } from "react";

import LoginNaver from "./naver";

type loginProps = {
  NAVER_CLIENT_ID: string;
  CALLBACK_URL: string;
};

export default function Login(props: loginProps) {
  const router = useRouter();

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
    <div>
      <LoginNaver
        NAVER_CLIENT_ID={props.NAVER_CLIENT_ID}
        CALLBACK_URL={props.CALLBACK_URL}
      ></LoginNaver>
    </div>
  );
}
