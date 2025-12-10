import DesignTools from "../components/DesignTools";
import WhatsNew from "../components/WhatsNew";
import Recents from "../components/Recents";
import { Search, Filter, ChevronRight, Crown } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex-1 min-h-screen overflow-y-auto bg-black text-white">
      {/* Header */}
      <div className="px-8 py-6">
        {/* Top Bar */}
        <div className="relative mb-14">
          <div className="rounded-t-3xl h-48 w-full bg-gray-900 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center border border-gray-800">
            <div className="flex items-center space-x-2 text-3xl font-semibold text-white">
              <span>Discover our latest launches</span>
              <ChevronRight size={24} className="text-gray-400" />
            </div>
            {/* Navigation Tabs */}
            <div className="mt-5 flex items-center space-x-3">
              <button className="px-4 py-2 rounded-full bg-gray-800 ring-1 ring-gray-700 text-gray-200 text-sm font-medium">
                Your designs
              </button>
              <button className="px-4 py-2 rounded-full text-gray-300 hover:bg-gray-800 hover:shadow-sm text-sm font-medium">
                Templates
              </button>
              <button className="px-4 py-2 rounded-full text-gray-300 hover:bg-gray-800 hover:shadow-sm text-sm font-medium">
                Canva AI
              </button>
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-700">
              <Crown size={16} className="text-yellow-400" />
              <span className="text-xs font-medium text-gray-200">
                Start your trial for ₹0
              </span>
            </div>
          </div>
          {/* Search Bar */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-7 w-full max-w-3xl">
            <div className="flex items-center bg-gray-800 rounded-full shadow-lg ring-1 ring-gray-700 px-4 py-3">
              <Search size={18} className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search designs, folders and uploads"
                className="flex-1 outline-none text-white placeholder-gray-500 bg-transparent"
              />
              <Filter
                size={18}
                className="text-gray-400 ml-3 cursor-pointer hover:text-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Design Tools Section */}
        <div className="mt-10">
          <DesignTools />
        </div>

        {/* What's New Section */}
        <WhatsNew />

        {/* Recents Section */}
        <Recents />
      </div>
    </div>
  );
};

export default Dashboard;
