import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LiveDataProvider, useLiveData } from './context/LiveDataContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import RightPanel from './components/RightPanel';
import NotificationPanel from './components/NotificationPanel';
import StudentEvaluationModal from './components/StudentEvaluationModal';
import LogsViewerModal from './components/LogsViewerModal';

// Pages
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/StudentsPage';
import SubmissionsPage from './pages/SubmissionsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LogsPage from './pages/LogsPage';

function AppContent() {
  const { isDarkMode } = useLiveData();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans selection:bg-blue-500 selection:text-white ${
      isDarkMode ? 'bg-[#0D0D0D] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Sidebar Component */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
        {/* Sticky Navbar */}
        <Navbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        />

        {/* Floating Notification Panel Drawer */}
        <NotificationPanel
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        {/* Evaluation & Log Modals */}
        <StudentEvaluationModal />
        <LogsViewerModal />

        {/* Content Body + Right Panel Layout */}
        <div className="flex-1 px-4 lg:px-6 pt-6 flex gap-6">
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>

          {/* Sticky Live Event Right Side Panel */}
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LiveDataProvider>
        <AppContent />
      </LiveDataProvider>
    </Router>
  );
}
