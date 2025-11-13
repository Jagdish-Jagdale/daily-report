const CreateReport = () => {
  return (
    <div className="flex-1 min-h-screen overflow-y-auto bg-gray-50">
      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Report</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Report Templates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-teal-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-teal-600 font-semibold">Daily Attendance</span>
                </div>
                <h3 className="font-semibold text-gray-800">Daily Attendance Report</h3>
                <p className="text-sm text-gray-600 mt-1">Track daily employee attendance and status</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">Weekly Summary</span>
                </div>
                <h3 className="font-semibold text-gray-800">Weekly Summary Report</h3>
                <p className="text-sm text-gray-600 mt-1">Weekly overview of team performance</p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-full h-32 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">Monthly Report</span>
                </div>
                <h3 className="font-semibold text-gray-800">Monthly Report</h3>
                <p className="text-sm text-gray-600 mt-1">Comprehensive monthly analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
