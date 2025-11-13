import { 
  Presentation, 
  Heart, 
  Play, 
  FileText, 
  Monitor, 
  BarChart3, 
  Globe, 
  Camera, 
  Palette, 
  Upload,
  MoreHorizontal
} from 'lucide-react';

const DesignTools = () => {
  const tools = [
    { icon: Presentation, label: 'Presentation', color: 'bg-orange-500' },
    { icon: Heart, label: 'Social media', color: 'bg-pink-500' },
    { icon: Play, label: 'Video', color: 'bg-purple-500' },
    { icon: FileText, label: 'Printables', color: 'bg-blue-500' },
    { icon: Monitor, label: 'Doc', color: 'bg-teal-500' },
    { icon: BarChart3, label: 'Whiteboard', color: 'bg-green-500' },
    { icon: Globe, label: 'Sheet', color: 'bg-blue-600' },
    { icon: Camera, label: 'Website', color: 'bg-indigo-500' },
    { icon: Palette, label: 'Photo editor', color: 'bg-yellow-500' },
    { icon: Upload, label: 'Custom size', color: 'bg-gray-500' },
    { icon: MoreHorizontal, label: 'Upload', color: 'bg-gray-600' },
    { icon: MoreHorizontal, label: 'More', color: 'bg-gray-700' },
  ];

  return (
    <div className="mb-12 mt-12">
      <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar px-1">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col items-center space-y-2 cursor-pointer group"
          >
            <div className={`w-14 h-14 ${tool.color} rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-200 shadow-md ring-1 ring-black/5`}>
              <tool.icon size={22} />
            </div>
            <span className="text-xs text-gray-700 text-center font-medium whitespace-nowrap">
              {tool.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignTools;
