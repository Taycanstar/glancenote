/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import LogoLayout from "@/src/components/LogoLayout";
import { useRouter } from "next/router";
import { FiEyeOff, FiEye } from "react-icons/fi";
import "@/src/styles/tailwind.css";
import { Layout as DefaultLayout } from "@/src/components/Layout";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/store";
import { login } from "@/src/store/user";
import { unwrapResult } from "@reduxjs/toolkit";

const Login: React.FC & { Layout?: React.ComponentType<any> } = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const actionResult = await dispatch(login({ email, password }));
      unwrapResult(actionResult);

      // If successful, you can redirect or perform other actions
      router.push("/chat");
    } catch (rejectedValueOrSerializedError: any) {
      // Handle the error case
      setIsError(true);
      setErrorText(
        rejectedValueOrSerializedError.message || "Invalid credentials"
      );

      // Hide the error message after some time
      setTimeout(() => {
        setIsError(false);
        setErrorText("");
      }, 5000);
    }
  };

  // Event handler for email input changes
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  // Event handler for password input changes
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const isPasswordValid = () => password.length >= 8;

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LogoLayout>
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-3"></div>

            <h2 className="mt-1 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Happy to have you back
            </h2>
          </div>

          <form
            className="space-y-2"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="relative rounded-md shadow-sm ">
              <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
              <div className="">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-t-md border-0 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 rounded-b-md px-3 focus:ring-blue-500 outline-none"
                  placeholder="Email address"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>
            <div className="relative rounded-md shadow-sm ">
              <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
              <div className="relative ">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-b-md border-0 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6 rounded-md px-3 focus:ring-blue-500 outline-none"
                  placeholder="Password"
                  value={password} // Set value from state
                  onChange={handlePasswordChange} // Set state on change
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
                  {showPassword ? (
                    <FiEyeOff
                      className="h-5 w-5 text-gray-400 cursor-pointer"
                      onClick={handleTogglePasswordVisibility}
                    />
                  ) : (
                    <FiEye
                      className="h-5 w-5 text-gray-400 cursor-pointer"
                      onClick={handleTogglePasswordVisibility}
                    />
                  )}
                </div>
              </div>
            </div>
            {!isPasswordValid() && password.length > 0 && (
              <p className="text-sm text-red-600">
                Password must be at least 8 characters.
              </p>
            )}

            {isError && <p className="text-sm text-red-600">{errorText}</p>}

            <div className="py-2">
              <button
                type="submit"
                className={`flex w-full justify-center rounded-md bg-gray-200 px-3 py-3.5 text-lg  leading-6 text-black ${
                  isPasswordValid()
                    ? "hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100"
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!isPasswordValid()}
              >
                Continue
              </button>
            </div>
            <div className="flex items-center justify-center">
              <label
                htmlFor="remember-me"
                className="block text-sm text-gray-900"
              >
                Don't have an account?
              </label>
              <a
                href="/auth/signup"
                className="text-blue-500 mx-2 text-sm hover:text-blue-400"
              >
                Signup
              </a>
            </div>
          </form>
        </div>
      </div>
    </LogoLayout>
  );
};

Login.Layout = LogoLayout;
export default Login;
