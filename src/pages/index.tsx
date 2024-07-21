import type { NextPage } from "next";
import Head from "next/head";
import Dashboard from "../components/Dashboard";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title> Ran Abbreviation Navigator</title>
        <meta
          name="description"
          content="A dashboard for RAN Abbreviations & Terms"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default Home;
