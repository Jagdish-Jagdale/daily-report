import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { fetchTeams } from "../firebase/teamService";
import { fetchMembers } from "../firebase/memberService";

const ReportPopup = ({ isOpen, onClose, onSave, initialData }) => {
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [formData, setFormData] = useState({
    teamId: "",
    teamName: "",
    teamLeaderName: "",
    date: new Date().toISOString().split("T")[0],
    present: "",
    totalEmployees: "",
    employees: [],
  });

  // Load teams and members when popup opens
  useEffect(() => {
    if (isOpen) {
      loadTeamsAndMembers();
    }
  }, [isOpen]);

  const loadTeamsAndMembers = async () => {
    try {
      // Fetch teams
      const teamsResult = await fetchTeams();
      if (teamsResult.success) {
        const nonDefaultTeams = teamsResult.data.filter((t) => !t.isDefault);
        setTeams(nonDefaultTeams);

        // Set first team as selected if available
        if (nonDefaultTeams.length > 0 && !initialData) {
          const firstTeam = nonDefaultTeams[0];
          setSelectedTeamId(firstTeam.id);
          setFormData((prev) => ({
            ...prev,
            teamId: firstTeam.id,
            teamName: firstTeam.name,
          }));
        }
      }

      // Fetch all team members
      const membersResult = await fetchMembers();
      if (membersResult.success) {
        setTeamMembers(membersResult.data);
      }
    } catch (error) {
      console.error("Error loading teams and members:", error);
    }
  };

  // Update form when team changes
  useEffect(() => {
    if (selectedTeamId && teams.length > 0 && teamMembers.length > 0) {
      const selectedTeam = teams.find((t) => t.id === selectedTeamId);
      const teamMembersList = teamMembers.filter(
        (m) => m.teamId === selectedTeamId
      );

      // Find team leader
      const teamLeader = teamMembersList.find((m) => m.role === "team_leader");

      // Create employee records from team members
      const employeeRecords = teamMembersList.map((member) => ({
        id: member.id,
        name: member.name,
        project: "",
        dailyReport: "",
        punchIn: "",
        punchOut: "",
      }));

      setFormData((prev) => ({
        ...prev,
        teamId: selectedTeamId,
        teamName: selectedTeam?.name || "",
        teamLeaderName: teamLeader?.name || "",
        totalEmployees: teamMembersList.length.toString(),
        employees: employeeRecords,
      }));
    }
  }, [selectedTeamId, teams, teamMembers]);

  // Initialize form with existing data or reset
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(initialData);
      setSelectedTeamId(initialData.teamId || "");
    } else if (isOpen && !initialData) {
      setFormData({
        teamId: "",
        teamName: "",
        teamLeaderName: "",
        date: new Date().toISOString().split("T")[0],
        present: "",
        totalEmployees: "",
        employees: [],
      });
    }
  }, [initialData, isOpen]);

  const handleTeamChange = (teamId) => {
    setSelectedTeamId(teamId);
  };

  const removeEmployee = (id) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.filter((emp) => emp.id !== id),
    }));
  };

  const updateEmployee = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.map((emp) =>
        emp.id === id ? { ...emp, [field]: value } : emp
      ),
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.teamId) {
      alert("Please select a team");
      return;
    }
    if (!formData.present) {
      alert("Please enter present count");
      return;
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? "Edit Report Data" : "Add Report Data"}
          </h2>
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
                Team Name *
              </label>
              <select
                value={selectedTeamId}
                onChange={(e) => handleTeamChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Leader Name
              </label>
              <input
                type="text"
                value={formData.teamLeaderName}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                placeholder="Auto-filled from team"
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
                Present *
              </label>
              <input
                type="number"
                value={formData.present}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, present: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter present count"
                max={formData.totalEmployees}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Employees
              </label>
              <input
                type="number"
                value={formData.totalEmployees}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                placeholder="Auto-filled from team"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Absent
              </label>
              <input
                type="number"
                value={
                  formData.totalEmployees && formData.present
                    ? formData.totalEmployees - formData.present
                    : ""
                }
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                placeholder="Auto-calculated"
              />
            </div>
          </div>

          {/* Employee Records */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Employee Records ({formData.employees.length})
              </h3>
            </div>

            {/* Employee Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Daily Report
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Punch In
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                      Punch Out
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.employees.map((employee, index) => (
                    <tr key={employee.id} className="border-b">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={employee.name}
                          readOnly
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-gray-50"
                          placeholder="Employee name"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={employee.project}
                          onChange={(e) =>
                            updateEmployee(
                              employee.id,
                              "project",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="Project name"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <textarea
                          value={employee.dailyReport}
                          onChange={(e) =>
                            updateEmployee(
                              employee.id,
                              "dailyReport",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                          rows="2"
                          placeholder="Daily report"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={employee.punchIn}
                          onChange={(e) =>
                            updateEmployee(
                              employee.id,
                              "punchIn",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="time"
                          value={employee.punchOut}
                          onChange={(e) =>
                            updateEmployee(
                              employee.id,
                              "punchOut",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </td>
                    </tr>
                  ))}
                  {formData.employees.length === 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No employees added. Select a team to load team members.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
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
