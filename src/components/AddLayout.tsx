import React, { ReactNode, useEffect, useState } from "react";
import "@/src/styles/tailwind.css";
import { Header } from "./Header";
import { TeacherHeader } from "./TeacherHeader";
import { useSelector } from "react-redux";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const userType = useSelector((state: any) => state.user.userType);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set the isClient state to true once the component is mounted
    setIsClient(true);
  }, []);

  console.log(userType, "userType");
  return (
    <div className="flex flex-col min-h-screen">
      {isClient &&
        // Render your component or its part that depends on client-side data
        (userType === "Teacher" ? <TeacherHeader /> : <Header />)}

      <main className="flex flex-1 items-center justify-center">
        {children}
      </main>
    </div>
  );
};

export { Layout };
export default Layout;
