export type SkillLevel = 'A-進階' | 'B-中階' | 'C-初階';

export interface Member {
  id: string;
  name: string;
  department: string;
  skillLevel: SkillLevel;
  consecutiveAbsences: number; // 連續未到次數
  totalAttendance: number; // 累計出席次數
  email: string;
  phone: string;
}

export interface EventSession {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD (通常是周三羽球日)
  time: string; // 19:00 - 21:00
  location: string;
  deadline: string; // 週一統計截止時間
  status: 'open' | 'closed' | 'completed';
}

export interface Registration {
  id: string;
  sessionId: string;
  memberId: string;
  status: 'attending' | 'absent';
  excuseReason?: string; // 不參加時必須提供的理由
  updatedAt: string;
}

export interface CourtGroup {
  id: string;
  sessionId: string;
  courtNumber: number;
  courtName: string;
  playerIds: string[];
  targetLevel: string;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  recipientCount: number;
  type: 'reminder' | 'warning' | 'stats';
}
