import { Member, EventSession, Registration, NotificationLog } from '../types';

export const initialMembers: Member[] = [
  { id: 'm1', name: 'LIAO', department: '', skillLevel: 'A-進階', consecutiveAbsences: 0, totalAttendance: 18, email: 'liao@company.com', phone: '0912-345-678' },
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
];

export const currentSession: EventSession = {
  id: 'session-2026-w38',
  title: '第38週公司羽球社友誼賽',
  date: '2026-09-23', // 本週三
  time: '19:00 - 21:00',
  location: '台北市中山運動中心 4樓羽球場 (第1、2、3場地)',
  deadline: '2026-09-21 23:59', // 本週一 23:59 截止統計
  status: 'open',
};

export const initialRegistrations: Registration[] = [
  { id: 'r1', sessionId: 'session-2026-w38', memberId: 'm1', status: 'attending', updatedAt: '2026-09-19 10:00' },
  { id: 'r2', sessionId: 'session-2026-w38', memberId: 'm2', status: 'attending', updatedAt: '2026-09-19 11:30' },
  { id: 'r3', sessionId: 'session-2026-w38', memberId: 'm3', status: 'absent', excuseReason: '近期專案趕工，周三晚上需要留守加班', updatedAt: '2026-09-20 09:15' },
  { id: 'r4', sessionId: 'session-2026-w38', memberId: 'm4', status: 'attending', updatedAt: '2026-09-19 14:20' },
  { id: 'r5', sessionId: 'session-2026-w38', memberId: 'm5', status: 'absent', excuseReason: '舊傷復發（膝蓋不適），需休養復健', updatedAt: '2026-09-20 16:40' },
  { id: 'r6', sessionId: 'session-2026-w38', memberId: 'm6', status: 'attending', updatedAt: '2026-09-19 18:10' },
  { id: 'r7', sessionId: 'session-2026-w38', memberId: 'm7', status: 'absent', excuseReason: '因公出差至高雄分公司開會', updatedAt: '2026-09-20 12:00' },
  { id: 'r8', sessionId: 'session-2026-w38', memberId: 'm8', status: 'attending', updatedAt: '2026-09-19 09:00' },
  { id: 'r9', sessionId: 'session-2026-w38', memberId: 'm9', status: 'attending', updatedAt: '2026-09-19 15:45' },
  { id: 'r10', sessionId: 'session-2026-w38', memberId: 'm10', status: 'absent', excuseReason: '家庭聚餐與個人私事無法出席', updatedAt: '2026-09-20 20:10' },
  { id: 'r11', sessionId: 'session-2026-w38', memberId: 'm11', status: 'attending', updatedAt: '2026-09-19 13:00' },
  { id: 'r12', sessionId: 'session-2026-w38', memberId: 'm12', status: 'attending', updatedAt: '2026-09-19 08:30' },
];

export const initialNotificationLogs: NotificationLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-15 09:00',
    title: '【第37週】羽球活動賽後統計與感謝通知',
    content: '感謝各位球友熱情參與第37週羽球賽，本週出席人數共 10 人，打得十分盡興！',
    recipientCount: 12,
    type: 'stats',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-20 10:00',
    title: '⚠️ 長期未出席關懷提醒',
    content: '系統偵測到您已連續多次未參與羽球社活動，若身體不適或時間無法配合請告知社長。',
    recipientCount: 3,
    type: 'warning',
  },
];
