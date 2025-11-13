import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const ReportPopup = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    teamLeaderName: 'Jagdish Sanjiv Jagdale',
    date: new Date().toISOString().split('T')[0],
    present: '',
    totalEmployees: '',
    employees: [
      {
        id: 1,
        name: '',
        project: '',
        taskAssigned: '',
        dailyReport: '',
        punchIn: '',
        punchOut: ''
      }
    ]
  });

  const addEmployee = () => {
    const newEmployee = {
      id: Date.now(),
      name: '',
      project: '',
      taskAssigned: '',
      dailyReport: '',
      punchIn: '',
      punchOut: ''
    };
    setFormData(prev => ({
      ...prev,
      employees: [...prev.employees, newEmployee]
    }));
  };

  const removeEmployee = (id) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.filter(emp => emp.id !== id)
    }));
  };

  const updateEmployee = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      employees: prev.employees.map(emp => 
        emp.id === id ? { ...emp, [field]: value } : emp
      )
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Add Report Data</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Leader Name
              </label>
              <input
                type="text"
                value={formData.teamLeaderName}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Present
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 h-10"></div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Employees
              </label>
              <input
                type="number"
                value={formData.totalEmployees}
                onChange={(e) => setFormData(prev => ({ ...prev, totalEmployees: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter total employees"
              />
            </div>
          </div>

          {/* Employee Records */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Employee Records</h3>
              <button
                onClick={addEmployee}
                className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus size={16} />
                <span>Add Employee</span>
              </button>
            </div>

            {/* Employee Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Project</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Task Assigned</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Daily Report</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Punch In</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Punch Out</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.employees.map((employee, index) => (
                    <tr key={employee.id} className="border-b">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={employee.name}
                          onChange={(e) => updateEmployee(employee.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                          placeholder="Employee name"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={employee.project}
                          onChange={(e) => updateEmployee(employee.id, 'project', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                          placeholder="Project name"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={employee.taskAssigned}
                          onChange={(e) => updateEmployee(employee.id, 'taskAssigned', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                          placeholder="Task assigned"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <textarea
                          value={employee.dailyReport}
                          onChange={(e) => updateEmployee(employee.id, 'dailyReport', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
                          rows="2"
                          placeholder="Daily report"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={employee.punchIn}
                          onChange={(e) => updateEmployee(employee.id, 'punchIn', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={employee.punchOut}
                          onChange={(e) => updateEmployee(employee.id, 'punchOut', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {formData.employees.length > 1 && (
                          <button
                            onClick={() => removeEmployee(employee.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-semibold"
            >
              Save Report Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPopup;
