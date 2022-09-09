import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./naver.module.scss";
type naverCallback = {
  NAVER_CLIENT_ID: string;
  getUserInfo: (callbackInfo: {age: string, gender: string, id: string, name: string, token: string}) => void;
};

export default function NaverCallback(props: naverCallback) {
  useEffect(() => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: props.NAVER_CLIENT_ID,
    });
    naverLogin.init();
    const accessTokenQuery = window.location.href.split('#')[1].split('&').find(text => {
      return text.split('=')[0] === 'access_token'
    })
    if (accessTokenQuery === undefined) {
      return
    }
    const token = accessTokenQuery.split('=')[1]
    naverLogin.getLoginStatus((status: any) => {
      if (status) {
        props.getUserInfo({...naverLogin.user, token: token});
      }
    });
  }, []);

  return <div></div>;
}
