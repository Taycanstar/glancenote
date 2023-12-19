import React, { ReactNode } from "react";
import Link from "next/link";
import { Button } from "./Button";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  color: string;
}

export const NavLink: React.FC<NavLinkProps> = ({ href, children, color }) => {
  return (
    <Link href={href}>
      <button
        className={`inline-block rounded-lg px-2 py-1 ${color} text-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900`}
      >
        {children}
      </button>
    </Link>
  );
};
