export const initialStudents = [
  {
    id: "STU-001",
    name: "Alex Rivera",
    email: "alex.rivera@devhack.io",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    loginTime: "10:02 AM",
    assignedTask: "Distributed Key-Value Store",
    difficulty: "Hard",
    status: "Completed",
    timerRemaining: 340,
    progress: 100,
    unitTestStarted: true,
    unitTestPassed: "15/15",
    integrationStarted: true,
    integrationPassed: "8/8",
    buildStatus: "Successful",
    deploymentStatus: "Live",
    submissionStatus: "Submitted",
    completionPercentage: 100,
    score: 98,
    liveUrl: "https://eval-app-001.hackathon.dev",
    logs: [
      "[INFO] 10:02:15 - User authenticated successfully.",
      "[BUILD] 10:14:02 - Compiling Go binary target kv-store...",
      "[TEST] 10:28:40 - Running Unit Tests (15 passed, 0 failed).",
      "[TEST] 10:35:10 - Integration benchmark suite complete.",
      "[DEPLOY] 10:42:00 - Deployed to edge cluster US-East."
    ]
  },
  {
    id: "STU-002",
    name: "Sarah Chen",
    email: "sarah.chen@codecraft.org",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    loginTime: "10:05 AM",
    assignedTask: "Real-time Event Streaming Engine",
    difficulty: "Hard",
    status: "Testing",
    timerRemaining: 820,
    progress: 88,
    unitTestStarted: true,
    unitTestPassed: "18/20",
    integrationStarted: true,
    integrationPassed: "6/8",
    buildStatus: "Successful",
    deploymentStatus: "Deploying",
    submissionStatus: "Pending",
    completionPercentage: 88,
    score: 94,
    liveUrl: "https://eval-app-002.hackathon.dev",
    logs: [
      "[INFO] 10:05:00 - Student joined workspace.",
      "[BUILD] 10:30:11 - TypeScript compilation succeeded.",
      "[TEST] 10:48:22 - Unit testing in progress...",
      "[TEST] 10:52:14 - 18/20 assertions passed."
    ]
  },
  {
    id: "STU-003",
    name: "Marcus Vance",
    email: "marcus.vance@techsuite.dev",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    loginTime: "10:01 AM",
    assignedTask: "GraphQL Mesh Gateway",
    difficulty: "Medium",
    status: "Coding",
    timerRemaining: 1450,
    progress: 65,
    unitTestStarted: true,
    unitTestPassed: "10/14",
    integrationStarted: false,
    integrationPassed: "0/6",
    buildStatus: "In Progress",
    deploymentStatus: "Not Started",
    submissionStatus: "Pending",
    completionPercentage: 65,
    score: 82,
    liveUrl: "https://eval-app-003.hackathon.dev",
    logs: [
      "[INFO] 10:01:45 - Workspace initialized.",
      "[BUILD] 10:20:10 - NPM install finished with 0 vulnerabilities."
    ]
  },
  {
    id: "STU-004",
    name: "Elena Rostova",
    email: "elena.r@cybernet.io",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    loginTime: "10:10 AM",
    assignedTask: "OAuth2 / OIDC Auth Provider",
    difficulty: "Medium",
    status: "Submitted",
    timerRemaining: 210,
    progress: 95,
    unitTestStarted: true,
    unitTestPassed: "14/14",
    integrationStarted: true,
    integrationPassed: "7/7",
    buildStatus: "Successful",
    deploymentStatus: "Live",
    submissionStatus: "Submitted",
    completionPercentage: 95,
    score: 96,
    liveUrl: "https://eval-app-004.hackathon.dev",
    logs: [
      "[INFO] 10:10:02 - OAuth test suite linked.",
      "[TEST] 10:40:00 - Security tokens validated.",
      "[SUBMIT] 10:55:20 - Code payload pushed to evaluator repository."
    ]
  },
  {
    id: "STU-005",
    name: "David Kim",
    email: "dkim@quantumcode.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    loginTime: "10:12 AM",
    assignedTask: "B-Tree Database Indexer",
    difficulty: "Hard",
    status: "Coding",
    timerRemaining: 1890,
    progress: 52,
    unitTestStarted: true,
    unitTestPassed: "6/12",
    integrationStarted: false,
    integrationPassed: "0/5",
    buildStatus: "Failed",
    deploymentStatus: "Failed",
    submissionStatus: "Pending",
    completionPercentage: 52,
    score: 70,
    liveUrl: "https://eval-app-005.hackathon.dev",
    logs: [
      "[ERR] 10:35:12 - Segmentation Fault in btree_insert.c at line 142.",
      "[WARN] 10:38:00 - Re-compiling target with debug symbols..."
    ]
  },
  {
    id: "STU-006",
    name: "Aisha Patel",
    email: "aisha.p@nextgen.org",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    loginTime: "10:04 AM",
    assignedTask: "WebSocket Chat Broker",
    difficulty: "Easy",
    status: "Completed",
    timerRemaining: 540,
    progress: 100,
    unitTestStarted: true,
    unitTestPassed: "10/10",
    integrationStarted: true,
    integrationPassed: "5/5",
    buildStatus: "Successful",
    deploymentStatus: "Live",
    submissionStatus: "Submitted",
    completionPercentage: 100,
    score: 99,
    liveUrl: "https://eval-app-006.hackathon.dev",
    logs: [
      "[INFO] 10:04:10 - Connected via Socket.IO client.",
      "[SUBMIT] 10:42:00 - Submission confirmed with 100% test coverage."
    ]
  },
  {
    id: "STU-007",
    name: "Liam O'Connor",
    email: "liam.oc@dublin-dev.ie",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    loginTime: "10:15 AM",
    assignedTask: "Markdown Parsing AST Engine",
    difficulty: "Easy",
    status: "Logged In",
    timerRemaining: 2350,
    progress: 30,
    unitTestStarted: false,
    unitTestPassed: "0/10",
    integrationStarted: false,
    integrationPassed: "0/4",
    buildStatus: "Pending",
    deploymentStatus: "Not Started",
    submissionStatus: "Pending",
    completionPercentage: 30,
    score: 60,
    liveUrl: "https://eval-app-007.hackathon.dev",
    logs: [
      "[INFO] 10:15:00 - Student active."
    ]
  },
  {
    id: "STU-008",
    name: "Maya Lin",
    email: "maya.l@siliconart.io",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    loginTime: "10:03 AM",
    assignedTask: "Vector Search Embedding Server",
    difficulty: "Hard",
    status: "Testing",
    timerRemaining: 670,
    progress: 84,
    unitTestStarted: true,
    unitTestPassed: "16/16",
    integrationStarted: true,
    integrationPassed: "6/8",
    buildStatus: "Successful",
    deploymentStatus: "Live",
    submissionStatus: "Pending",
    completionPercentage: 84,
    score: 91,
    liveUrl: "https://eval-app-008.hackathon.dev",
    logs: [
      "[TEST] 10:50:11 - Cosine similarity benchmark test executing..."
    ]
  },
  {
    id: "STU-009",
    name: "Carlos Mendez",
    email: "carlos.m@latam-tech.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    loginTime: "10:08 AM",
    assignedTask: "Rate Limiter Token Bucket",
    difficulty: "Medium",
    status: "Coding",
    timerRemaining: 1200,
    progress: 72,
    unitTestStarted: true,
    unitTestPassed: "9/10",
    integrationStarted: true,
    integrationPassed: "3/5",
    buildStatus: "Successful",
    deploymentStatus: "Deploying",
    submissionStatus: "Pending",
    completionPercentage: 72,
    score: 85,
    liveUrl: "https://eval-app-009.hackathon.dev",
    logs: [
      "[INFO] Redis instance connected."
    ]
  },
  {
    id: "STU-010",
    name: "Hanna Schmidt",
    email: "hanna.s@berlincode.de",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    loginTime: "10:00 AM",
    assignedTask: "Distributed Key-Value Store",
    difficulty: "Hard",
    status: "Completed",
    timerRemaining: 120,
    progress: 100,
    unitTestStarted: true,
    unitTestPassed: "15/15",
    integrationStarted: true,
    integrationPassed: "8/8",
    buildStatus: "Successful",
    deploymentStatus: "Live",
    submissionStatus: "Submitted",
    completionPercentage: 100,
    score: 97,
    liveUrl: "https://eval-app-010.hackathon.dev",
    logs: [
      "[SUBMIT] 10:48:00 - High score verified."
    ]
  }
];

