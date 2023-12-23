import React, { useEffect } from "react";
import type { AppProps } from "next/app";

import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "../store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
