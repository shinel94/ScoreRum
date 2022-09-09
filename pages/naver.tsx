import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getUserInfo, postUser } from "../clientAPI/naver";
import NaverCallback from "../components/login/naverCallback";
import { UserInfo } from "../definition/primary";

type naverCallbackePropType = {
  NAVER_CLIENT_ID: string;
};
const NaverCallbackPage: NextPage<naverCallbackePropType, {}> = (props) => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>(undefined);
  const content = JSON.stringify(userInfo);
  const getUserInfoById: (callbackInfo: UserInfo) => void = (callbackInfo) => {
    getUserInfo(callbackInfo.id)
      .then((aUserInfo) => {
        if (aUserInfo === undefined) {
            postUser({
                id: callbackInfo.id,
                name: callbackInfo.name,
                age: callbackInfo.age,
                email: callbackInfo.email,
                gender: callbackInfo.gender,
                token: callbackInfo.token
            })
            setUserInfo({
              id: callbackInfo.id,
              name: callbackInfo.name,
              age: callbackInfo.age,
              email: callbackInfo.email,
              gender: callbackInfo.gender,
              token: callbackInfo.token
          })
        } else {
            setUserInfo(aUserInfo);
        }
        
      })
  };
  useEffect(() => {
    if (userInfo !== undefined) {
      router.push(`/dashboard?id=${userInfo.id}&name=${userInfo.name}&email=${userInfo.email}`, "/dashboard");
    }
  }, [userInfo, router])
  return (
    <div>
      <NaverCallback
        NAVER_CLIENT_ID={props.NAVER_CLIENT_ID}
        getUserInfo={getUserInfoById}
      />
      <h1>로그인 중 입니다.</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID
        ? process.env.NAVER_CLIENT_ID
        : "",
    },
  };
};

export default NaverCallbackPage;
