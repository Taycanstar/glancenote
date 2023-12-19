import React, { ChangeEvent, useEffect, useState } from "react";
import LogoLayout from "@/src/components/LogoLayout";
import { useRouter } from "next/router";
import { LOCAL } from "@/src/utils/constants";
import { AppDispatch } from "../../store";
import { useSelector, useDispatch } from "react-redux";
import { loginWithoutPassword } from "@/src/store/user";

const VerifyPhone: React.FC & { Layout?: React.ComponentType<any> } = () => {
  const router = useRouter();
  const { email, phoneNumber, password } = router.query;
  const [code, setCode] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const handleResendCode = async () => {
    if (email) {
      try {
        const response = await fetch(`${LOCAL}/api/resend-parent-code/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'X-CSRFToken': csrfToken // Include this if CSRF is used.
          },
          body: JSON.stringify({
            email: email,
            // Don't send confirmationToken from client-side
          }),
        });

        const data = await response.json();

        // Check if the request was successful
        if (response.ok) {
          console.log("Email sent", data.message);
        } else {
          // Handle errors, such as displaying a message to the user
          console.error("Failed to send email", data.message);
        }
      } catch (error) {
        console.error(
          "An error occurred while sending the verification email:",
          error
        );
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSubmit = async () => {
    if (email) {
      try {
        const response = await fetch(`${LOCAL}/api/confirm-parent-ph/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'X-CSRFToken': csrfToken // Include this if CSRF is used.
          },
          body: JSON.stringify({
            email: email,
            phoneNumber: phoneNumber,
            code: code,
            // Don't send confirmationToken from client-side
          }),
        });

        const data = await response.json();

        // Check if the request was successful
        if (response.ok) {
          console.log("Phone verified", data.message);
          // Dispatch the login action

          dispatch(loginWithoutPassword({ email: email as string }))
            .then((loginResponse) => {
              console.log("Login successful", loginResponse);
              // Redirect to desired route or perform additional actions
              router.push({
                pathname: "/chat",
              });
            })
            .catch((error: any) => {
              console.error("Login error", error);
              // Handle login error
            });
        } else {
          // Handle errors, such as displaying a message to the user
          console.error("Failed to verify code", data.message);
        }
      } catch (error) {
        console.error(
          "An error occurred while verifying your phone number:",
          error
        );
      }
    }
  };

  useEffect(() => {
    if (code && code.length === 6) {
      handleSubmit();
    }
  }, [code, handleSubmit]);

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-3"></div>

          <h2 className="mt-1 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Verify phone number
          </h2>
        </div>

        <div className="flex items-center justify-center">
          <label className="text-center block text-sm text-gray-900">
            We sent a verification code to your phone number
          </label>
        </div>
        <div>
          <input
            type="text"
            name="code"
            value={code}
            id="code"
            maxLength={6}
            placeholder="Enter code"
            className="relative block w-full rounded-md border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-200 sm:text-sm sm:leading-6 px-3"
            onChange={handleCodeChange}
          />
        </div>
        <div className="flex text-sm leading-6 py-5 justify-center items-center">
          <button
            type="button"
            onClick={handleResendCode}
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
};

VerifyPhone.Layout = LogoLayout;
export default VerifyPhone;
