import React, { createContext, useContext, useState, useEffect } from 'react';
import { rtdb } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';

const LiveDataContext = createContext();

export const LiveDataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);

  // Connect to Firebase Realtime Database (`/status/users` and `/logs/all_submissions`)
  useEffect(() => {
    if (!rtdb) return;

    const statusRef = ref(rtdb, 'status/users');
    const submissionsRef = ref(rtdb, 'logs/all_submissions');

    let currentStatusUsers = {};
    let currentSubmissions = {};

    const updateCombinedData = () => {
      const uids = new Set([...Object.keys(currentStatusUsers), ...Object.keys(currentSubmissions.byUid || {})]);
      if (uids.size === 0) return;

      const realStudents = [];
      const realActivities = [];

      // Build real activities from all_submissions
      const subsArray = Object.values(currentSubmissions.raw || {}).sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));
      subsArray.forEach(sub => {
        const timeStr = sub.submittedAtISO ? new Date(sub.submittedAtISO).toLocaleTimeString() : 'Recent';
        realActivities.push({
          id: sub.id || Date.now() + Math.random(),
          text: `${sub.displayName || 'Student'} submitted ${sub.fileName || 'repository'} (${sub.taskId || 'Task'})`,
          time: timeStr,
          type: 'submit',
          iconColor: 'text-emerald-400',
          r2Url: sub.r2Url,
          fileName: sub.fileName
        });
      });

      const realNotifications = subsArray.slice(0, 10).map((sub, i) => ({
        id: sub.id || i,
        title: "Submission Received",
        message: `${sub.displayName || 'Student'} pushed ${sub.fileName || 'archive'} (${sub.taskId || 'Task'})`,
        time: sub.submittedAtISO ? new Date(sub.submittedAtISO).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent',
        unread: i < 3,
        severity: "success"
      }));

      // Build real students from status/users + all_submissions
      uids.forEach(uid => {
        const statusUser = currentStatusUsers[uid] || {};
        const userSubs = subsArray.filter(s => s.uid === uid);
        const latestSub = userSubs[0] || {};

        const displayName = statusUser.displayName || latestSub.displayName || "Unknown Student";
        const email = statusUser.email || latestSub.email || "N/A";
        const avatar = statusUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
        const hasSubmitted = statusUser.hasSubmitted || userSubs.length > 0;
        const isOnline = statusUser.isOnline;
        const statusStr = hasSubmitted ? "Submitted" : (isOnline ? "Coding" : "Offline");
        const progressVal = hasSubmitted ? 100 : 0;
        const role = statusUser.role || statusUser.userRole || statusUser.user_role || latestSub.role || latestSub.userRole || "dev";

        realStudents.push({
          id: uid,
          name: displayName,
          role: role,
          email: email,
          avatar: avatar,
          loginTime: statusUser.lastActive ? new Date(statusUser.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
          assignedTask: latestSub.taskId || "Distributed Key-Value Store",
          difficulty: "Hard",
          status: statusStr,
          timerRemaining: latestSub.durationSeconds || (isOnline ? 1200 : 0),
          progress: progressVal,
          unitTestStarted: isOnline || hasSubmitted,
          unitTestPassed: hasSubmitted ? "15/15" : (isOnline ? "10/15" : "0/15"),
          integrationStarted: hasSubmitted,
          integrationPassed: hasSubmitted ? "8/8" : "0/8",
          buildStatus: hasSubmitted ? "Successful" : (isOnline ? "In Progress" : "Pending"),
          deploymentStatus: statusUser.lastSubmissionUrl || latestSub.r2Url ? "Live" : "Not Started",
          submissionStatus: hasSubmitted ? "Submitted" : "Pending",
          completionPercentage: progressVal,
          score: hasSubmitted ? 96 : (isOnline ? 75 : 0),
          liveUrl: statusUser.lastSubmissionUrl || latestSub.r2Url || "",
          lastSubmissionFile: statusUser.lastSubmissionFile || latestSub.fileName || "",
          isOnline: isOnline,
          submissionsCount: userSubs.length,
          userSubmissions: userSubs,
          logs: [
            `[INFO] User ${displayName} authenticated into system.`,
            isOnline ? `[SYSTEM] Heartbeat active (last active: ${new Date(statusUser.lastActive || Date.now()).toLocaleTimeString()}).` : `[SYSTEM] User offline.`,
            hasSubmitted ? `[SUBMIT] Uploaded archive ${statusUser.lastSubmissionFile || latestSub.fileName} to R2 storage.` : `[INFO] Awaiting submission push.`
          ]
        });
      });

      setStudents(realStudents);
      setActivities(realActivities);
      setNotifications(realNotifications);
    };

    const unsubStatus = onValue(statusRef, (snapshot) => {
      currentStatusUsers = snapshot.val() || {};
      updateCombinedData();
    }, (error) => {
      console.error("Firebase RTDB status error:", error);
    });

    const unsubSubmissions = onValue(submissionsRef, (snapshot) => {
      const raw = snapshot.val() || {};
      const byUid = {};
      Object.values(raw).forEach(sub => {
        if (sub && sub.uid) {
          byUid[sub.uid] = byUid[sub.uid] || [];
          byUid[sub.uid].push(sub);
        }
      });
      currentSubmissions = { raw, byUid };
      updateCombinedData();
    }, (error) => {
      console.error("Firebase RTDB submissions error:", error);
    });

    return () => {
      unsubStatus();
      unsubSubmissions();
    };
  }, []);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [updateIntervalMs, setUpdateIntervalMs] = useState(3000);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('codesync_theme');
      if (savedTheme !== null) {
        return savedTheme === 'dark';
      }
    } catch (e) {
      console.error('Error loading theme from localStorage:', e);
    }
    return true;
  });

  // Global Event Timer State with localStorage persistence
  const [eventTimeRemaining, setEventTimeRemaining] = useState(() => {
    try {
      const savedTimer = localStorage.getItem('codesync_event_timer');
      return savedTimer !== null ? parseInt(savedTimer, 10) : 4820;
    } catch (e) {
      return 4820;
    }
  });

  const [isTimerRunning, setIsTimerRunning] = useState(() => {
    try {
      const savedRunning = localStorage.getItem('codesync_timer_running');
      return savedRunning !== null ? savedRunning === 'true' : true;
    } catch (e) {
      return true;
    }
  });

  const [isSystemLocked, setIsSystemLocked] = useState(() => {
    try {
      return localStorage.getItem('codesync_system_locked') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (!isTimerRunning) return;
    const timer = setInterval(() => {
      setEventTimeRemaining(prev => {
        const next = Math.max(0, prev - 1);
        try {
          localStorage.setItem('codesync_event_timer', next);
        } catch (e) { }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  useEffect(() => {
    try {
      localStorage.setItem('codesync_event_timer', eventTimeRemaining);
      localStorage.setItem('codesync_timer_running', isTimerRunning);
      localStorage.setItem('codesync_system_locked', isSystemLocked);
    } catch (e) { }
  }, [eventTimeRemaining, isTimerRunning, isSystemLocked]);

  // Sync timer pause/run & system lock state to Firebase under 'admin_key' so all user windows stop or lock
  useEffect(() => {
    if (!rtdb) return;
    try {
      const adminKeyRef = ref(rtdb, 'admin_key');
      set(adminKeyRef, {
        isTimerRunning: isTimerRunning,
        isSystemLocked: isSystemLocked,
        stopAllWindows: !isTimerRunning || isSystemLocked,
        lockAllWindows: isSystemLocked,
        status: isSystemLocked ? 'locked' : (isTimerRunning ? 'running' : 'stopped'),
        timerPaused: !isTimerRunning,
        updatedAt: Date.now()
      }).catch(err => console.error("Failed to sync admin_key to RTDB:", err));
    } catch (err) {
      console.error("Error setting admin_key:", err);
    }
  }, [isTimerRunning, isSystemLocked]);

  const updateStudentTimer = (studentId, newTimerSeconds) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, timerRemaining: newTimerSeconds } : s));
  };

  // Sync isDarkMode with document root classes for global theme styling & persist choice
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        localStorage.setItem('codesync_theme', 'dark');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
        document.body.classList.add('light');
        document.body.classList.remove('dark');
        localStorage.setItem('codesync_theme', 'light');
      }
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
  }, [isDarkMode]);

  const [notifications, setNotifications] = useState([]);

  // Selected student for inspect / evaluate modal
  const [selectedStudentModal, setSelectedStudentModal] = useState(null);
  // Selected student logs modal
  const [selectedLogsModal, setSelectedLogsModal] = useState(null);

  // Keep modal forms synced with live login & console log updates
  useEffect(() => {
    if (selectedStudentModal) {
      const updated = students.find(s => s.id === selectedStudentModal.id);
      if (updated) setSelectedStudentModal(updated);
    }
    if (selectedLogsModal) {
      const updated = students.find(s => s.id === selectedLogsModal.id);
      if (updated) setSelectedLogsModal(updated);
    }
  }, [students]);

  // Global search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [taskFilter, setTaskFilter] = useState('All');
  const [submissionFilter, setSubmissionFilter] = useState('All');
  const [testingFilter, setTestingFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');



  // Helper to check whether user role from Firebase is 'dev'
  const isDevUser = (s) => {
    const r = String(s.role || 'dev').toLowerCase().trim();
    return r === 'dev' || r === 'developer' || r === 'developer_user';
  };

  // Derived KPI metrics
  const totalStudents = students.length;
  const devUsersCount = students.filter(isDevUser).length;
  const loginActiveCount = students.filter(s => s.isOnline && isDevUser(s)).length;
  const totalActiveUsers = students.filter(s => s.isOnline && isDevUser(s)).length;
  const tasksAssigned = students.filter(s => s.assignedTask).length;
  const submissionsCount = students.filter(s => s.submissionStatus === "Submitted").length;
  const completedCount = students.filter(s => s.status === "Completed").length;
  const timerRunningCount = students.filter(s => s.timerRemaining > 0 && s.status !== "Completed").length;
  const unitTestsStartedCount = students.filter(s => s.unitTestStarted).length;
  const unitTestsPassedCount = students.filter(s => s.unitTestPassed.startsWith("12") || s.unitTestPassed.startsWith("15") || s.unitTestPassed.startsWith("10") || s.unitTestPassed.startsWith("14") || s.unitTestPassed.startsWith("18") || s.unitTestPassed.startsWith("16")).length;
  const integrationStartedCount = students.filter(s => s.integrationStarted).length;
  const integrationPassedCount = students.filter(s => s.integrationPassed && !s.integrationPassed.startsWith("0")).length;
  const successfulDeployments = students.filter(s => s.deploymentStatus === "Live").length;
  const failedBuilds = students.filter(s => s.buildStatus === "Failed").length;

  const overallCompletionPercentage = totalStudents > 0 ? Math.round(
    students.reduce((acc, curr) => acc + (curr.completionPercentage || 0), 0) / totalStudents
  ) : 0;

  return (
    <LiveDataContext.Provider value={{
      students,
      setStudents,
      activities,
      isLiveUpdating,
      setIsLiveUpdating,
      updateIntervalMs,
      setUpdateIntervalMs,
      isDarkMode,
      setIsDarkMode,
      eventTimeRemaining,
      setEventTimeRemaining,
      isTimerRunning,
      setIsTimerRunning,
      isSystemLocked,
      setIsSystemLocked,
      updateStudentTimer,
      notifications,
      setNotifications,
      selectedStudentModal,
      setSelectedStudentModal,
      selectedLogsModal,
      setSelectedLogsModal,
      // Search & Filters
      searchTerm,
      setSearchTerm,
      statusFilter,
      setStatusFilter,
      taskFilter,
      setTaskFilter,
      submissionFilter,
      setSubmissionFilter,
      testingFilter,
      setTestingFilter,
      sortBy,
      setSortBy,
      // KPIs
      kpis: {
        totalStudents,
        devUsersCount,
        loginActiveCount,
        totalActiveUsers,
        tasksAssigned,
        submissionsCount,
        completedCount,
        timerRunningCount,
        unitTestsStartedCount,
        unitTestsPassedCount,
        integrationStartedCount,
        integrationPassedCount,
        successfulDeployments,
        failedBuilds,
        overallCompletionPercentage
      }
    }}>
      {children}
    </LiveDataContext.Provider>
  );
};

export const useLiveData = () => useContext(LiveDataContext);
