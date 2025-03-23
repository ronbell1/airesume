"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  FileCheck,
  FileEdit,
  Home,
  HelpCircle,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { authClient, useSession } from "@/lib/auth-client";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const session = useSession();

  const userSignOut = async (): Promise<void> => {
    await authClient.signOut();
    window.location.reload(); // Force page revalidation
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Navigation items with icons
  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    {
      href: "/check-resume",
      label: "Check Resume",
      icon: <FileCheck className="h-4 w-4" />,
    },
    {
      href: "/build-resume",
      label: "Build Resume",
      icon: <FileEdit className="h-4 w-4" />,
    },
    { href: "/faq", label: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
  ];

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md" : "bg-white"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 10 }}
              >
                <span className="text-white font-bold text-lg">R</span>
              </motion.div>
              <motion.span
                className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold text-xl tracking-tight font-sans transition-transform duration-300 group-hover:scale-105"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                ResumeAI
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center justify-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 text-base font-medium transition-colors duration-200 hover:text-blue-600 flex items-center gap-2 ${
                    isActive(item.href) ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 w-full bg-blue-600 rounded-full"
                      layoutId="navbar-indicator"
                      transition={{
                        type: "spring",
                        bounce: 0.25,
                        duration: 0.5,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
                {session.data?.session.id ? (
                <Button
                  onClick={userSignOut}
                  variant="ghost"
                  className="font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-1.5"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="font-medium">Sign Out</span>
                </Button>
                ) : (
                <>
                  <Button
                  variant="ghost"
                  asChild
                  className="font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-1.5"
                  >
                  <Link href="/sign-in">
                    <LogIn className="h-4 w-4" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                  </Button>
                  <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                  onHoverStart={() => setDropdownOpen(true)}
                  onHoverEnd={() => setDropdownOpen(false)}
                  >
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium border-0 shadow-sm flex items-center gap-1.5"
                  >
                    <Link href="/sign-up">
                    <UserPlus className="h-4 w-4" />
                    <span className="font-medium">Sign Up</span>
                    </Link>
                  </Button>
                  </motion.div>
                </>
                )}

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      
                    </motion.div>
                  )}
                </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "open"}
                  initial={{ opacity: 0, rotate: isMenuOpen ? -90 : 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: isMenuOpen ? 90 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden border-t border-gray-100 bg-white shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container py-4 space-y-4">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center gap-3 ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100">
                <Button
                  variant="outline"
                  asChild
                  className="justify-center items-center gap-2"
                >
                  <Link href="/sign-in">
                    <LogIn className="h-4 w-4" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 justify-center items-center gap-2"
                >
                  <Link href="/sign-up">
                    <UserPlus className="h-4 w-4" />
                    <span className="font-medium">Sign Up Free</span>
                  </Link>
                </Button>
                <div className="flex justify-between mt-2 px-2">
                  <Link
                    href="/sign-up-basic"
                    className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1"
                  >
                    <span>✨</span> Basic Plan
                  </Link>
                  <Link
                    href="/sign-up-pro"
                    className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1"
                  >
                    <span>⭐</span> Pro Plan
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
