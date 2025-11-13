import { LayoutDashboard, FilePlus, FileText, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const items = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FilePlus, label: 'Create Report', path: '/create-report' },
    { icon: FileText, label: 'Report Form', path: '/report-form' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-16 lg:w-64 bg-gradient-to-b from-purple-600 to-purple-700 h-screen flex flex-col py-6 transition-all duration-300">
      {/* Logo Section */}
      <div className="px-4 lg:px-6 mb-8">
        <div className="flex items-center justify-center lg:justify-start">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-purple-600 font-bold text-lg">DR</span>
          </div>
          <span className="hidden lg:block ml-3 text-white font-semibold text-lg">
            Daily Report
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col space-y-2 px-3 lg:px-4">
        {items.map((item, index) => {
          const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard');
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                isActive
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'text-white text-opacity-70 hover:bg-white hover:bg-opacity-10 hover:text-white'
              }`}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className="hidden lg:block ml-3 font-medium">
                {item.label}
              </span>
              
              {/* Tooltip for small screens only */}
              <div className="lg:hidden absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
