import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import CreateReport from './pages/CreateReport'
import ReportFormPage from './pages/ReportFormPage'
import Settings from './pages/Settings'

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#f5f6fb]">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-report" element={<CreateReport />} />
          <Route path="/report-form" element={<ReportFormPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
