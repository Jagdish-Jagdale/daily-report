import { useState } from "react";
import { MapPin, Mail, Phone, Globe, Download } from "lucide-react";
import logo from "../assets/ITPL_logo.png";
import ReportPopup from "./ReportPopup";
import { useCompany } from "../context/CompanyContext";
import { saveReport } from "../firebase/reportService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportForm = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const { companyInfo, loading: companyLoading } = useCompany();

  const handleSaveReportData = async (data) => {
    setReportData(data);

    try {
      const reportToSave = {
        ...data,
        id: Date.now(),
        savedAt: new Date().toISOString(),
      };

      const result = await saveReport(reportToSave);

      if (result.success) {
        const reports = JSON.parse(
          localStorage.getItem("dailyReports") || "[]"
        );
        reports.push(reportToSave);
        localStorage.setItem("dailyReports", JSON.stringify(reports));

        alert("Report saved successfully to database!");
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Error saving report: " + error.message);
    }
  };

  const generatePDF = async () => {
    if (!reportData) {
      alert("Please add report data first");
      return;
    }

    try {
      // Hide the download button temporarily
      const downloadBtn = document.getElementById("download-pdf-btn");
      const addBtn = document.getElementById("add-report-btn");
      if (downloadBtn) downloadBtn.style.display = "none";
      if (addBtn) addBtn.style.display = "none";

      const reportElement = document.getElementById("report-form-container");

      if (!reportElement) {
        console.error("Report element not found");
        return;
      }

      const canvas = await html2canvas(reportElement, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
      });

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

      // Show buttons again
      if (downloadBtn) downloadBtn.style.display = "flex";
      if (addBtn) addBtn.style.display = "flex";
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  return (
    <div
      id="report-form-container"
      className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200"
    >
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {companyLoading ? (
              <div className="w-24 h-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <img
                src={companyInfo?.logoUrl || logo}
                alt="Company Logo"
                className="w-24 h-20 object-contain"
                onError={(e) => {
                  e.target.src = logo;
                }}
              />
            )}
          </div>

          {/* Company Information */}
          <div className="flex-1 ml-6 text-right">
            {companyLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 ml-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto"></div>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-teal-600 mb-1">
                  {companyInfo?.companyName ||
                    "INFOYASHONAND TECHNOLOGY PVT. LTD."}
                </h1>
                <div className="space-y-0.5 text-xs text-gray-600">
                  {companyInfo?.address && (
                    <div className="flex items-center justify-end">
                      <MapPin size={12} className="mr-1.5" />
                      <span>{companyInfo.address}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-4">
                    {companyInfo?.email && (
                      <div className="flex items-center">
                        <Mail size={12} className="mr-1.5" />
                        <span>{companyInfo.email}</span>
                      </div>
                    )}
                    {companyInfo?.website && (
                      <div className="flex items-center">
                        <Globe size={12} className="mr-1.5" />
                        <span>{companyInfo.website}</span>
                      </div>
                    )}
                  </div>
                  {companyInfo?.phone && (
                    <div className="flex items-center justify-end">
                      <Phone size={12} className="mr-1.5" />
                      <span>{companyInfo.phone}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Title Section */}
      <div className="py-3 bg-white border-b border-gray-200 relative">
        <h2 className="text-center text-lg font-bold text-gray-900">
          Daily Attendance Report
        </h2>
      </div>

      {/* Report Info Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4 text-sm">
          <div className="flex items-center">
            <span className="font-medium text-gray-700 mr-2">Team Name:</span>
            <span className="text-blue-700 font-semibold">
              {reportData
                ? reportData.teamName
                : companyInfo?.teamName || "TEAM CODEBLAZE 🔥"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Date:</span>
            <span className="text-gray-900 font-medium">
              {reportData ? reportData.date : ""}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Team Leader Name:</span>
            <span className="text-gray-900 font-medium">
              {reportData ? reportData.teamLeaderName : ""}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Total Members:</span>
            <span className="text-gray-900 font-medium">
              {reportData ? reportData.totalEmployees : ""}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Present:</span>
            <span className="text-gray-900 font-medium">
              {reportData ? reportData.present : ""}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Absent:</span>
            <span className="text-gray-900 font-medium">
              {reportData && reportData.totalEmployees && reportData.present
                ? reportData.totalEmployees - reportData.present
                : ""}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mb-4">
          {reportData && (
            <button
              id="download-pdf-btn"
              onClick={generatePDF}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
          )}
        </div>

        {/* Attendance Details Table */}
        <div>
          <div className="bg-teal-500 py-2 px-4 rounded-t">
            <h3 className="text-center text-white font-semibold text-sm">
              Attendance Details
            </h3>
          </div>

          <div className="border border-gray-300 rounded-b">
            {/* Table Header */}
            <div className="bg-purple-50 border-b border-gray-300">
              <div className="grid grid-cols-6 gap-2 p-2 text-xs font-semibold text-gray-700">
                <div className="text-center">Sr No</div>
                <div>Name</div>
                <div>Project</div>
                <div>Daily Report</div>
                <div className="text-center">Punch In</div>
                <div className="text-center">Punch Out</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {reportData &&
              reportData.employees &&
              reportData.employees.length > 0
                ? reportData.employees.map((employee, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 gap-2 p-2 text-xs hover:bg-gray-50"
                    >
                      <div className="text-center font-medium text-gray-800">
                        {index + 1}
                      </div>
                      <div
                        className="text-gray-800 truncate"
                        title={employee.name}
                      >
                        {employee.name}
                      </div>
                      <div
                        className="text-gray-800 truncate"
                        title={employee.project}
                      >
                        {employee.project}
                      </div>
                      <div
                        className="text-gray-800 truncate"
                        title={employee.dailyReport}
                      >
                        {employee.dailyReport}
                      </div>
                      <div className="text-center text-gray-800">
                        {employee.punchIn}
                      </div>
                      <div className="text-center text-gray-800">
                        {employee.punchOut}
                      </div>
                    </div>
                  ))
                : [...Array(7)].map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 gap-2 p-2 text-xs"
                    >
                      <div className="text-center text-gray-400 font-medium">
                        {index + 1}
                      </div>
                      <div className="h-4 bg-gray-50"></div>
                      <div className="h-4 bg-gray-50"></div>
                      <div className="h-4 bg-gray-50"></div>
                      <div className="h-4 bg-gray-50"></div>
                      <div className="h-4 bg-gray-50"></div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
