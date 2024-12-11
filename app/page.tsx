/* eslint-disable react/no-children-prop */
import Head from "next/head";

import Sidebar from "@/components/shared/sidebar";

export default function Home() {
  return (
    <>
      <Sidebar children={null} />
      <div className="">
        <Head>
          <title>Celebrities Table</title>
        </Head>
        <h1>Таблица знаменитостей</h1>
      </div>
    </>
  );
}
