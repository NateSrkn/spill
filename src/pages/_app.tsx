import "$/styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "$/components/layout";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider>
        <Head>
          <link rel="manifest" href="manifest.json" />

          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
      <Analytics />
    </>
  );
}