// Generate additional 40 realistic mock students programmatically
const names = [
  "Jordan Bell", "Chloe Bennett", "Tariq Mansour", "Kaitlyn Wright", "Vikram Shah",
  "Zoe Nakamura", "Mateo Rossi", "Fatima Al-Hassan", "Lucas Dubois", "Amara Okafor",
  "Dmitri Ivanov", "Siddharth Rao", "Emily Watson", "Yuki Tanaka", "Gabriel Silva",
  "Nadia Kowalski", "Benjamin Cole", "Leila Haddad", "Oliver Smith", "Sophie Martin",
  "Ethan Hunt", "Mia Zhang", "Noah Williams", "Isabella Garcia", "Liam Johnson",
  "Charlotte Brown", "Mason Davis", "Amelia Miller", "Logan Wilson", "Harper Taylor",
  "James Anderson", "Evelyn Thomas", "Alexander Jackson", "Abigail White", "Daniel Harris",
  "Ella Martin", "Henry Thompson", "Grace Garcia", "Jackson Martinez", "Victoria Robinson"
];

const tasks = [
  { name: "Distributed Key-Value Store", difficulty: "Hard" },
  { name: "Real-time Event Streaming Engine", difficulty: "Hard" },
  { name: "GraphQL Mesh Gateway", difficulty: "Medium" },
  { name: "OAuth2 / OIDC Auth Provider", difficulty: "Medium" },
  { name: "B-Tree Database Indexer", difficulty: "Hard" },
  { name: "WebSocket Chat Broker", difficulty: "Easy" },
  { name: "Markdown Parsing AST Engine", difficulty: "Easy" },
  { name: "Vector Search Embedding Server", difficulty: "Hard" },
  { name: "Rate Limiter Token Bucket", difficulty: "Medium" },
  { name: "LRU Cache with TTL", difficulty: "Easy" },
  { name: "In-Memory Pub/Sub Bus", difficulty: "Medium" },
  { name: "Raft Consensus Protocol", difficulty: "Hard" }
];

