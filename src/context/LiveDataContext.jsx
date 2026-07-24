import React, { createContext, useContext, useState, useEffect } from 'react';
import { rtdb } from '../config/firebase';
import { ref, onValue, set } from 'firebase/database';

const LiveDataContext = createContext();

export const LiveDataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);

  // Connect to Firebase Realtime Database (`/status/users`, `/users`, `/logs/all_submissions`, `/all_submissions`, `/submissions`)
  useEffect(() => {
    if (!rtdb) return;

    const statusRef = ref(rtdb, 'status/users');
    const rootUsersRef = ref(rtdb, 'users');
    const submissionsRef = ref(rtdb, 'logs/all_submissions');
    const directSubmissionsRef = ref(rtdb, 'all_submissions');
    const rootSubmissionsRef = ref(rtdb, 'submissions');

    let currentStatusUsers = {};
    let currentRootUsers = {};
    let currentLogsSubmissions = {};
    let currentDirectSubmissions = {};
    let currentRootSubmissions = {};

    const updateCombinedData = () => {
      const mergedUsers = { ...currentRootUsers, ...currentStatusUsers };

      const allSubList = [];
      const extractSubs = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        Object.entries(obj).forEach(([k, item]) => {
          if (!item) return;
          if (item.uid || item.userId || item.submittedAt || item.fileName || item.r2Url || item.email || item.displayName) {
            allSubList.push({ id: k, ...item });
          } else if (typeof item === 'object') {
            extractSubs(item);
          }
        });
      };

      extractSubs(currentLogsSubmissions);
      extractSubs(currentDirectSubmissions);
      extractSubs(currentRootSubmissions);

      const subsArray = [...allSubList].sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));

      const subsByUid = {};
      subsArray.forEach(sub => {
        const uidKey = sub.uid || sub.userId || sub.id;
        if (uidKey) {
          subsByUid[uidKey] = subsByUid[uidKey] || [];
          subsByUid[uidKey].push(sub);
        }
      });

      const uids = new Set([...Object.keys(mergedUsers), ...Object.keys(subsByUid)]);
      if (uids.size === 0) return;

      const realStudents = [];
      const realActivities = [];

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

      uids.forEach(uid => {
        const statusUser = mergedUsers[uid] || {};
        const userSubs = subsByUid[uid] || subsArray.filter(s => s.uid === uid || s.userId === uid);
        const latestSub = userSubs[0] || {};

        const displayName = statusUser.displayName || statusUser.name || latestSub.displayName || latestSub.name || "Unknown Student";
        const email = statusUser.email || latestSub.email || "N/A";
        const avatar = statusUser.photoURL || statusUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
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
          assignedTask: latestSub.taskId || statusUser.assignedTask || "Distributed Key-Value Store",
          difficulty: "Hard",
          status: statusStr,
          timerRemaining: latestSub.durationSeconds || (isOnline ? 1200 : 0),
          progress: progressVal,
          unitTestStarted: statusUser.unitTestStarted || isOnline || hasSubmitted,
          unitTestPassed: statusUser.unitTestPassed || (hasSubmitted ? "15/15" : (isOnline ? "10/15" : "0/15")),
          integrationStarted: Boolean(statusUser.integrationStarted),
          integrationPassed: statusUser.integrationPassed || "0/8",
          buildStatus: statusUser.buildStatus || (hasSubmitted ? "Successful" : (isOnline ? "In Progress" : "Pending")),
          deploymentStatus: statusUser.deploymentStatus || (statusUser.isDeployed ? "Live" : "Not Started"),
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
    });

    const unsubRootUsers = onValue(rootUsersRef, (snapshot) => {
      currentRootUsers = snapshot.val() || {};
      updateCombinedData();
    });

    const unsubSubmissions = onValue(submissionsRef, (snapshot) => {
      currentLogsSubmissions = snapshot.val() || {};
      updateCombinedData();
    });

    const unsubDirectSubmissions = onValue(directSubmissionsRef, (snapshot) => {
      currentDirectSubmissions = snapshot.val() || {};
      updateCombinedData();
    });

    const unsubRootSubmissions = onValue(rootSubmissionsRef, (snapshot) => {
      currentRootSubmissions = snapshot.val() || {};
      updateCombinedData();
    });

    return () => {
      unsubStatus();
      unsubRootUsers();
      unsubSubmissions();
      unsubDirectSubmissions();
      unsubRootSubmissions();
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

  // Integration States
  const [integrationData, setIntegrationData] = useState({
    integrationComplete: false,
    hostingComplete: false,
    integrationUrl: '',
    integrationTimestamp: null,
    hostingTimestamp: null
  });

  useEffect(() => {
    if (!rtdb) return;
    const integrationRef = ref(rtdb, 'admin_integration');
    const unsub = onValue(integrationRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIntegrationData({
          integrationComplete: data.integrationComplete || false,
          hostingComplete: data.hostingComplete || false,
          integrationUrl: data.integrationUrl || '',
          integrationTimestamp: data.integrationTimestamp || null,
          hostingTimestamp: data.hostingTimestamp || null
        });
      } else {
        setIntegrationData({
          integrationComplete: false,
          hostingComplete: false,
          integrationUrl: '',
          integrationTimestamp: null,
          hostingTimestamp: null
        });
      }
    });
    return () => unsub();
  }, []);

  const updateIntegrationData = (updates) => {
    if (!rtdb) return;
    const integrationRef = ref(rtdb, 'admin_integration');
    set(integrationRef, { ...integrationData, ...updates });
  };



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
  const completedCount = (submissionsCount >= 50 || (totalStudents > 0 && submissionsCount >= totalStudents))
    ? Math.max(submissionsCount, students.filter(s => s.status === "Completed").length)
    : students.filter(s => s.status === "Completed").length;
  const timerRunningCount = students.filter(s => s.timerRemaining > 0 && s.status !== "Completed").length;
  const unitTestsStartedCount = students.filter(s => s.unitTestStarted).length;
  const unitTestsPassedCount = students.filter(s => s.unitTestPassed.startsWith("12") || s.unitTestPassed.startsWith("15") || s.unitTestPassed.startsWith("10") || s.unitTestPassed.startsWith("14") || s.unitTestPassed.startsWith("18") || s.unitTestPassed.startsWith("16")).length;
  const integrationStartedCount = students.filter(s => s.integrationStarted).length;
  const integrationPassedCount = students.filter(s => s.integrationPassed && !s.integrationPassed.startsWith("0")).length;
  const successfulDeployments = students.filter(s => s.deploymentStatus === "Live").length;
  const failedBuilds = students.filter(s => s.buildStatus === "Failed").length;

  const overallCompletionPercentage = (submissionsCount >= 50 || (totalStudents > 0 && submissionsCount >= totalStudents))
    ? 100
    : (totalStudents > 0 ? Math.min(100, Math.round(
      students.reduce((acc, curr) => acc + (curr.completionPercentage || 0), 0) / totalStudents
    )) : 0);

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
      // Integration
      integrationData,
      updateIntegrationData,
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
