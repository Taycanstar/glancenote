import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import LogoLayout from "@/src/components/LogoLayout";
import { useRouter } from "next/router";
import { FiEyeOff, FiEye } from "react-icons/fi";
import "@/src/styles/tailwind.css";
import { Layout as DefaultLayout } from "@/src/components/Layout";

const cards = [
  {
    name: "Parent",
    id: "parent",
    href: "/auth/parent-signup",
    description:
      "Unlock a world of insights about your child's school life. From grades to emotional well-being, stay updated and engaged with our AI-powered chat assistant.",
    pathname: "/auth/parent-signup",
  },
  {
    name: "Teacher",
    id: "teacher",
    href: "/auth/teacher-signup",
    description:
      "Enhance your teaching with our AI assistant. Easily input and monitor each student's progress, and streamline your educational interactions with a user-friendly interface.",
    pathname: "/auth/teacher-signup",
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const Signup: React.FC & { Layout?: React.ComponentType<any> } = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  return (
    <LogoLayout>
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="isolate mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {cards.map((card) => (
            <button
              onClick={() => router.push(card.pathname)}
              key={card.id}
              className={classNames(
                "ring-gray-200",
                "rounded-3xl p-8 ring-0 xl:p-10 bg-gray-100"
              )}
            >
              <h3
                id={card.id}
                className={classNames(
                  "text-gray-900",
                  "text-lg font-semibold leading-8"
                )}
              >
                {card.name}
              </h3>
              <p
                className={classNames(
                  "text-gray-600",
                  "mt-4 text-sm leading-6"
                )}
              >
                {card.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </LogoLayout>
  );
};

Signup.Layout = LogoLayout;
export default Signup;
