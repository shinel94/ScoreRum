import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Dashboard.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardBody from "../components/dashboard/dashboardBody";
import { useToast } from "../store/toastContext";
import { clientGetIsValidateToken } from "../clientAPI/auth";

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
    router.push("/");
  };
  const { toast } = useToast();

  useEffect(() => {
    if (!props.auth) {
      toast("warning", "Please check email for account authorization", 3000);
    }
  }, [props.auth]);

  useEffect(() => {
    if (!props.id || !props.email || !props.name || !props.token) {
      router.push("/");
    } else {
      const userId = props.id;
      const userEmail = props.email;
      const userName = props.name;
      const userToken = props.token;

      clientGetIsValidateToken(props.id, userToken).then((result) => {
        if (result) {
          setDashboardBody(
            <DashboardBody
              id={userId}
              email={userEmail}
              name={userName}
              auth={props.auth ? props.auth : false}
              logoutHander={logoutEventHandler}
            />
          );
        } else {
          router.push("/");
        }
      });
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
      auth: context.query.auth ? context.query.auth : null,
      token: context.query.token ? context.query.token : null,
    },
  };
};

export default Dashboard;
