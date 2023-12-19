import React, { ReactNode } from "react";
import "@/src/styles/tailwind.css";
import Head from "next/head";

interface LayoutProps {
  children: ReactNode;
}

const LogoLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Head>
        <link rel="icon" href="/images/log.png" />
      </Head>

      <div
        style={{ display: "flex", justifyContent: "center", padding: "1rem" }}
      >
        <img src="/images/log.png" alt="logo" className="h-12 w-auto" />
      </div>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export { LogoLayout }; // named export for use in _app.tsx
export default LogoLayout; // default export for use in other places
