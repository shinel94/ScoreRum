import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Dashboard.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardBody from "../components/dashboard/dashboardBody";
import { useToast } from "../store/toastContext";
import { clientGetUserInfoByToken } from "../clientAPI/auth";

type dashboardPropType = {
  id: string | null;
  email: string | null;
  name: string | null;
  auth: boolean | null;
  loginName: string | null;
  token: string | null;
};

const Dashboard: NextPage<dashboardPropType, {}> = (props) => {
  const router = useRouter();
  const [dashboardBody, setDashboardBody] = useState<JSX.Element | undefined>(
    undefined
  );
  const logoutEventHandler = () => {
    localStorage.removeItem("U-I")
    localStorage.removeItem("U-T")
    router.push("/");
  };
  const { toast, close } = useToast();

  useEffect(() => {
    if (!props.auth) {
      toast("warning", "Please check email for account authorization", 3000);
    } else {
      close()
    }
  }, [props.auth]);

  useEffect(() => {
    if (!props.id || !props.email || !props.name || !props.token) {
      
      const savedId = localStorage.getItem("U-I")
      const saveToken = localStorage.getItem("U-T")
      if (savedId && saveToken) {
        clientGetUserInfoByToken(savedId, saveToken).then((userInfo) => {
          router.push(
            `/dashboard?id=${userInfo.dbId}&name=${userInfo.nickName}&email=${userInfo.email}&auth=${userInfo.isEmailAuth}&loginName=${userInfo.loginName}&token=${userInfo.token}`,
            "/dashboard"
          );
        }).catch(() => {
          router.push("/");
        });
      } else {
        router.push("/");
      }
      
    } else {
      setDashboardBody(
        <DashboardBody
          id={props.id}
          email={props.email}
          name={props.name}
          loginName={props.loginName ? props.loginName : ''}
          auth={props.auth ? props.auth : false}
          logoutHander={logoutEventHandler}
        />
      );
      
    }
  }, [props, router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Score-Rum</title>
        <meta
          name="description"
          content="Score Drwa Tool For Drummer by Drummer"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>{dashboardBody}</main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      id: context.query.id ? context.query.id : null,
      email: context.query.email ? context.query.email : null,
      name: context.query.name ? context.query.name : null,
      loginName: context.query.loginName ? context.query.loginName : null,
      auth: context.query.auth ==="true" ? true : false,
      token: context.query.token ? context.query.token : null,
    },
  };
};

export default Dashboard;
