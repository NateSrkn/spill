import Head from "next/head";
import { useReceiptStore } from "$/store";
import Header from "$/components/header";
import { Items } from "$/components/Items";
import { People } from "$/components/People";
import { ReceiptMeta } from "../components/ReceiptMeta";
import { TaxAndTip } from "../components/TaxAndTip";
import { Share } from "../components/Share";

export default function Home() {
  const receipt = useReceiptStore();
  const updateReceiptMeta = useReceiptStore((state) => state.updateMeta);
  return (
    <>
      <Head>
        <title>{receipt.title + " | Spill"}</title>
        <meta
          name="description"
          content="Spill is the easiest way to split the bill with your friends"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="wrapper">
        <Header />
        <div className="flex flex-col gap-6 max-w-md mx-auto px-[10px] pb-6">
          <ReceiptMeta
            receipt={receipt}
            handleUpdateReceiptMeta={updateReceiptMeta}
          />
          <People />
          <Items />
          <TaxAndTip handleUpdateReceiptMeta={updateReceiptMeta} />
        </div>
      </section>
      <Share receipt={receipt} />
    </>
  );
}
