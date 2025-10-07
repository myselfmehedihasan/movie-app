'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Home,
  Users,
  Folder,
  Calendar,
  User,
} from 'lucide-react';

/**
 * Header4 Component
 * --------------------------------------------------------------------
 * A modern, responsive dashboard header with:
 * - Navigation tabs
 * - Search bar
 * - Notification icon
 * - User dropdown menu
 * - Mobile menu with hamburger toggle
 * - Auto-closing dropdown when clicking outside
 * --------------------------------------------------------------------
 */

export default function Header4() {
  // ====== State Management ======
  const [activeTab, setActiveTab] = useState('Dashboard'); // Tracks the active navigation tab
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Controls mobile nav visibility
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // Controls user dropdown visibility

  // ====== Refs ======
  const dropdownRef = useRef(null); // Reference to user dropdown for outside-click detection
  const timeoutRef = useRef(null); // Used to delay dropdown closing on hover leave

  // ====== Simulated User Data (replace with auth context in real app) ======
  const user = {
    email: 'user@example.com',
    displayName: 'User',
    photoURL: 'https://placehold.co/100x100/EFEFEF/4A4A4A?text=U',
  };

  // ====== Handle click outside user dropdown ======
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ====== Dropdown hover handlers ======
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsUserDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsUserDropdownOpen(false), 150);
  };

  const handleDropdownClick = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // ====== Navigation tabs ======
  const navItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Team', icon: Users },
    { name: 'Projects', icon: Folder },
    { name: 'Calendar', icon: Calendar },
  ];

  // ====== Component JSX ======
  return (
    <div className="mx-4 sm:mx-6 mt-2 font-sans">
      <header className="relative">
        {/* Main Header Container */}
        <div className="bg-black border border-gray-800 rounded-2xl shadow-2xl p-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* === Left Section: Logo + Navigation === */}
            <div className="flex items-center space-x-2 sm:space-x-8">
              {/* Logo / Brand Icon */}
              <div className="w-8 h-8 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-12"></div>
              </div>

              {/* Desktop Navigation Menu */}
              <nav className="hidden lg:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                        ${
                          activeTab === item.name
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-900'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Menu Button (Hamburger icon) */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 transition-all duration-300"
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center">
                  {/* Three hamburger bars that transform into X */}
                  <div
                    className={`w-4 h-0.5 bg-white transition-all duration-300 ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''
                    }`}
                  ></div>
                  <div
                    className={`w-4 h-0.5 bg-white mt-1 transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-0' : ''
                    }`}
                  ></div>
                  <div
                    className={`w-4 h-0.5 bg-white mt-1 transition-all duration-300 ${
                      isMobileMenuOpen
                        ? '-rotate-45 -translate-y-1.5'
                        : ''
                    }`}
                  ></div>
                </div>
              </button>
            </div>

            {/* === Right Section: Search + Notifications + User === */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Input (Visible on desktop) */}
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  className="
                    bg-gray-900 border border-gray-700 rounded-xl 
                    pl-10 pr-4 py-2 w-40 md:w-64 text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-gray-600
                    transition-all duration-300
                  "
                />
              </div>

              {/* Mobile Search Button */}
              <button className="sm:hidden p-2 rounded-xl bg-gray-900 border border-gray-700 hover:bg-gray-800 transition-all duration-300">
                <Search className="h-5 w-5 text-gray-400" />
              </button>

              {/* Notifications Button */}
              <button
                className="
                relative p-2 rounded-xl bg-gray-900 border border-gray-700
                hover:bg-gray-800 transition-all duration-300 group
              "
              >
                <Bell className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>

              {/* === User Profile Section === */}
              <div className="relative" ref={dropdownRef}>
                {/* User Avatar and Dropdown Toggle */}
                <div
                  className="flex items-center space-x-1 sm:space-x-3 cursor-pointer hover:bg-gray-900 p-2 rounded-xl transition-all duration-300"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleDropdownClick}
                >
                  {/* Avatar image or fallback icon */}
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border border-gray-700">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-500 hidden sm:block transition-transform duration-300 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-black border border-gray-800 rounded-xl shadow-2xl py-2 z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {/* User avatar inside dropdown */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border border-gray-700">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt="User avatar"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-white" />
                          )}
                        </div>

                        {/* User info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {user.displayName || 'User'}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* === Mobile Menu (Visible when toggled) === */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-800">
              <nav className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.name);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300
                        ${
                          activeTab === item.name
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-900'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
