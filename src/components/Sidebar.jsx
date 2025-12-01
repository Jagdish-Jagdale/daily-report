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
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import dailyreportLogo from "../assets/dailyreport logo.png";
import { FaFileExcel } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const items = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FilePlus, label: "Create Report", path: "/reports" },
    { icon: FaFileExcel, label: "Excel", path: "/excel" }, // use FaFileExcel
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div
      className={`${
        isExpanded ? "w-64" : "w-16"
      } lg:w-64 bg-gradient-to-b from-purple-600 to-purple-700 h-screen flex flex-col py-6 transition-all duration-300 relative`}
    >
      {/* Expand/Compress Button for Small Screens */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="lg:hidden absolute top-4 right-[-12px] bg-purple-600 text-white p-1 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-10"
      >
        {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Logo Section */}
      <div className="px-4 lg:px-6 mb-8">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="w-[60px] h-[40px] lg:w-[100px] lg:h-[70px] flex items-center justify-center mb-3">
            <img
              src={dailyreportLogo}
              alt="Daily Report Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-lg flex items-center justify-center hidden">
              <span className="text-purple-600 font-bold text-xl lg:text-3xl">
                SK
              </span>
            </div>
          </div>

          {/* Daily Report Text */}
          <div
            className={`${
              isExpanded ? "block" : "hidden"
            } lg:block text-center`}
          >
            <span className="text-white font-bold text-lg ">Daily Report</span>
          </div>
        </div>
        <hr className="mt-3" />
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-2 px-3 lg:px-4 flex-1">
        {items.map((item, index) => {
          const isActive =
            location.pathname === item.path ||
            (location.pathname === "/" && item.path === "/dashboard");

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                isActive
                  ? "bg-white bg-opacity-20 text-white"
                  : "text-white text-opacity-70 hover:bg-white hover:bg-opacity-10 hover:text-white"
              }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span
                className={`${
                  isExpanded ? "block" : "hidden"
                } lg:block ml-3 font-medium`}
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
          className="flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group w-full text-white text-opacity-70 hover:bg-white hover:bg-opacity-10 hover:text-white"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span
            className={`${
              isExpanded ? "block" : "hidden"
            } lg:block ml-3 font-medium`}
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
  );
};

export default Sidebar;
