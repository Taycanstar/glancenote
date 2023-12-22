import React, { Fragment, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { Popover, Transition, Menu } from "@headlessui/react";
import clsx from "clsx";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Button } from "@/src/components/Button";
import { Container } from "@/src/components/Container";
import { NavLink } from "@/src/components/NavLink";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { logout } from "../store/user";

interface MobileNavLinkProps {
  href: string;
  children: ReactNode;
}

interface DropdownOption {
  label: string;
  href: string;
}

interface DropdownProps {
  title: any;
  options: DropdownOption[];
}

const Dropdown: React.FC<DropdownProps> = ({ title, options }) => {
  return (
    <div className="relative inline-block text-left">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button className="inline-flex justify-center w-full text-lg text-white items-center">
              {title}
              <ChevronDownIcon
                className="w-5 h-5 ml-2 -mr-1"
                aria-hidden="true"
              />
            </Menu.Button>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 w-36 mt-2 origin-top-right bg-black divide-y divide-gray-100 rounded-md shadow-none ring-0 ring-black ring-opacity-0 focus:outline-none"
              >
                <div className="px-1 py-1">
                  {options.map((option, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <Link
                          href={option.href}
                          className={`${
                            active ? "underline text-white" : "text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        >
                          {option.label}
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

function MobileNavLink({ href, children }: MobileNavLinkProps) {
  return (
    <Popover.Button
      as={Link}
      href={href}
      className="block w-full p-2 text-white"
    >
      {children}
    </Popover.Button>
  );
}

interface MobileNavIconProps {
  open: boolean;
}

function MobileNavIcon({ open }: MobileNavIconProps) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-white"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          "origin-center transition",
          open && "scale-90 opacity-0"
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          "origin-center transition",
          !open && "scale-90 opacity-0"
        )}
      />
    </svg>
  );
}

function MobileNavigation() {
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-black p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <MobileNavLink href="#about">About</MobileNavLink>
            <MobileNavLink href="#careers">Careers</MobileNavLink>
            <MobileNavLink href="/apps/moodmotif">Moodmotif</MobileNavLink>
            <hr className="m-2 border-slate-300/40" />
            <MobileNavLink href="/login">Log in</MobileNavLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export const Header = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default link behavior
    console.log("Logging out");
    dispatch(logout());
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // Tailwind's 'md' breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const dropdownOptions = [
    isSmallScreen && { label: "Discover", href: "/discover" },
    isSmallScreen && { label: "Assistant", href: "/assistant" },
    { label: "Profile", href: "/profile" },
    { label: "Settings", href: "/settings" },
  ].filter(Boolean);

  const Dropdown = ({ title, options }: any) => {
    return (
      <div className="relative inline-block text-left">
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button className="inline-flex justify-center w-full text-lg text-white items-center">
                {title}
                <ChevronDownIcon
                  className="w-5 h-5 ml-2 -mr-1"
                  aria-hidden="true"
                />
              </Menu.Button>
              <Transition
                show={open}
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  static
                  className="absolute right-0 w-36 mt-2 origin-top-right bg-black divide-y divide-gray-100 rounded-md shadow-none ring-0 ring-black ring-opacity-0 focus:outline-none"
                >
                  <div className="px-1 py-1">
                    {options.map((option: any, index: any) => (
                      <Menu.Item key={index}>
                        {({ active }) => (
                          <Link
                            href={option.href}
                            // onClick={option.onClick}
                          >
                            <span
                              className={`${
                                active ? "underline text-white" : "text-white"
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm cursor-pointer`}
                            >
                              {option.label}
                            </span>
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? "underline text-white" : "text-white"
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                        >
                          Log out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    );
  };

  return (
    <header className="py-6 absolute w-full z-10">
      <Container className="px-2 lg:px-6">
        <nav className="relative z-50 flex justify-between items-center">
          <Link href="#" aria-label="Home">
            <div className="inline-flex items-center cursor-pointer">
              <img
                src="/images/log.png"
                alt="Glancenote Logo"
                className="h-10 w-auto"
              />
              <p className="subpixel-antialiased text-black text-2xl px-1.5 font-medium">
                Glancenote
              </p>
            </div>
          </Link>

          <div className="hidden md:flex md:gap-x-6">
            <NavLink href="/discover" color="text-black">
              Discover
            </NavLink>
            <NavLink href="/assistant" color="text-black">
              Assistant
            </NavLink>
          </div>

          <div className="flex items-center gap-x-5 md:gap-x-8">
            <Dropdown
              title={<Bars3Icon className="h-6 w-6 text-black" />}
              options={dropdownOptions}
            />
          </div>
        </nav>
      </Container>
    </header>
  );
};
