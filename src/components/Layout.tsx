import React, { ReactNode } from "react";
import "@/src/styles/tailwind.css";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
    </div>
  );
};

export { Layout };
export default Layout;
