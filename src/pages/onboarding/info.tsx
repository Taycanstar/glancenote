import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import LogoLayout from "@/src/components/LogoLayout";
import { useRouter } from "next/router";
import { AppDispatch } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { addInfo } from "../../store/user";
import { unwrapResult } from "@reduxjs/toolkit";
import { LOCAL } from "@/src/utils/constants";
import CommonLayout from "@/src/components/CommonLayout";
import { FiLoader } from "react-icons/fi";

const Info: React.FC & { Layout?: React.ComponentType<any> } = () => {
  const router = useRouter();
  const { token, email } = router.query;
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const [num, setNum] = useState<string>("");
  const [formError, setFormError] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBdChange = (inputValue: string) => {
    const input = inputValue.replace(/\D/g, ""); // Remove non-digit characters
    let formattedDate = "";

    if (input.length > 0) {
      formattedDate += input.substr(0, 2);
    }
    if (input.length > 2) {
      formattedDate += "/" + input.substr(2, 2);
    }
    if (input.length > 4) {
      formattedDate += "/" + input.substr(4, 4);
    }

    setBirthday(formattedDate);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;
    if (num === "" && currentValue !== "+") {
      setNum("+1" + currentValue);
    } else {
      setNum(currentValue);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // Check if the required fields are filled
    setIsLoading(true);
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !studentId.trim() ||
      !num.trim()
    ) {
      setFormError("Please fill in all required fields.");
      setIsError(true);
      return;
    }

    if (!isError) {
      try {
        const resultAction = await dispatch(
          addInfo({
            email: email as string,
            firstName: firstName,
            lastName: lastName,
            studentId: studentId,
            phoneNumber: num,
          })
        );
        unwrapResult(resultAction);
        setIsLoading(false);
        router.push({
          pathname: "/onboarding/verify-phone",
          query: { email: email, phoneNumber: num },
        });
        console.log("add info successful");
      } catch (error: any) {
        // Handle error here
        console.error("add info error:", error);
        // Directly use the error message from the backend
        setIsLoading(false);
        setFormError(error.message || "Invalid phone number");
        setIsError(true);
      }
    }
  };

  // Event handler for email input changes
  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handleIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStudentId(event.target.value);
  };
  useEffect(() => {
    const confirmUser = async () => {
      if (token && email) {
        try {
          const response = await fetch(`${LOCAL}/api/confirm-parent-email/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // 'X-CSRFToken': csrfToken // Include this if CSRF is used.
            },
            body: JSON.stringify({
              email: email,
              confirmationToken: token,
              // Don't send confirmationToken from client-side
            }),
          });

          const data = await response.json();

          // Check if the request was successful
          if (response.ok) {
            console.log("Email verified", data.message);
          } else {
            // Handle errors, such as displaying a message to the user
            console.error("Failed to verify email", data.message);
          }
        } catch (error) {
          console.error(
            "An error occurred while sending the verification email:",
            error
          );
        }
      }
    };

    if (token && email) {
      confirmUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isError) {
      timer = setTimeout(() => {
        setIsError(false);
        setFormError("");
      }, 5000);
    }

    // Clear the timer when the component unmounts or isError changes
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isError]);

  return (
    <LogoLayout>
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-3"></div>

            <h2 className="mt-1 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Enter your account details{" "}
            </h2>
          </div>

          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    name="firstName"
                    id="first-name"
                    value={firstName}
                    placeholder="First Name"
                    className="relative block w-full rounded-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-200 sm:text-sm sm:leading-6 px-3"
                    onChange={handleFirstNameChange}
                  />
                </div>
                {/* Last Name */}
                <div className="flex-1">
                  <input
                    type="text"
                    name="lastName"
                    id="last-name"
                    value={lastName}
                    placeholder="Last name"
                    className="relative block w-full rounded-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-200 sm:text-sm sm:leading-6 px-3"
                    onChange={handleLastNameChange}
                  />
                </div>
              </div>

              <div>
                <input
                  type="text"
                  name="student"
                  value={studentId}
                  id="studentId"
                  placeholder="Student ID"
                  className="relative block w-full rounded-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-200 sm:text-sm sm:leading-6 px-3"
                  onChange={handleIdChange}
                />
              </div>

              <div>
                <input
                  type="text"
                  name="phone number"
                  placeholder="Phone number"
                  value={num}
                  id="num"
                  className="relative block w-full rounded-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-200 sm:text-sm sm:leading-6 px-3"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {isError && <p className="text-sm text-red-600">{formError}</p>}

            <div>
              <button
                type="submit"
                className="hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100 flex w-full justify-center rounded-md bg-gray-200 px-3 py-3.5 text-lg  leading-6 text-black"
              >
                {isLoading ? (
                  <FiLoader className="animate-spin h-5 w-5 mr-3" /> // Loading spinner icon
                ) : (
                  "Continue"
                )}
              </button>
            </div>
            <div className="flex items-center justify-center">
              <label
                htmlFor="remember-me"
                className="block text-sm text-gray-900"
              >
                Already have an account?
              </label>
              <a
                href="/auth/login"
                className="text-blue-500 mx-2 text-sm hover:text-blue-400"
              >
                Log in
              </a>
            </div>
          </form>
        </div>
      </div>
    </LogoLayout>
  );
};

Info.Layout = LogoLayout;
export default Info;
