"use client";

import React, { useState, useId } from "react";
import AnimatedButton from "./AnimatedButton";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { Heart, Star, TrendingUp } from "lucide-react";

const MenuIcon = () => (
  <svg
    className="pointer-events-none"
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

// Navigation links that are always visible
const publicLinks = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/trending",
    label: "Trending",
    icon: TrendingUp,
  },
];

// Navigation links only visible when logged in
const privateLinks = [
  {
    href: "/my-reviews",
    label: "My Reviews",
    icon: Star,
  },
  {
    href: "/favorites",
    label: "Favorites",
    icon: Heart,
  },
];

function GlassmorphismHeader() {
  const id = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Get user and logout from AuthContext
  const { currentUser, logout } = useAuth();

  // Combine links based on authentication status
  const navigationLinks = currentUser 
    ? [...publicLinks, ...privateLinks] 
    : publicLinks;

  const handleLogout = async () => {
    try {
      await logout();

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "success",
        title: "Logged out successfully",
      });

      setIsUserMenuOpen(false);
      navigate("/"); // Navigate to home page after logout
    } catch (error) {
      console.error("Logout error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to logout. Please try again.",
      });
    }
  };

  return (
    <header className="relative w-full backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700 shadow-2xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
            >
              <AnimatedButton></AnimatedButton>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-8">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        `block px-3 py-2 transition-all duration-300 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium relative group flex items-center gap-2 ${
                          isActive ? "text-gray-900 dark:text-white" : ""
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {link.icon && <link.icon className="w-4 h-4" />}
                          {link.label}
                          <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${
                              isActive ? "w-full" : "w-0 group-hover:w-full"
                            }`}
                          ></span>
                        </>
                      )}
                    </NavLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side: Search, Login/User */}
          <div className="flex items-center gap-4">
            {/* Search bar */}

            {/* Login/User Menu */}
            {!currentUser ? (
              <Link to="/login">
                <Button variant="glass" size="sm" className="hidden sm:flex">
                  Login
                </Button>
              </Link>
            ) : (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || "User"}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full border-2 border-blue-500 dark:border-blue-400 shadow-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-800 shadow-lg">
                      {currentUser.displayName
                        ? currentUser.displayName.charAt(0).toUpperCase()
                        : currentUser.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-2xl backdrop-blur-xl z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                        <p className="font-bold text-gray-900 dark:text-white truncate">
                          {currentUser.displayName || "User"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu button */}
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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-gray-600 mt-2">
              {navigationLinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300 flex items-center gap-2 ${
                      isActive ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold" : ""
                    }`
                  }
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </NavLink>
              ))}

              {/* Mobile user section */}
              {currentUser && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                  <div className="px-3 py-2 text-gray-700 dark:text-gray-200">
                    <p className="font-bold truncate">
                      {currentUser.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}

              {/* Mobile login button */}
              {!currentUser && (
                <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
                  <Link to="/login">
                    <Button variant="glass" size="sm" className="w-full">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default GlassmorphismHeader;