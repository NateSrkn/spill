import "$/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "$/components/layout";
import { Provider as JotaiProvider } from "jotai";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <main>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </JotaiProvider>
  );
}
