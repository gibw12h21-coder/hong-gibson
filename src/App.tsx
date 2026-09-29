import React, { useState, useEffect } from 'react';
import { Member, EventSession, Registration, NotificationLog, SkillLevel } from './types';
import { Navbar } from './components/Navbar';
import { OverviewTab } from './components/OverviewTab';
import { MembersAttendanceTab } from './components/MembersAttendanceTab';
import { NotificationTab } from './components/NotificationTab';
import { AuthScreen } from './components/AuthScreen';
import { ViewportCenterWatcher } from './components/ViewportCenterWatcher';

export default function App() {
  const [currentSport, setCurrentSport] = useState<'badminton' | 'tennis'>('badminton');
  const [activeTab, setActiveTab] = useState('overview');
  const [showIPhoneFrame, setShowIPhoneFrame] = useState(false);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [session, setSession] = useState<EventSession>({
    id: 'session-2026-w38',
    title: '第38週常廣羽球社友誼賽',
    date: '2026-09-23',
    time: '19:00 - 21:00',
    location: '台北市中山運動中心 4樓羽球場 (第1、2、3場地)',
    deadline: '2026-09-21 23:59',
    status: 'open',
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [departments, setDepartments] = useState<string[]>(() => {
    const saved = localStorage.getItem('lagis_departments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((d: string) => d.replace(/部$/, '課'));
        }
      } catch (e) { /* ignore */ }
    }
    return ['研發課', '業務課', '品保課', '生管課', '管理課', '總經辦', '資管課', '行銷課'];
  });

  const handleAddDepartment = (newDept: string) => {
    const trimmed = newDept.trim();
    if (!trimmed) return;
    if (!departments.includes(trimmed)) {
      const updated = [...departments, trimmed];
      setDepartments(updated);
      localStorage.setItem('lagis_departments', JSON.stringify(updated));
    }
  };
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from server API when sport changes
  const fetchServerData = (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    fetch(`/api/data/${currentSport}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.session && data.members) {
          setSession(data.session);
          setMembers(data.members);
          setRegistrations(data.registrations || []);
          setNotificationLogs(data.notificationLogs || []);
        }
        if (isInitial) setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load sport data:", err);
        if (isInitial) setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchServerData(true);

    // Poll every 4 seconds for real-time multi-user synchronization
    const pollInterval = setInterval(() => {
      fetchServerData(false);
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [currentSport]);

  // Sync changes to server API
  const saveDataToServer = (updatedMembers: Member[], updatedRegs: Registration[], updatedSession: EventSession, updatedLogs: NotificationLog[]) => {
    setIsSaving(true);
    fetch(`/api/data/${currentSport}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: updatedSession,
        members: updatedMembers,
        registrations: updatedRegs,
        notificationLogs: updatedLogs,
      }),
    })
      .then(res => res.json())
      .then(() => {
        setIsSaving(false);
      })
      .catch(err => {
        console.error("Failed to save data to server:", err);
        setIsSaving(false);
      });
  };

  // Update registration handler
  const handleUpdateRegistration = (memberId: string, status: 'attending' | 'absent', reason?: string) => {
    const existingIndex = registrations.findIndex(r => r.memberId === memberId);
    const now = new Date().toLocaleString('zh-TW', { hour12: false });
    let updatedRegs = [...registrations];

    if (existingIndex >= 0) {
      updatedRegs[existingIndex] = {
        ...updatedRegs[existingIndex],
        status,
        excuseReason: reason !== undefined ? reason : updatedRegs[existingIndex].excuseReason,
        updatedAt: now,
      };
    } else {
      const newReg: Registration = {
        id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        sessionId: session.id,
        memberId,
        status,
        excuseReason: reason,
        updatedAt: now,
      };
      updatedRegs.push(newReg);
    }
    setRegistrations(updatedRegs);
    saveDataToServer(members, updatedRegs, session, notificationLogs);
  };

  // Add new member & auto login if registered by self
  const handleAddMember = (newMemberData: Omit<Member, 'id' | 'totalAttendance' | 'consecutiveAbsences'>) => {
    const newMember: Member = {
      ...newMemberData,
      id: `${currentSport === 'badminton' ? 'm' : 't'}-${Date.now()}`,
      totalAttendance: 0,
      consecutiveAbsences: 0,
    };
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    setCurrentUser(newMember);
    saveDataToServer(updatedMembers, registrations, session, notificationLogs);
  };

  // Update member details
  const handleUpdateMember = (updatedMember: Member) => {
    const updatedMembers = members.map(m => m.id === updatedMember.id ? updatedMember : m);
    setMembers(updatedMembers);
    saveDataToServer(updatedMembers, registrations, session, notificationLogs);
    alert('✅ 個人資料更新成功！');
  };

  // Update member skill level
  const handleUpdateMemberSkill = (memberId: string, level: SkillLevel) => {
    const updatedMembers = members.map(m => m.id === memberId ? { ...m, skillLevel: level } : m);
    setMembers(updatedMembers);
    saveDataToServer(updatedMembers, registrations, session, notificationLogs);
  };

  // Reset absence count
  const handleResetAbsence = (memberId: string) => {
    const updatedMembers = members.map(m => m.id === memberId ? { ...m, consecutiveAbsences: 0 } : m);
    setMembers(updatedMembers);
    saveDataToServer(updatedMembers, registrations, session, notificationLogs);
  };

  // Clear all members handler
  const handleClearAllMembers = () => {
    setMembers([]);
    setRegistrations([]);
    saveDataToServer([], [], session, notificationLogs);
    alert('🗑️ 已成功清除所有社員與出缺席資料！');
  };

  // Delete individual member
  const handleDeleteMember = (memberId: string) => {
    const updatedMembers = members.filter(m => m.id !== memberId);
    const updatedRegs = registrations.filter(r => r.memberId !== memberId);
    setMembers(updatedMembers);
    setRegistrations(updatedRegs);
    saveDataToServer(updatedMembers, updatedRegs, session, notificationLogs);
  };

  // Send notification log
  const handleSendNotification = (log: Omit<NotificationLog, 'id'>) => {
    const newLog: NotificationLog = {
      ...log,
      id: `log-${Date.now()}`,
    };
    const updatedLogs = [newLog, ...notificationLogs];
    setNotificationLogs(updatedLogs);
    saveDataToServer(members, registrations, session, updatedLogs);
  };

  // Export CSV function
  const handleExportCsv = () => {
    const regMap = new Map<string, Registration>();
    registrations.forEach(r => regMap.set(r.memberId, r));

    let csvContent = '\uFEFF';
    csvContent += '姓名,部門,實力分級,出席狀態,請假理由,累計出席\n';

    members.forEach(m => {
      const reg = regMap.get(m.id);
      const statusText = reg?.status === 'attending' ? '參加' : reg?.status === 'absent' ? '不參加' : '未登記';
      const reason = reg?.excuseReason ? `"${reg.excuseReason.replace(/"/g, '""')}"` : '""';
      csvContent += `${m.name},${m.department},${m.skillLevel},${statusText},${reason},${m.totalAttendance}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `常廣${currentSport === 'badminton' ? '羽球' : '網球'}社名單_${session.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const attendingCount = registrations.filter(r => r.status === 'attending').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-slate-800 font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-sm text-slate-600">正在載入常廣雲端賽事資料...</p>
        </div>
      </div>
    );
  }

  // Handle admin login
  const handleAdminLogin = () => {
    setIsAdmin(true);
    let adminMember = members.find(m => m.id.toLowerCase() === 'l0814' || m.name.toLowerCase().includes('l0814') || m.id.toUpperCase() === 'L0814');
    if (!adminMember) {
      adminMember = {
        id: 'L0814',
        name: 'L0814 (管理員)',
        department: '管理部',
        skillLevel: 'A-進階',
        consecutiveAbsences: 0,
        totalAttendance: 30,
        email: 'l0814@company.com',
        phone: '0900-000-000'
      };
      const updatedMembers = [...members, adminMember];
      setMembers(updatedMembers);
      saveDataToServer(updatedMembers, registrations, session, notificationLogs);
    }
    setCurrentUser(adminMember);
  };

  const toggleBar = (
    <div className="bg-slate-900 text-slate-100 px-4 py-2.5 flex items-center justify-between text-xs font-bold sticky top-0 z-50 shadow-md">
      <div className="flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-orange-400">常廣社團雲端系統</span>
      </div>
      <button
        onClick={() => setShowIPhoneFrame(!showIPhoneFrame)}
        className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-full transition-colors cursor-pointer flex items-center space-x-1.5 shadow-sm"
      >
        <span>{showIPhoneFrame ? '💻 切換標準網頁檢視' : '📱 切換 iPhone 框預覽'}</span>
      </button>
    </div>
  );

  const phoneWrapper = (content: React.ReactNode) => {
    if (!showIPhoneFrame) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
          {toggleBar}
          <div className="flex-1 flex flex-col">{content}</div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-slate-950 py-6 px-4 flex flex-col items-center justify-center font-sans">
        <div className="w-full max-w-sm mb-3 flex justify-center">
          {toggleBar}
        </div>
        <div className="w-full max-w-[400px] h-[840px] bg-white rounded-[52px] shadow-2xl border-[12px] border-slate-900 overflow-hidden relative ring-8 ring-slate-900/20 flex flex-col">
          {/* iPhone Dynamic Island & Status Bar */}
          <div className="bg-slate-900 text-white text-[11px] px-6 py-2.5 flex items-center justify-between font-mono select-none z-50 flex-shrink-0">
            <span>09:41</span>
            <div className="w-24 h-4 bg-black rounded-full mx-auto flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-800"></div>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px]">
              <span>5G</span>
              <span>🔋</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col bg-[#FAF8F5]">
            {content}
          </div>
          {/* iPhone Home Indicator */}
          <div className="bg-white py-2 flex justify-center flex-shrink-0 border-t border-slate-100">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  };

  // If not logged in and not admin, show AuthScreen
  if (!currentUser && !isAdmin) {
    return phoneWrapper(
      <AuthScreen
        members={members}
        onLogin={(member) => setCurrentUser(member)}
        onRegister={handleAddMember}
        onUpdateMember={handleUpdateMember}
        onAdminLogin={handleAdminLogin}
        currentSport={currentSport}
        setCurrentSport={setCurrentSport}
        departments={departments}
        onAddDepartment={handleAddDepartment}
      />
    );
  }

  return phoneWrapper(
    <div className="min-h-full bg-[#FAF8F5] text-slate-900 flex flex-col font-sans selection:bg-orange-600 selection:text-white">
      <ViewportCenterWatcher />
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        attendingCount={attendingCount}
        currentSport={currentSport}
        setCurrentSport={setCurrentSport}
        isSaving={isSaving}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setIsAdmin(false);
        }}
        isAdmin={isAdmin}
        onRefresh={() => fetchServerData(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            session={session}
            members={members}
            registrations={registrations}
            currentUser={currentUser}
            isAdmin={isAdmin}
            setActiveTab={setActiveTab}
            onQuickToggle={handleUpdateRegistration}
          />
        )}

        {activeTab === 'members-attendance' && (
          <MembersAttendanceTab
            session={session}
            members={members}
            registrations={registrations}
            currentUser={currentUser}
            isAdmin={isAdmin}
            departments={departments}
            onAddDepartment={handleAddDepartment}
            onUpdateRegistration={handleUpdateRegistration}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onUpdateMemberSkill={handleUpdateMemberSkill}
            onResetAbsence={handleResetAbsence}
            onClearAllMembers={handleClearAllMembers}
            onExportCsv={handleExportCsv}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationTab
            currentUser={currentUser}
            members={members}
            onUpdateMember={handleUpdateMember}
            isAdmin={isAdmin}
            departments={departments}
            onAddDepartment={handleAddDepartment}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#FAF8F5] border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        <p>© 2026 LAGIS 常廣股份有限公司{currentSport === 'badminton' ? '羽球社' : '網球社'} ｜ 雲端共用同步系統</p>
      </footer>
    </div>
  );
}
