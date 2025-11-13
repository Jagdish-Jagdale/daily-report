import { useState } from 'react';
import { MapPin, Mail, Phone, Globe, Plus, Download } from 'lucide-react';
import logo from '../assets/ITPL_logo.png';
import ReportPopup from './ReportPopup';

const ReportForm = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleSaveReportData = (data) => {
    setReportData(data);
  };

  const handleSaveToLocal = () => {
    if (!reportData) {
      alert('Please add report data first');
      return;
    }
    
    // Create a simple text representation of the report
    const reportContent = `
INFOYASHONAND TECHNOLOGY PVT. LTD.
TEAM CODEBLAZE
Daily Attendance Report

Date: ${reportData.date}
Team Leader Name: ${reportData.teamLeaderName}
Total Employees: ${reportData.totalEmployees}
Present: ${reportData.present}

Employee Details:
${reportData.employees.map((emp, index) => 
  `${index + 1}. ${emp.name} | ${emp.project} | ${emp.taskAssigned} | ${emp.dailyReport} | ${emp.punchIn} | ${emp.punchOut}`
).join('\n')}
    `;

    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-report-${reportData.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 flex justify-between items-start">
        <div className="flex flex-col items-center">
          {/* Company Logo */}
          <div className="mb-2">
            <img 
              src={logo} 
              alt="ITPL Logo" 
              className="w-30 h-20 object-contain"
            />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-teal-600 mb-1">INFOYASHONAND TECHNOLOGY PVT. LTD.</h1>
          <p className="text-lg text-gray-600 tracking-wider">TEAM CODEBLAZE</p>
        </div>
      </div>

      {/* Report Title with Date and Add Report Button */}
      <div className="py-4 bg-gray-50 relative">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Daily Attendance Report</h2>
        <div className="absolute top-4 right-6 flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Date: {reportData ? reportData.date : '_______________'}
          </span>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center space-x-2 bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700 transition-colors text-sm"
          >
            <Plus size={16} />
            <span>Add Report</span>
          </button>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary:</h3>
        
        <div className="grid grid-cols-2 gap-8 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-700 font-medium">Team Leader Name:</label>
              <span className="text-gray-800 font-medium">
                {reportData ? reportData.teamLeaderName : '________________________'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-gray-700 font-medium">Present:</label>
              <span className="text-gray-800 font-medium">
                {reportData ? reportData.present || '____' : '____'}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-700 font-medium">Total Employees:</label>
              <span className="text-gray-800 font-medium">
                {reportData ? reportData.totalEmployees : '____'}
              </span>
            </div>
            
            {reportData && (
              <div className="flex justify-end">
                <button
                  onClick={handleSaveToLocal}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={16} />
                  <span>Save to Local</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Details Table */}
        <div className="mt-8">
          <div className="bg-teal-600 text-white py-3 px-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-center">Attendance Details</h3>
          </div>
          
          <div className="border border-gray-300 rounded-b-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-teal-50 border-b border-gray-300">
              <div className="grid grid-cols-7 gap-2 p-3 font-semibold text-gray-700 text-sm">
                <div>Sr No</div>
                <div>Name</div>
                <div>Project</div>
                <div>Task Assigned</div>
                <div>Daily Report</div>
                <div>Punch In (Time)</div>
                <div>Punch Out</div>
              </div>
            </div>
            
            {/* Table Rows */}
            {reportData && reportData.employees ? (
              // Show actual employee data
              reportData.employees.map((employee, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <div className="grid grid-cols-7 gap-2 p-3 text-sm">
                    <div className="text-gray-800">{index + 1}</div>
                    <div className="text-gray-800">{employee.name}</div>
                    <div className="text-gray-800">{employee.project}</div>
                    <div className="text-gray-800">{employee.taskAssigned}</div>
                    <div className="text-gray-800">{employee.dailyReport}</div>
                    <div className="text-gray-800">{employee.punchIn}</div>
                    <div className="text-gray-800">{employee.punchOut}</div>
                  </div>
                </div>
              ))
            ) : (
              // Show empty rows when no data
              [...Array(15)].map((_, index) => (
                <div key={index} className="border-b border-gray-200 last:border-b-0">
                  <div className="grid grid-cols-7 gap-2 p-3 text-sm">
                    <div className="h-6"></div>
                    <div className="h-6"></div>
                    <div className="h-6"></div>
                    <div className="h-6"></div>
                    <div className="h-6"></div>
                    <div className="h-6"></div>
                    <div className="h-6"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Report Popup */}
      <ReportPopup 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={handleSaveReportData}
      />
    </div>
  );
};

export default ReportForm;
