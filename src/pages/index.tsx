import Head from "next/head";
import { useReceiptStore } from "$/store";
import { Items } from "$/components/Items";
import { People } from "$/components/People";
import { ReceiptMeta } from "../components/ReceiptMeta";
import { TaxAndTip } from "../components/TaxAndTip";
import { Share } from "../components/Share";
import { Coin } from "../components/Coin";

export default function Home() {
  const receipt = useReceiptStore();
  const updateReceiptMeta = useReceiptStore((state) => state.updateMeta);
  return (
    <>
      <Head>
        <title>Spill</title>
        <meta
          name="description"
          content="Spill is the easiest way to split the bill with your friends"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="text-center flex flex-col items-center gap-4 py-8">
        <Coin />
        <h2 className="main-header">Introducing Spill</h2>
        <p className="text">
          Spill is the easiest way to <br /> split the bill with your friends
        </p>
      </div>

      <div className="flex flex-col gap-6 px-[10px] pb-6 max-w-md mx-auto">
        <section className="flex flex-col gap-6 ">
          <ReceiptMeta
            receipt={receipt}
            handleUpdateReceiptMeta={updateReceiptMeta}
          />
          <People />
          <Items />
          <TaxAndTip handleUpdateReceiptMeta={updateReceiptMeta} />
        </section>
        <section className="flex flex-col gap-6">
          <Share receipt={receipt} />
        </section>
      </div>
    </>
  );
}
