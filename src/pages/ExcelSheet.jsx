import { useEffect, useState } from "react";
import { fetchTeams } from "../firebase/teamService";
import { fetchMembers } from "../firebase/memberService";
import { fetchReports } from "../firebase/reportService";
import Snackbar from "../components/Snackbar";

/*
  ExcelSheet page
  - Select team
  - Shows rows by report.date
  - Columns: Date | for each member => Present | Project | Task Assign | Work Report
  - Pagination for rows (dates)
*/
const ExcelSheet = () => {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [dates, setDates] = useState([]); // sorted dates strings
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [snackbar, setSnackbar] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const tRes = await fetchTeams();
      if (tRes.success) setTeams(tRes.data.filter((t) => !t.isDefault));
      const mRes = await fetchMembers();
      if (mRes.success) setMembers(mRes.data);
      const rRes = await fetchReports();
      if (rRes.success) setReports(rRes.data);
    } catch (err) {
      showSnackbar("Error loading data", "error");
    }
  };

  useEffect(() => {
    if (selectedTeam) {
      // gather dates for selected team (from reports)
      const teamReports = reports.filter((r) => r.teamId === selectedTeam);
      const uniqueDates = Array.from(
        new Set(teamReports.map((r) => r.date))
      ).sort((a, b) => new Date(b) - new Date(a));
      setDates(uniqueDates);
      setPage(1);
    } else {
      setDates([]);
    }
  }, [selectedTeam, reports]);

  const showSnackbar = (msg, type = "info") =>
    setSnackbar({ isVisible: true, message: msg, type });

  const hideSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, isVisible: false }));

  // members for selected team (ordered)
  const teamMembers = members.filter((m) => m.teamId === selectedTeam);

  // get report for (team,date)
  const getReportByDate = (date) =>
    reports.find((r) => r.teamId === selectedTeam && r.date === date);

  // pagination
  const totalPages = Math.max(1, Math.ceil(dates.length / rowsPerPage));
  const visibleDates = dates.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="flex-1 min-h-screen overflow-y-auto bg-gray-50 p-6">
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
        duration={4000}
      />

      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Excel Sheet</h1>
            <p className="text-sm text-gray-500">
              View report data in spreadsheet layout
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="">Select Team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2 text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 bg-white border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 bg-white border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-auto border rounded bg-white">
          <table className="min-w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-xs text-left sticky left-0 bg-gray-100 z-10">
                  Date
                </th>
                {teamMembers.map((member) => (
                  <th
                    key={member.id}
                    className="p-2 border text-xs text-center"
                  >
                    <div className="font-medium">{member.name}</div>
                    <div className="text-[11px] text-gray-500">
                      Present | Project | Task Assign | Work Report
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visibleDates.length === 0 ? (
                <tr>
                  <td
                    colSpan={Math.max(1, teamMembers.length + 1)}
                    className="p-4 text-sm text-gray-500"
                  >
                    No data for selected team.
                  </td>
                </tr>
              ) : (
                visibleDates.map((date) => {
                  const rep = getReportByDate(date);
                  return (
                    <tr key={date} className="align-top">
                      <td className="p-2 border text-xs font-medium">{date}</td>
                      {teamMembers.map((member) => {
                        // find employee record within the report
                        const emp = rep?.employees?.find(
                          (e) =>
                            (e.id &&
                              e.id.toString() === member.id.toString()) ||
                            e.name === member.name
                        );
                        const present =
                          emp &&
                          (emp.project ||
                            emp.dailyReport ||
                            emp.punchIn ||
                            emp.punchOut)
                            ? "P"
                            : "-";
                        const project = emp?.project || "-";
                        const taskAssign = emp?.taskAssign || "-";
                        const workReport = emp?.dailyReport || "-";
                        return (
                          <td
                            key={member.id}
                            className="p-2 border align-top text-xs"
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              maxWidth: 220,
                            }}
                          >
                            <div className="flex flex-col gap-1 text-[12px]">
                              <div className="font-semibold">{present}</div>
                              <div className="text-gray-700 break-words">
                                {project}
                              </div>
                              <div className="text-gray-600 break-words">
                                {taskAssign}
                              </div>
                              <div className="text-gray-800 break-words">
                                {workReport}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {visibleDates.length} of {dates.length} dates
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelSheet;
