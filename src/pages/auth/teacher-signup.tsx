import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  Fragment,
} from "react";
import LogoLayout from "@/src/components/LogoLayout";
import { useRouter } from "next/router";
import { FiEyeOff, FiEye } from "react-icons/fi";
import "@/src/styles/tailwind.css";
import { Layout as DefaultLayout } from "@/src/components/Layout";
import { FiLoader } from "react-icons/fi";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const schoolList = [
  { id: 1, name: "Gmail" },
  { id: 2, name: "Eckerd College" },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const TeacherSignup: React.FC & { Layout?: React.ComponentType<any> } = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loggedIn = useSelector((state: any) => state.user.isLoggedIn);

  const placeholder = { id: "placeholder", name: "Institution" };
  const [selected, setSelected] = useState(placeholder);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior.
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/teacher-signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'X-CSRFToken': csrfToken // Include this if CSRF is used.
          },
          body: JSON.stringify({
            email: email,
            password1: password,
            password2: password,
            institution: selected.name,
          }),
        }
      );

      const data = await response.json();

      // Check if the request was successful
      if (response.ok) {
        console.log("Verification email sent successfully:", data.message);
        setIsLoading(false);
        router.push({
          pathname: "/onboarding/verify-email",
          query: { email: email.toLowerCase(), password: password },
        });
      } else {
        // Handle errors, such as displaying a message to the user
        console.error("Failed to send verification email:", data.error);
        setIsError(true);
        setErrorText(data.error);

        setIsLoading(false);
        setTimeout(() => {
          setIsError(false);
          setErrorText("");
        }, 5000);
      }
    } catch (error) {
      console.error(
        "An error occurred while sending the verification email:",
        error
      );
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

  useEffect(() => {
    // Check if token exists
    if (loggedIn) {
      // If token doesn't exist, redirect to login
      router.push("/chat");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <LogoLayout>
      <div className="flex min-h-full flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-3"></div>

            <h2 className="mt-1 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create your account
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
            <Listbox
              value={selected}
              onChange={(value) =>
                value.id !== "placeholder" && setSelected(value)
              }
            >
              {({ open }) => (
                <>
                  <div className="relative mt-2">
                    <Listbox.Button className="relative block w-full cursor-default rounded-md py-3.5 text-left text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 px-3 focus:ring-blue-500 outline-none shadow-sm">
                      <span
                        className={`block truncate ${
                          selected.id === "placeholder"
                            ? "text-gray-400"
                            : "text-gray-900"
                        }`}
                      >
                        {selected.name}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-b-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {schoolList.map((school) => (
                          <Listbox.Option
                            key={school.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "bg-black text-white"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={school}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {school.name}
                                </span>

                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-black",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
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
              <Link
                href="/auth/login"
                className="text-blue-500 mx-2 text-sm hover:text-blue-400"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </LogoLayout>
  );
};

TeacherSignup.Layout = LogoLayout;
export default TeacherSignup;
