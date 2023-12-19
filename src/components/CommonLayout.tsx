import React, { ReactNode } from "react";
import "@/src/styles/tailwind.css";
import { Header } from "./Header";
import Head from "next/head";
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Head>
        <link rel="icon" href="/images/log.png" />
      </Head>

      <main>{children}</main>
    </div>
  );
};

export { Layout };
export default Layout;
