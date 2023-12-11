import React, { ReactNode } from "react";
import "@/src/styles/tailwind.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <main>{children}</main>
    </>
  );
};

export { Layout };
export default Layout;
