import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CreateReport from "./pages/CreateReport";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ExcelSheet from "./pages/ExcelSheet";
import { CompanyProvider } from "./context/CompanyContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <Router>
          <ProtectedRoute>
            <div className="flex h-screen bg-[#f5f6fb]">
              <Sidebar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/create-report" element={<CreateReport />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/excel" element={<ExcelSheet />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </ProtectedRoute>
        </Router>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;
