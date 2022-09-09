import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import Icon from "@mdi/react";
import { mdiMusicNoteEighth } from "@mdi/js";
import Login from "../components/login";

type homePropType = {
  NAVER_CLIENT_ID: string
}

const Home: NextPage<homePropType, {}> = (props) => {
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

      <main className={styles.loginWrapper}>
        <div className={styles.headerWrapper}>
          <Icon path={mdiMusicNoteEighth} size="4rem" />
          <h1>Score Rum</h1>
        </div>
        <div className={styles.loginButtonWrapper}>
          <Login NAVER_CLIENT_ID={props.NAVER_CLIENT_ID}/>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props : {
      NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID ? process.env.NAVER_CLIENT_ID : ''
    }
    
  }
}

export default Home;
