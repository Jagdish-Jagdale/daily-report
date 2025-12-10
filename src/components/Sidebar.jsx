import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react"; // added useEffect
import { useAuth } from "../context/AuthContext";
import dailyreportLogo from "../assets/dailyreport logo.png";
import { FaFileExcel } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef(null);
  const touchStartYRef = useRef(0);

  const items = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      shadowColor:
        "drop-shadow-[0_0_6px_rgba(59,130,246,0.9)] drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]", // Blue
    },
    {
      icon: FilePlus,
      label: "Create Report",
      path: "/reports",
      shadowColor:
        "drop-shadow-[0_0_6px_rgba(16,185,129,0.9)] drop-shadow-[0_0_12px_rgba(5,150,105,0.6)]", // Green
    },
    {
      icon: FaFileExcel,
      label: "Excel",
      path: "/excel",
      shadowColor:
        "drop-shadow-[0_0_6px_rgba(245,158,11,0.9)] drop-shadow-[0_0_12px_rgba(217,119,6,0.6)]", // Orange
    },
    {
      icon: FileText,
      label: "Projects",
      path: "/projects",
      shadowColor:
        "drop-shadow-[0_0_6px_rgba(255,99,132,0.9)] drop-shadow-[0_0_12px_rgba(255,50,100,0.6)]", // Pink/Red
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      shadowColor:
        "drop-shadow-[0_0_6px_rgba(168,85,247,0.9)] drop-shadow-[0_0_12px_rgba(147,51,234,0.6)]", // Purple
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Prevent main page scrolling while pointer/touch is over the sidebar.
  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    const setBodyNoScroll = () => {
      // disable body scroll while sidebar is active
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    };
    const restoreBodyScroll = () => {
      // restore default
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };

    const onMouseEnter = () => setBodyNoScroll();
    const onMouseLeave = () => restoreBodyScroll();

    const onTouchStart = () => setBodyNoScroll();
    const onTouchEnd = () => restoreBodyScroll();

    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    // restore on unmount or if ref changes
    return () => {
      restoreBodyScroll();
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []); // run once

  const handleWheel = (e) => {
    const el = sidebarRef.current;
    if (!el) return;
    const delta = e.deltaY;
    const atTop = el.scrollTop === 0;
    const atBottom =
      Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) <= 1;
    // prevent page scroll when sidebar is at extremes
    if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
      e.preventDefault();
    }
    e.stopPropagation();
  };

  const handleTouchStart = (e) => {
    touchStartYRef.current = e.touches?.[0]?.clientY || 0;
  };

  const handleTouchMove = (e) => {
    const el = sidebarRef.current;
    if (!el) return;
    const currentY = e.touches?.[0]?.clientY || 0;
    const delta = touchStartYRef.current - currentY;
    const atTop = el.scrollTop === 0;
    const atBottom =
      Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) <= 1;
    if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
      e.preventDefault();
    }
    e.stopPropagation();
  };

  return (
    // placeholder keeps space in layout so main content is not overlapped
    <div className={`${isExpanded ? "w-64" : "w-16"} lg:w-64 flex-none`}>
      {/* fixed panel: stays in viewport while page scrolls */}
      <div
        ref={sidebarRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
          isExpanded ? "w-64" : "w-16"
        } lg:w-64 bg-black border-r border-gray-800 flex flex-col py-6`}
        style={{ minHeight: "100vh", WebkitOverflowScrolling: "touch" }}
      >
        {/* Expand/Compress Button for Small Screens */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden absolute top-4 right-[-12px] bg-gray-800 text-white p-1 rounded-full shadow-lg hover:bg-gray-700 transition-colors z-50"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* Logo Section */}
        <div className="px-4 lg:px-6 mb-6">
          <div
            className={`flex ${
              isExpanded ? "flex-row" : "flex-col"
            } lg:flex-row items-center ${
              isExpanded ? "gap-3" : "gap-2"
            } lg:gap-3`}
          >
            {/* Logo */}
            <div className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] flex items-center justify-center flex-shrink-0">
              <img
                src={dailyreportLogo}
                alt="Daily Report Logo"
                className="w-[35px] h-[35px] lg:w-[45px] lg:h-[45px] object-contain drop-shadow-[0_0_10px_rgba(255,0,255,0.7)] drop-shadow-[0_0_20px_rgba(0,255,255,0.5)] drop-shadow-[0_0_30px_rgba(255,255,0,0.3)]"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="w-full h-full flex items-center justify-center hidden">
                <span className="text-white font-bold text-lg lg:text-xl drop-shadow-[0_0_10px_rgba(255,0,255,0.7)] drop-shadow-[0_0_20px_rgba(0,255,255,0.5)] drop-shadow-[0_0_30px_rgba(255,255,0,0.3)]">
                  DR
                </span>
              </div>
            </div>

            {/* Daily Report Text */}
            <div className={`${isExpanded ? "block" : "hidden"} lg:block`}>
              <span className="text-white font-semibold text-base lg:text-lg">
                Daily Report
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-800 mb-4 mx-3 lg:mx-4" />

        {/* Navigation Items: make inner area scrollable if content is tall */}
        <div className="flex flex-col space-y-1 px-3 lg:px-4 flex-1 overflow-y-auto">
          {items.map((item, index) => {
            const isActive =
              location.pathname === item.path ||
              (location.pathname === "/" && item.path === "/dashboard");

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon
                  size={20}
                  className={`flex-shrink-0 ${
                    isActive ? item.shadowColor : ""
                  }`}
                />
                <span
                  className={`${
                    isExpanded ? "block" : "hidden"
                  } lg:block ml-3 font-medium text-sm ${
                    isActive ? item.shadowColor : ""
                  }`}
                >
                  {item.label}
                </span>

                {/* Tooltip for small screens when collapsed */}
                <div
                  className={`${
                    isExpanded ? "lg:hidden" : ""
                  } lg:hidden absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50`}
                >
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="px-3 lg:px-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 group w-full text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span
              className={`${
                isExpanded ? "block" : "hidden"
              } lg:block ml-3 font-medium text-sm`}
            >
              Logout
            </span>

            {/* Tooltip for small screens when collapsed */}
            <div
              className={`${
                isExpanded ? "lg:hidden" : ""
              } lg:hidden absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50`}
            >
              Logout
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
