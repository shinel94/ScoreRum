import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
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
  const getUserInfoById: (callbackInfo: {age: string, gender: string, id: string, name: string, token: string}) => void = (callbackInfo) => {
    getUserInfo(callbackInfo.id)
      .then((userInfo) => {
        console.log('userInfo', userInfo)
        if (userInfo === undefined) {
            postUser({
                id: callbackInfo.id,
                name: callbackInfo.name,
                age: callbackInfo.age,
                gender: callbackInfo.gender,
                token: callbackInfo.token
            })
        } else {
            setUserInfo(userInfo);
        }
        
      })
      .finally(() => {
        if (router.pathname !== "/") {
          router.push("/", undefined, { shallow: true });
        }
      });
  };
  return (
    <div>
      <NaverCallback
        NAVER_CLIENT_ID={props.NAVER_CLIENT_ID}
        getUserInfo={getUserInfoById}
      />
      {content}
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
