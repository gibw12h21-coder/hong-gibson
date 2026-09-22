import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_FILE = path.join(process.cwd(), "data.json");

const defaultData = {
  badminton: {
    session: {
      id: 'session-2026-w38',
      title: '第38週常廣羽球社友誼賽',
      date: '每周三',
      time: '18:00 - 19:30',
      location: '苑裡-甲組羽球場',
      deadline: '2026-09-21 23:59',
      status: 'open',
    },
    members: [
      { id: 'm1', name: 'LIAO', department: '', skillLevel: 'A-進階', consecutiveAbsences: 5, totalAttendance: 18, email: 'liao@company.com', phone: '0912-345-678' },
      { id: 'm2', name: 'Stanley Lin', department: '', skillLevel: 'B-中階', consecutiveAbsences: 1, totalAttendance: 12, email: 'stanley@company.com', phone: '0922-111-222' },
      { id: 'm3', name: 'Susam', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 16, email: 'susam@company.com', phone: '0933-444-555' },
      { id: 'm4', name: 'Vicky__陳亭伊', department: '', skillLevel: 'B-中階', consecutiveAbsences: 2, totalAttendance: 14, email: 'vicky@company.com', phone: '0955-666-777' },
      { id: 'm5', name: 'Yen Ping', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 19, email: 'yenping@company.com', phone: '0966-888-999' },
      { id: 'm6', name: '郭威呈', department: '', skillLevel: 'B-中階', consecutiveAbsences: 0, totalAttendance: 10, email: 'kuo@company.com', phone: '0977-123-456' },
      { id: 'm7', name: '鄭聖蓉', department: '', skillLevel: 'C-初階', consecutiveAbsences: 1, totalAttendance: 8, email: 'cheng@company.com', phone: '0988-999-000' },
      { id: 'm8', name: '陳冠伶', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 15, email: 'kuanling@company.com', phone: '0919-888-777' },
      { id: 'm9', name: '陳泰安 (John)', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 22, email: 'john@company.com', phone: '0932-555-443' },
      { id: 'm10', name: '陳玳儒', department: '', skillLevel: 'B-中階', consecutiveAbsences: 3, totalAttendance: 7, email: 'dairu@company.com', phone: '0945-333-221' },
      { id: 'm11', name: '陳靖宇', department: '', skillLevel: 'C-初階', consecutiveAbsences: 0, totalAttendance: 9, email: 'jingyu@company.com', phone: '0928-776-554' },
      { id: 'm12', name: '黃柏傑', department: '', skillLevel: 'B-中階', consecutiveAbsences: 1, totalAttendance: 11, email: 'pochieh@company.com', phone: '0972-112-334' },
      { id: 'm13', name: 'Chloe', department: '', skillLevel: 'C-初階', consecutiveAbsences: 0, totalAttendance: 6, email: 'chloe@company.com', phone: '0911-222-333' },
      { id: 'm14', name: 'Harrison-振豪', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 17, email: 'harrison@company.com', phone: '0933-222-111' },
      { id: 'm15', name: 'Jason Lin', department: '', skillLevel: 'B-中階', consecutiveAbsences: 2, totalAttendance: 10, email: 'jason@company.com', phone: '0944-555-666' },
      { id: 'm16', name: 'Kylechen', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 20, email: 'kyle@company.com', phone: '0955-777-888' },
      { id: 'm17', name: '佳君', department: '', skillLevel: 'C-初階', consecutiveAbsences: 0, totalAttendance: 8, email: 'jiajun@company.com', phone: '0966-111-222' },
      { id: 'm18', name: '依培', department: '', skillLevel: 'B-中階', consecutiveAbsences: 1, totalAttendance: 13, email: 'yipei@company.com', phone: '0977-333-444' },
      { id: 'm19', name: '呂佩蓉', department: '', skillLevel: 'C-初階', consecutiveAbsences: 0, totalAttendance: 9, email: 'peirong@company.com', phone: '0988-555-666' },
      { id: 'm20', name: '婉華', department: '', skillLevel: 'B-中階', consecutiveAbsences: 0, totalAttendance: 12, email: 'wanhua@company.com', phone: '0912-999-888' },
      { id: 'm21', name: '林宜蓁', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 16, email: 'yizhen@company.com', phone: '0923-888-777' },
      { id: 'm22', name: '湘耘 Zora', department: '', skillLevel: 'B-中階', consecutiveAbsences: 0, totalAttendance: 14, email: 'zora@company.com', phone: '0934-776-554' },
      { id: 'm23', name: '湯智凱', department: '', skillLevel: 'A-進階', consecutiveAbsences: 4, totalAttendance: 18, email: 'zhikai@company.com', phone: '0945-665-443' },
      { id: 'm24', name: '灰塵', department: '', skillLevel: 'C-初階', consecutiveAbsences: 1, totalAttendance: 5, email: 'dust@company.com', phone: '0956-554-332' },
      { id: 'm25', name: '王智揚', department: '', skillLevel: 'B-中階', consecutiveAbsences: 0, totalAttendance: 11, email: 'zhiyang@company.com', phone: '0967-443-221' },
      { id: 'm26', name: '白振哲', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 15, email: 'zhenzhe@company.com', phone: '0978-332-110' },
      { id: 'm27', name: '蕙凱 Kelly', department: '', skillLevel: 'B-中階', consecutiveAbsences: 0, totalAttendance: 12, email: 'kelly@company.com', phone: '0989-221-009' },
      { id: 'm28', name: '王宏', department: '', skillLevel: 'A-進階', consecutiveAbsences: 5, totalAttendance: 25, email: 'wanghong@company.com', phone: '0910-111-222' },
    ],
    registrations: [
      { id: 'r1', sessionId: 'session-2026-w38', memberId: 'm1', status: 'attending', updatedAt: '2026-09-19 10:00' },
      { id: 'r2', sessionId: 'session-2026-w38', memberId: 'm2', status: 'attending', updatedAt: '2026-09-19 11:30' },
      { id: 'r3', sessionId: 'session-2026-w38', memberId: 'm3', status: 'absent', excuseReason: '近期專案趕工，周三晚上需要留守加班', updatedAt: '2026-09-20 09:15' },
    ],
    notificationLogs: [
      { id: 'log-1', timestamp: '2026-09-18 09:00', title: '第38週羽球社開打通知', content: '歡迎各位社員踴躍報名本週三中山運動中心羽球友誼賽！', recipientCount: 28, type: 'reminder' }
    ]
  },
  tennis: {
    session: {
      id: 'session-tennis-w38',
      title: '第38週常廣網球社雙打交流賽',
      date: '2026-09-25',
      time: '18:30 - 20:30',
      location: '台北市內湖網球中心 戶外硬地場 (第1、2場地)',
      deadline: '2026-09-23 23:59',
      status: 'open',
    },
    members: [
      { id: 't1', name: 'Stanley Lin', department: '', skillLevel: 'A-進階', consecutiveAbsences: 5, totalAttendance: 14, email: 'stanley@company.com', phone: '0922-111-222' },
      { id: 't2', name: 'LIAO', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 16, email: 'liao@company.com', phone: '0912-345-678' },
      { id: 't3', name: 'Yen Ping', department: '', skillLevel: 'B-中階', consecutiveAbsences: 1, totalAttendance: 12, email: 'yenping@company.com', phone: '0966-888-999' },
      { id: 't4', name: 'Harrison-振豪', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 15, email: 'harrison@company.com', phone: '0933-222-111' },
      { id: 't5', name: 'Kylechen', department: '', skillLevel: 'B-中階', consecutiveAbsences: 0, totalAttendance: 11, email: 'kyle@company.com', phone: '0955-777-888' },
      { id: 't6', name: '依培', department: '', skillLevel: 'C-初階', consecutiveAbsences: 0, totalAttendance: 7, email: 'yipei@company.com', phone: '0977-333-444' },
      { id: 't7', name: '湘耘 Zora', department: '', skillLevel: 'B-中階', consecutiveAbsences: 0, totalAttendance: 10, email: 'zora@company.com', phone: '0934-776-554' },
      { id: 't8', name: '王宏', department: '', skillLevel: 'A-進階', consecutiveAbsences: 5, totalAttendance: 20, email: 'wanghong@company.com', phone: '0910-111-222' },
    ],
    registrations: [
      { id: 'tr1', sessionId: 'session-tennis-w38', memberId: 't1', status: 'attending', updatedAt: '2026-09-19 12:00' },
      { id: 'tr2', sessionId: 'session-tennis-w38', memberId: 't2', status: 'attending', updatedAt: '2026-09-19 13:20' },
    ],
    notificationLogs: [
      { id: 'tlog-1', timestamp: '2026-09-18 10:00', title: '網球社開打通知', content: '歡迎各位社員踴躍報名本週五內湖網球中心友誼賽！', recipientCount: 8, type: 'reminder' }
    ]
  }
};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Error reading data.json", e);
  }
  return defaultData;
}

function saveData(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error writing data.json", e);
  }
}

app.get("/api/data/:sport", (req, res) => {
  const sport = req.params.sport;
  const data = loadData();
  if (data[sport]) {
    res.json(data[sport]);
  } else {
    res.status(404).json({ error: "Sport data not found" });
  }
});

app.post("/api/data/:sport", (req, res) => {
  const sport = req.params.sport;
  const body = req.body;
  const data = loadData();
  if (data[sport]) {
    data[sport] = body;
    saveData(data);
    res.json({ success: true, data: data[sport] });
  } else {
    res.status(404).json({ error: "Sport data not found" });
  }
});

app.post("/api/send-email", (req, res) => {
  const { sport, email, name, consecutiveAbsences } = req.body;
  console.log(`[Email Dispatcher] Sending care email to ${name} <${email}> for consecutive absences: ${consecutiveAbsences}`);
  // In a production environment with SMTP configured, nodemailer or SendGrid would be invoked here.
  res.json({ success: true, message: `Email successfully dispatched to ${email}` });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
