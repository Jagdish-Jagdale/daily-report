// Use the provided published Google Sheets URL.
// NOTE: A published sheet (pubhtml) is not a writable webhook. To actually append rows you still need a writable endpoint (Google Apps Script web app or backend).
export const SHEET_WEBHOOK_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPVYGhH-ZDKjws0fWeWNrbaddtOmQSvSNmr7INqmqWTIBSCmWTE6qnZxUtnUxk_W1VDQCv05eTSOJM/pubhtml";

// returns true if webhook looks configured
export const isSheetConfigured = () =>
  typeof SHEET_WEBHOOK_URL === "string" &&
  SHEET_WEBHOOK_URL.length > 10 &&
  !SHEET_WEBHOOK_URL.includes("REPLACE_WITH");
