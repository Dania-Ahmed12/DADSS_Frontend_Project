import { Provider } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import store from "../src/redux/store";
import Head from "next/head";

const Drawer = dynamic(() => import("../src/components/Drawer"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    </div>
  ),
});

import "../styles/globals.css";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App({ Component, pageProps }) {
  const router = useRouter();
  const pagesWithoutDrawer = ["/"];
  const isPageWithoutDrawer = pagesWithoutDrawer.includes(router.pathname);

  return (
    <>
      <Head>
        <title>{pageProps?.title}</title>
        <link
        // href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
        // rel="stylesheet"
        ></link>
      </Head>
      {/* <Provider store={store}>
        
        {!isPageWithoutDrawer ? (
          <Drawer>
            <Component {...pageProps} />
          </Drawer>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider> */}
      <Provider store={store}>
        <ToastContainer /> {/* ToastContainer should be a child of Provider */}
        {!isPageWithoutDrawer ? (
          <>
            <Drawer>
              <Component {...pageProps} />
            </Drawer>
          </>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </>
  );
}
