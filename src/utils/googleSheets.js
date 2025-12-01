import { SHEET_WEBHOOK_URL, isSheetConfigured } from "../config";

/**
 * postReportToSheet(report)
 * - report: object { date, teamName, totalEmployees, present, employees: [...] }
 * - returns { success: boolean, message?: string, data?: any }
 */
export async function postReportToSheet(report) {
  if (!isSheetConfigured()) {
    return {
      success: false,
      message:
        "Google Sheets webhook not configured. Set REACT_APP_SHEET_WEBHOOK_URL in .env or update src/config.js",
    };
  }

  try {
    const rows = [];
    const date = report.date || new Date().toISOString().split("T")[0];
    const teamName = report.teamName || "";

    (report.employees || []).forEach((emp) => {
      rows.push([
        date,
        teamName,
        emp.name || "",
        emp.present ?? "-", // preserve if per-employee present exists
        report.totalEmployees || "",
        emp.project || "",
        emp.dailyReport || "",
        emp.punchIn || "",
        emp.punchOut || "",
      ]);
    });

    const payload = { rows, sheetName: "Sheet1" };

    const res = await fetch(SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, message: `Webhook HTTP ${res.status}: ${text}` };
    }

    const json = await res.json().catch(() => null);
    return { success: true, data: json || null };
  } catch (error) {
    return { success: false, message: error.message || String(error) };
  }
}
