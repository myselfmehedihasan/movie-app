"use client";

import React, { useState, useId } from "react";
import AnimatedButton from "./AnimatedButton";
import { Link } from "react-router";
const MenuIcon = () => (
  <svg
    className="pointer-events-none "
    width={16}
    height={16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 12L20 12"
      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
    />
    <path
      d="M4 12H20"
      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
    />
    <path
      d="M4 12H20"
      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
    />
  </svg>
);
const SearchIcon = ({ size = 16, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const Button = React.forwardRef(
  (
    {
      asChild = false,
      className = "",
      variant = "default",
      size = "default",
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? "span" : "button";
    const baseClasses =
      "inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-sm";
    const variantClasses = {
      default:
        "bg-gray-900 dark:bg-white text-gray-100 dark:text-gray-900 border border-gray-800 dark:border-gray-300 hover:bg-gray-800 dark:hover:bg-gray-100 hover:border-gray-700 dark:hover:border-gray-400 shadow-lg hover:shadow-xl",
      ghost:
        "hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm",
      glass:
        "bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 shadow-2xl hover:shadow-3xl backdrop-blur-md",
    };
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-lg px-3",
      icon: "h-10 w-10",
    };
    const elementProps = props;
    return (
      <Comp
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        ref={ref}
        {...elementProps}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";
const NavigationMenu = ({ children, className = "" }) => (
  <nav className={`relative z-10 ${className}`}>{children}</nav>
);
const NavigationMenuList = ({ children, className = "" }) => (
  <ul className={`flex items-center ${className}`}>{children}</ul>
);
const NavigationMenuItem = ({ children, className = "", ...props }) => (
  <li className={`list-none ${className}`} {...props}>
    {children}
  </li>
);
const NavigationMenuLink = ({ href, className = "", children }) => (
  <a
    href={href}
    className={`block px-3 py-2 transition-all duration-300 ${className}`}
  >
    {children}
  </a>
);
const navigationLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "#",
    label: "About",
  },
  {
    href: "#",
    label: "Services",
  },
  {
    href: "#",
    label: "Contact",
  },
];
function GlassmorphismHeader() {
  const id = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="relative w-full backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
            >
              <AnimatedButton></AnimatedButton>
            </a>
          </div>

          {}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-8">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={link.href}
                      className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium relative group transition-all duration-300"
                    >
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {}
          <div className="flex items-center gap-4">
            {}
            <div className="relative hidden lg:block">
              <div className="relative">
                <input
                  id={id}
                  className="w-64 h-10 pl-10 pr-4 rounded-xl bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 backdrop-blur-sm transition-all duration-300"
                  placeholder="Search..."
                  type="search"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon
                    size={16}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {}
            <Link to="/login">
              <Button variant="glass" size="sm" className="hidden sm:flex">
                Login
              </Button>
            </Link>

            {}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="group text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
              >
                <MenuIcon />
              </Button>
            </div>
          </div>
        </div>

        {}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-600 mt-2">
              {navigationLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
export default GlassmorphismHeader;
