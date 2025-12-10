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
    <div className="flex-1 min-h-screen overflow-y-auto bg-black text-white p-6">
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
        duration={4000}
      />

      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Excel Sheet</h1>
            <p className="text-sm text-gray-400 mt-1">
              View report data in spreadsheet layout
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-800 text-white rounded w-full md:w-auto"
            >
              <option value="">Select Team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2 text-sm ml-auto md:ml-0">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-400">
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border border-gray-800 rounded bg-gray-900">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[900px] w-full table-fixed divide-y divide-gray-800">
              <thead>
                <tr className="bg-gray-950">
                  <th className="p-2 sticky left-0 z-10 bg-gray-950 text-xs text-left">
                    Date
                  </th>
                  {teamMembers.map((member) => (
                    <th
                      key={member.id}
                      className="p-2 text-xs text-center border-l border-gray-800"
                    >
                      <div className="font-medium text-white">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Present | Project | Task Assign | Work Report
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {visibleDates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={Math.max(1, teamMembers.length + 1)}
                      className="p-4 text-sm text-gray-400"
                    >
                      No data for selected team.
                    </td>
                  </tr>
                ) : (
                  visibleDates.map((date) => {
                    const rep = getReportByDate(date);
                    return (
                      <tr key={date} className="align-top hover:bg-gray-850">
                        <td className="p-2 text-xs font-medium text-gray-200">
                          {date}
                        </td>
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
                              className="p-2 align-top text-xs border-l border-gray-800"
                              style={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                maxWidth: 220,
                              }}
                            >
                              <div className="flex flex-col gap-1 text-[12px]">
                                <div className="font-semibold text-gray-200">
                                  {present}
                                </div>
                                <div className="text-gray-300 break-words">
                                  {project}
                                </div>
                                <div className="text-gray-400 break-words">
                                  {taskAssign}
                                </div>
                                <div className="text-gray-300 break-words">
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
        </div>

        <div className="mt-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-sm text-gray-400">
            Showing {visibleDates.length} of {dates.length} dates
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded disabled:opacity-50"
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
