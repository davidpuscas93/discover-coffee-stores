import '../styles/globals.css';

import Head from 'next/head';

import { StoreProvider } from '../store/store.context';

export default function App({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Head>
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>
      <Component {...pageProps} />
    </StoreProvider>
  );
}
