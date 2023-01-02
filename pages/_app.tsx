import "../styles/globals.scss";
import type { AppProps } from "next/app";
import ToastProvider from "../store/toastContext";
import Toast from "../components/notification/toast";

declare global {
  interface Window {
    Kakao: any;
    naver: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  // useEffect(() => {
  //   try {
  //     if (!window.Kakao.isInitialized() && window.Kakao) {
  //       window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);
  return (
    <ToastProvider>
      <Toast />
      <Component {...pageProps} />
    </ToastProvider>
  );
}

export default MyApp;
