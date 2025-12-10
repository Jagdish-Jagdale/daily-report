import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  fetchReports,
  deleteReport,
  saveReport,
} from "../firebase/reportService";
import Snackbar from "../components/Snackbar";
import ReportPopup from "../components/ReportPopup";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useCompany } from "../context/CompanyContext";
import { postReportToSheet } from "../utils/googleSheets";
import { isSheetConfigured } from "../config";

const Reports = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [editingReport, setEditingReport] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const { companyInfo } = useCompany();

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    filterReportsList();
  }, [reports, searchTerm, filterTeam]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const result = await fetchReports();
      if (result.success) {
        setReports(result.data);
      } else {
        // Fallback to localStorage
        const localReports = JSON.parse(
          localStorage.getItem("dailyReports") || "[]"
        );
        setReports(localReports);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      showSnackbar("Error loading reports", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterReportsList = () => {
    let filtered = reports;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.teamLeaderName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          report.date?.includes(searchTerm)
      );
    }

    // Filter by team
    if (filterTeam !== "all") {
      filtered = filtered.filter((report) => report.teamId === filterTeam);
    }

    setFilteredReports(filtered);
  };

  const showSnackbar = (message, type = "info") => {
    setSnackbar({
      isVisible: true,
      message,
      type,
    });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSaveReport = (reportData) => {
    if (editingReport) {
      // Update existing report
      setReports(
        reports.map((report) =>
          report.id === editingReport.id
            ? { ...reportData, id: editingReport.id }
            : report
        )
      );
      setEditingReport(null);
    } else {
      // Add new report
      const newReport = {
        ...reportData,
        id: Date.now(), // Simple ID generation
      };
      setReports([...reports, newReport]);
    }
    setIsPopupOpen(false);
  };

  const handleSaveReportData = async (data) => {
    try {
      const reportToSave = {
        ...data,
        id: Date.now(),
        savedAt: new Date().toISOString(),
      };

      const result = await saveReport(reportToSave);

      if (result.success) {
        const reportsArr = JSON.parse(
          localStorage.getItem("dailyReports") || "[]"
        );
        reportsArr.push(reportToSave);
        localStorage.setItem("dailyReports", JSON.stringify(reportsArr));

        showSnackbar("Report saved successfully! Generating PDF...", "success");
        loadReports();

        // only attempt to append to Google Sheet if configured
        if (!isSheetConfigured()) {
          showSnackbar(
            "Google Sheet webhook not configured. To enable sheet append, set REACT_APP_SHEET_WEBHOOK_URL in .env or update src/config.js",
            "info"
          );
        } else {
          const sheetResult = await postReportToSheet(reportToSave);
          if (!sheetResult.success) {
            showSnackbar(
              "Failed to append to Google Sheet: " + sheetResult.message,
              "error"
            );
          } else {
            showSnackbar(
              "Report appended to Google Sheet successfully",
              "success"
            );
          }
        }

        // Generate PDF after short delay
        setTimeout(() => {
          generateReportPDF(data);
        }, 500);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error saving report:", error);
      showSnackbar("Error saving report: " + error.message, "error");
    }
  };

  const generateReportPDF = async (reportData) => {
    try {
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.width = "800px";
      tempContainer.id = "temp-report-container";
      document.body.appendChild(tempContainer);

      tempContainer.innerHTML = `
        <div id="pdf-report-container" style="background: white; padding: 32px; font-family: Arial, sans-serif;">
          <!-- Header Section -->
          <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div style="flex-shrink: 0;">
                ${
                  companyInfo?.logoUrl
                    ? `<img src="${companyInfo.logoUrl}" alt="Logo" style="width: 100px; height: 85px; object-fit: contain;" />`
                    : `<div style="width: 100px; height: 85px; background: #f3f4f6; border-radius: 8px;"></div>`
                }
              </div>
              
              <div style="flex: 1; text-align: right; margin-left: 32px;">
                <h1 style="font-size: 22px; font-weight: bold; color: #14b8a6; margin: 0 0 8px 0;">
                  ${
                    companyInfo?.companyName ||
                    "INFOYASHONAND TECHNOLOGY PVT. LTD."
                  }
                </h1>
                <div style="font-size: 11px; color: #6b7280; line-height: 1.8;">
                  ${
                    companyInfo?.address
                      ? `<div style="margin-bottom: 2px;">📍 ${companyInfo.address}</div>`
                      : ""
                  }
                  ${
                    companyInfo?.email
                      ? `<div style="margin-bottom: 2px;">✉️ ${companyInfo.email}</div>`
                      : ""
                  }
                  ${
                    companyInfo?.website
                      ? `<div style="margin-bottom: 2px;">🌐 ${companyInfo.website}</div>`
                      : ""
                  }
                  ${
                    companyInfo?.phone
                      ? `<div>📞 ${companyInfo.phone}</div>`
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Title -->
          <div style="text-align: center; padding: 14px 0; margin-bottom: 12px;">
            <h2 style="font-size: 20px; font-weight: bold; color: #111827; margin: 0;">Daily Attendance Report</h2>
          </div>

          <!-- Report Info -->
          <div style="padding: 12px 0 16px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; width: 50%;">
                  <span style="font-weight: 600; color: #374151;">Team Name:</span>
                  <span style="color: #1d4ed8; font-weight: 600; margin-left: 12px;">${
                    reportData.teamName
                  }</span>
                </td>
                <td style="padding: 6px 0; width: 50%; text-align: left;">
                  <span style="font-weight: 600; color: #374151;">Date:</span>
                  <span style="color: #111827; font-weight: 500; margin-left: 12px;">${
                    reportData.date
                  }</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0;">
                  <span style="font-weight: 600; color: #374151;">Team Leader Name:</span>
                  <span style="color: #111827; font-weight: 500; margin-left: 12px;">${
                    reportData.teamLeaderName
                  }</span>
                </td>
                <td style="padding: 6px 0; text-align: left;">
                  <span style="font-weight: 600; color: #374151;">Total Members:</span>
                  <span style="color: #111827; font-weight: 500; margin-left: 12px;">${
                    reportData.totalEmployees
                  }</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0;">
                  <span style="font-weight: 600; color: #374151;">Present:</span>
                  <span style="color: #111827; font-weight: 500; margin-left: 12px;">${
                    reportData.present
                  }</span>
                </td>
                <td style="padding: 6px 0; text-align: left;">
                  <span style="font-weight: 600; color: #374151;">Absent:</span>
                  <span style="color: #111827; font-weight: 500; margin-left: 12px;">${
                    reportData.totalEmployees - reportData.present
                  }</span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Attendance Table -->
          <div style="margin-top: 16px;">
            <div style="background: #14b8a6; padding: 10px 20px;">
              <h3 style="text-align: center; color: white; font-weight: 600; font-size: 14px; margin: 0;">Attendance Details</h3>
            </div>

            <table style="width: 100%; border: 1px solid #d1d5db; border-top: none; border-collapse: collapse; table-layout: fixed;">
              <thead>
                <tr style="background: #ede9fe; border-bottom: 1px solid #d1d5db;">
                  <th style="padding: 10px 8px; text-align: center; font-size: 11px; font-weight: 600; color: #374151; width: 5%;">Sr No</th>
                  <th style="padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 600; color: #374151; width: 16%;">Name</th>
                  <th style="padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 600; color: #374151; width: 14%;">Project</th>
                  <th style="padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 600; color: #374151; width: 42%;">Daily Report</th>
                  <th style="padding: 10px 8px; text-align: center; font-size: 11px; font-weight: 600; color: #374151; width: 11%;">Punch In</th>
                  <th style="padding: 10px 8px; text-align: center; font-size: 11px; font-weight: 600; color: #374151; width: 12%;">Punch Out</th>
                </tr>
              </thead>

              <tbody>
                ${reportData.employees
                  .map(
                    (emp, index) => `
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 12px 8px; text-align: center; font-size: 11px; color: #1f2937; font-weight: 500; vertical-align: top; max-width: 5%;">${
                      index + 1
                    }</td>
                    <td style="padding: 12px 8px; text-align: left; font-size: 11px; color: #1f2937; vertical-align: top; max-width: 16%; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">${
                      emp.name
                    }</td>
                    <td style="padding: 12px 8px; text-align: left; font-size: 11px; color: #1f2937; vertical-align: top; max-width: 14%; word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">${
                      emp.project || "-"
                    }</td>
                    <td style="padding: 12px 8px; text-align: left; font-size: 11px; color: #1f2937; vertical-align: top; max-width: 42%; word-wrap: break-word; overflow-wrap: break-word; white-space: normal; line-height: 1.5;">${
                      emp.dailyReport || "-"
                    }</td>
                    <td style="padding: 12px 8px; text-align: center; font-size: 11px; color: #1f2937; vertical-align: top; max-width: 11%;">${
                      emp.punchIn || "-"
                    }</td>
                    <td style="padding: 12px 8px; text-align: center; font-size: 11px; color: #1f2937; vertical-align: top; max-width: 12%;">${
                      emp.punchOut || "-"
                    }</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(
        tempContainer.querySelector("#pdf-report-container"),
        {
          scale: 3,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: 800,
        }
      );

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `daily-report-${reportData.teamName}-${reportData.date}.pdf`;
      pdf.save(fileName);

      document.body.removeChild(tempContainer);

      showSnackbar("PDF generated and downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showSnackbar("Error generating PDF: " + error.message, "error");
    }
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
    setIsPopupOpen(true);
  };

  const confirmDeleteReport = (report) => {
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      const result = await deleteReport(reportToDelete.id);
      if (result.success) {
        setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));

        // Also remove from localStorage
        const localReports = JSON.parse(
          localStorage.getItem("dailyReports") || "[]"
        );
        const updatedReports = localReports.filter(
          (r) => r.id !== reportToDelete.id
        );
        localStorage.setItem("dailyReports", JSON.stringify(updatedReports));

        showSnackbar("Report deleted successfully!", "success");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      showSnackbar("Error deleting report: " + error.message, "error");
    } finally {
      setShowDeleteModal(false);
      setReportToDelete(null);
    }
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleAddNew = () => {
    setEditingReport(null);
    setIsPopupOpen(true);
  };

  const getUniqueTeams = () => {
    const teams = reports.map((r) => ({ id: r.teamId, name: r.teamName }));
    return Array.from(new Map(teams.map((t) => [t.id, t])).values());
  };

  // summary counts (used in header cards)
  const totalReports = reports.length;
  const recentReports = reports.filter(
    (r) => new Date(r.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const thisMonthReports = reports.filter((r) => {
    const d = new Date(r.date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
        duration={4000}
      />

      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-gray-400 mt-1">
            View and manage daily attendance reports.
          </p>
        </div>

        <hr className="border-gray-800 mb-6" />

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded p-4">
            <div className="text-sm text-gray-400">Total Reports</div>
            <div className="text-2xl font-bold mt-2">{totalReports}</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded p-4">
            <div className="text-sm text-gray-400">Recent (7 days)</div>
            <div className="text-2xl font-bold mt-2">{recentReports}</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded p-4">
            <div className="text-sm text-gray-400">This Month</div>
            <div className="text-2xl font-bold mt-2">{thisMonthReports}</div>
          </div>
        </div>
      </div>

      {/* Filters (dark) */}
      <div className="bg-gray-900 border border-gray-800 rounded p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by team, leader, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
              />
            </div>

            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-200"
              >
                <option value="all">All Teams</option>
                {getUniqueTeams().map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadReports}
              className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-500 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowAddReportModal(true)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded shadow"
            >
              <Plus />
              <span className="text-sm">Add Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reports List (dark cards) */}
      {loading ? (
        <div className="bg-gray-900 rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading reports...</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="bg-gray-900 rounded-lg shadow-sm p-12 text-center">
          <FileText size={64} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Reports Found
          </h3>
          <p className="text-gray-400">
            {searchTerm || filterTeam !== "all"
              ? "Try adjusting your filters"
              : "Create your first report to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-gray-900 border border-gray-800 rounded-lg hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    <FileText className="text-indigo-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {report.teamName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {report.teamLeaderName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-medium text-gray-200">
                    {report.date}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Present:</span>
                  <span className="font-medium text-green-400">
                    {report.present}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="font-medium text-gray-200">
                    {report.totalEmployees}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Absent:</span>
                  <span className="font-medium text-red-400">
                    {report.totalEmployees - report.present}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <button
                  onClick={() => handleViewDetails(report)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center space-x-1"
                >
                  <Eye size={16} />
                  <span>View</span>
                </button>
                <button
                  onClick={() => confirmDeleteReport(report)}
                  className="text-red-500 hover:text-red-400 font-medium text-sm flex items-center space-x-1"
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal (dark) */}
      {showDeleteModal && reportToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl max-w-md w-full border border-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-800 rounded-full mb-4">
                <AlertTriangle className="text-red-300" size={24} />
              </div>

              <h3 className="text-lg font-semibold text-white text-center mb-2">
                Delete Report
              </h3>

              <p className="text-sm text-gray-300 text-center mb-6">
                Are you sure you want to delete the report for{" "}
                <strong>{reportToDelete.teamName}</strong> dated{" "}
                <strong>{reportToDelete.date}</strong>? This action cannot be
                undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setReportToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-200 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteReport}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
                >
                  Delete Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Report Popups (unchanged) */}
      <ReportPopup
        isOpen={showAddReportModal}
        onClose={() => setShowAddReportModal(false)}
        onSave={handleSaveReportData}
        initialData={null}
      />
      <ReportPopup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          setEditingReport(null);
        }}
        onSave={handleSaveReport}
        initialData={editingReport}
      />

      {/* Details Modal (dark) */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold text-white">Report Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-200"
                aria-label="Close report details"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Team Name
                  </label>
                  <p className="text-lg font-semibold text-gray-100">
                    {selectedReport.teamName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Team Leader
                  </label>
                  <p className="text-lg font-semibold text-gray-100">
                    {selectedReport.teamLeaderName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Date
                  </label>
                  <p className="text-lg font-semibold text-gray-100">
                    {selectedReport.date}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Attendance
                  </label>
                  <p className="text-lg font-semibold text-gray-100">
                    {selectedReport.present} / {selectedReport.totalEmployees}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Employee Details
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-700">
                  <thead className="bg-gray-950">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">
                        Project
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">
                        Daily Report
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">
                        Punch In
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">
                        Punch Out
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.employees?.map((emp, index) => (
                      <tr key={index} className="border-t border-gray-800">
                        <td className="px-4 py-2 text-sm text-gray-200">
                          {emp.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-200">
                          {emp.project || "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-200">
                          {emp.dailyReport || "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-200">
                          {emp.punchIn || "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-200">
                          {emp.punchOut || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* end of Details Modal */}
    </div>
  );
};

export default Reports;
