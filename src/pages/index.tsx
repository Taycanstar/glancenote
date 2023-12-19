import Head from "next/head";
import "@/src/styles/tailwind.css";
import LogoLayout from "@/src/components/LogoLayout";
import Signup from "@/src/pages/auth/signup";
import Chat from "./chat";
import Login from "./auth/login";

export default function Home() {
  return (
    <div>
      <Login />
    </div>
  );
}
