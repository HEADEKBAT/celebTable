/* eslint-disable react/no-children-prop */
import Head from "next/head";
import type { Metadata } from 'next'

import Sidebar from "@/components/shared/sidebar";
// import CelebritiesTable from "@/components/shared/CelebritiesTable";
export const metadata: Metadata = {
  title: 'My Page Title',
}
export default function Home() {
  return (
    <>
      <Sidebar />
      <div className="">
        <Head>
          <title>Celebrities Table</title>
        </Head>
        {/* <h1>Таблица знаменитостей</h1> */}
        {/* <CelebritiesTable></CelebritiesTable> */}
      </div>
    </>
  );
}
