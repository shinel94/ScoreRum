import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Dashboard.module.scss";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardBody from "../components/dashboard/dashboardBody";

type dashboardPropType = {
  NAVER_CLIENT_ID: string
  id: string | null,
  email: string | null,
  name: string | null
}

const Dashboard: NextPage<dashboardPropType, {}> = (props) => {
  const router = useRouter()
  const [dashboardBody, setDashboardBody] = useState<JSX.Element | undefined>(undefined)
  const logoutEventHandler = () => {
    router.push("/");
  }
  useEffect(() => {
    if (!props.id || !props.email || !props.name) {
      router.push("/")
    } else {
      setDashboardBody(<DashboardBody id={props.id} email={props.email} name={props.name} logoutHander={logoutEventHandler} />)
    }
  }, [props, router])
  
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

      <main>
        {dashboardBody}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props : {
      NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID ? process.env.NAVER_CLIENT_ID : '',
      id: context.query.id ? context.query.id : null, 
      email: context.query.email ? context.query.email : null,
      name: context.query.name ? context.query.name : null,
    }
    
  }
}

export default Dashboard;
