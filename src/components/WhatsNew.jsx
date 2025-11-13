import { ChevronRight } from 'lucide-react';

const WhatsNew = () => {
  const newItems = [
    {
      title: 'Design for the child in everyone',
      color: 'bg-gradient-to-r from-blue-400 to-cyan-400',
      image: '/api/placeholder/280/160'
    },
    {
      title: 'Design warm Thanksgiving vibes',
      color: 'bg-gradient-to-r from-orange-400 to-yellow-400',
      image: '/api/placeholder/280/160'
    },
    {
      title: 'Make it bold this Black Friday',
      color: 'bg-gradient-to-r from-gray-800 to-black',
      image: '/api/placeholder/280/160'
    },
    {
      title: 'Bring Christmas magic alive',
      color: 'bg-gradient-to-r from-red-500 to-green-500',
      image: '/api/placeholder/280/160'
    },
    {
      title: 'Start the year with creativity',
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      image: '/api/placeholder/280/160'
    }
  ];

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">See what's new</h2>
        <ChevronRight size={20} className="text-gray-500" />
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {newItems.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-72 h-40 rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className={`w-full h-full ${item.color} relative flex items-end p-6`}>
              <div className="text-white">
                <h3 className="text-lg font-semibold mb-2 group-hover:scale-105 transition-transform duration-200">
                  {item.title}
                </h3>
                <ChevronRight size={20} className="text-white opacity-80" />
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white bg-opacity-20 rounded-full"></div>
              <div className="absolute top-8 right-8 w-8 h-8 bg-white bg-opacity-30 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsNew;
