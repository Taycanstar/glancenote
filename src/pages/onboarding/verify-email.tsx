import React from "react";
import LogoLayout from "@/src/components/LogoLayout";
import { useRouter } from "next/router";
import { LOCAL } from "@/src/utils/constants";

const VerifyEmail: React.FC & { Layout?: React.ComponentType<any> } = () => {
  const router = useRouter();
  const { email } = router.query;
  const handleResendEmail = async () => {
    if (email) {
      try {
        const response = await fetch(`${LOCAL}/resend-parent-email/`, {
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
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm space-y-2">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-3"></div>

          <h2 className="mt-1 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Verify your email
          </h2>
        </div>

        <div className="flex items-center justify-center">
          <label className="text-center block text-sm text-gray-900">
            We sent an email to {email} Click the link inside to get started
          </label>
        </div>
        <div className="flex text-sm leading-6 py-5 justify-center items-center">
          <button
            type="button"
            onClick={handleResendEmail}
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Resend email
          </button>
        </div>
      </div>
    </div>
  );
};

VerifyEmail.Layout = LogoLayout;
export default VerifyEmail;