const statuses = ["Offline", "Logged In", "Coding", "Testing", "Submitted", "Completed"];
const builds = ["Successful", "Failed", "In Progress", "Pending"];

for (let i = 11; i <= 50; i++) {
  const index = i - 1;
  const name = names[index % names.length] + ` ${i}`;
  const email = name.toLowerCase().replace(/[^a-z0-9]/g, '.') + "@evalhub.io";
  const taskObj = tasks[i % tasks.length];
  const status = statuses[i % statuses.length];
  
  const isComplete = status === "Completed" || status === "Submitted";
  const isOffline = status === "Offline";
  const timer = isComplete ? Math.floor(Math.random() * 300) : isOffline ? 3600 : Math.floor(Math.random() * 2500) + 200;
  const progress = isComplete ? 100 : isOffline ? 0 : Math.floor(Math.random() * 85) + 10;
  
  const unitPassed = isComplete ? "12/12" : `${Math.floor(progress / 10)}/12`;
  const integPassed = isComplete ? "6/6" : `${Math.floor(progress / 20)}/6`;
  const build = isOffline ? "Pending" : (i % 7 === 0 ? "Failed" : "Successful");
  const deploy = build === "Successful" ? (isComplete ? "Live" : "Deploying") : (build === "Failed" ? "Failed" : "Not Started");
  const submission = isComplete ? "Submitted" : (i % 8 === 0 ? "Late" : "Pending");
  const score = isComplete ? 85 + (i % 15) : Math.floor(progress * 0.9);

  initialStudents.push({
    id: `STU-${String(i).padStart(3, '0')}`,
    name: name,
    email: email,
    avatar: `https://images.unsplash.com/photo-${1500000000000 + (i * 12345) % 999999}?w=150&auto=format&fit=crop&q=80`,
    loginTime: `10:${String(i % 55).padStart(2, '0')} AM`,
    assignedTask: taskObj.name,
    difficulty: taskObj.difficulty,
    status: status,
    timerRemaining: timer,
    progress: progress,
    unitTestStarted: !isOffline,
    unitTestPassed: unitPassed,
    integrationStarted: progress > 40,
    integrationPassed: integPassed,
    buildStatus: build,
    deploymentStatus: deploy,
    submissionStatus: submission,
    completionPercentage: progress,
    score: score,
    liveUrl: `https://eval-app-${String(i).padStart(3, '0')}.hackathon.dev`,
    logs: [
      `[INFO] Workspace initialized for ${name}.`,
      `[SYSTEM] Task "${taskObj.name}" loaded with automated suite.`,
      build === "Failed" ? "[ERR] Syntax compile error on line 48." : "[BUILD] Target binary constructed."
    ]
  });
}

export const initialActivities = [
  { id: 1, text: "Alex Rivera submitted final code for Distributed Key-Value Store", time: "Just now", type: "submit", iconColor: "text-emerald-400" },
  { id: 2, text: "Hanna Schmidt passed 15/15 Unit Tests", time: "1 min ago", type: "test", iconColor: "text-blue-400" },
  { id: 3, text: "Sarah Chen triggered deployment to US-East-1", time: "3 mins ago", type: "deploy", iconColor: "text-purple-400" },
  { id: 4, text: "David Kim build failed - Segmentation Fault in kernel module", time: "5 mins ago", type: "alert", iconColor: "text-red-400" },
  { id: 5, text: "Elena Rostova started Integration Suite", time: "6 mins ago", type: "test", iconColor: "text-amber-400" },
  { id: 6, text: "Carlos Mendez logged in to workspace", time: "9 mins ago", type: "login", iconColor: "text-slate-400" },
];
