import { MoreHorizontal, Filter, LayoutGrid, List } from 'lucide-react';

const Recents = () => {
  const recentProjects = [
    {
      id: 1,
      title: 'Daily Performance Report',
      type: 'Document',
      thumbnail: 'bg-gradient-to-br from-blue-500 to-purple-600',
      lastModified: '2 hours ago'
    },
    {
      id: 2,
      title: 'Social Media Post',
      type: 'Instagram Post',
      thumbnail: 'bg-gradient-to-br from-pink-500 to-red-500',
      lastModified: '1 day ago'
    },
    {
      id: 3,
      title: 'Presentation Slides',
      type: 'Presentation',
      thumbnail: 'bg-gradient-to-br from-green-500 to-teal-500',
      lastModified: '3 days ago'
    },
    {
      id: 4,
      title: 'Marketing Banner',
      type: 'Web Banner',
      thumbnail: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      lastModified: '1 week ago'
    },
    {
      id: 5,
      title: 'Logo Design',
      type: 'Logo',
      thumbnail: 'bg-gradient-to-br from-indigo-500 to-blue-500',
      lastModified: '2 weeks ago'
    }
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recents</h2>
        <div className="flex items-center space-x-4">
          <select className="text-sm text-gray-600 bg-transparent border-none outline-none cursor-pointer">
            <option>Owner</option>
            <option>Shared with me</option>
            <option>All</option>
          </select>
          <select className="text-sm text-gray-600 bg-transparent border-none outline-none cursor-pointer">
            <option>Designs</option>
            <option>Folders</option>
            <option>All</option>
          </select>
          <div className="flex items-center space-x-2">
            <LayoutGrid size={16} className="text-gray-500 cursor-pointer hover:text-gray-700" />
            <List size={16} className="text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {recentProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group"
          >
            <div className={`w-full h-32 ${project.thumbnail} rounded-t-lg relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <MoreHorizontal size={16} className="text-white" />
                </div>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-800 truncate mb-1">
                {project.title}
              </h3>
              <p className="text-xs text-gray-500 mb-1">{project.type}</p>
              <p className="text-xs text-gray-400">{project.lastModified}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recents;
