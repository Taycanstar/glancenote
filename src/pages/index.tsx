import Head from "next/head";
import "@/src/styles/tailwind.css";
import LogoLayout from "@/src/components/LogoLayout";
import Signup from "@/src/pages/auth/signup";

export default function Home() {
  return (
    <LogoLayout>
      <Head>
        <title>Glancenote</title>
        <link rel="icon" href="/images/log.png" />
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Signup />
    </LogoLayout>
  );
}
