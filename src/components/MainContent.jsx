import { Search, Filter, ChevronRight, Crown } from 'lucide-react';
import DesignTools from './DesignTools';
import WhatsNew from './WhatsNew';
import Recents from './Recents';

const MainContent = () => {
  return (
    <div className="flex-1 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="px-8 py-6">
        {/* Top Bar */}
        <div className="relative mb-14">
          <div className="rounded-t-3xl h-48 w-full bg-gradient-to-r from-[#dff5ff] via-[#ebf1ff] to-[#f2e8ff] shadow-[0_20px_40px_-20px_rgba(124,58,237,0.35)] flex flex-col items-center justify-center">
            <div className="flex items-center space-x-2 text-4xl font-semibold text-[#6d28d9]">
              <span>Discover our latest launches</span>
              <ChevronRight size={28} className="text-[#7c3aed]" />
            </div>
            {/* Navigation Tabs */}
            <div className="mt-5 flex items-center space-x-3">
              <button className="px-4 py-2 rounded-full bg-white shadow-sm ring-1 ring-purple-200 text-gray-700 text-sm font-medium">Your designs</button>
              <button className="px-4 py-2 rounded-full text-gray-600 hover:bg-white/80 hover:shadow-sm text-sm font-medium">Templates</button>
              <button className="px-4 py-2 rounded-full text-gray-600 hover:bg-white/80 hover:shadow-sm text-sm font-medium">Canva AI</button>
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1.5 rounded-full shadow-sm">
              <Crown size={16} className="text-yellow-600" />
              <span className="text-xs font-medium text-yellow-800">Start your trial for ₹0</span>
            </div>
          </div>
          {/* Search Bar */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-7 w-full max-w-3xl">
            <div className="flex items-center bg-white rounded-full shadow-lg ring-1 ring-purple-200 px-5 py-3">
              <Search size={20} className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search designs, folders and uploads"
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
              <Filter size={20} className="text-gray-400 ml-3 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>

        {/* Design Tools Section */}
        <DesignTools />

        {/* What's New Section */}
        <WhatsNew />

        {/* Recents Section */}
        <Recents />
      </div>
    </div>
  );
};

export default MainContent;
