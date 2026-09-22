import React, { useState } from 'react';
import { Member, EventSession, Registration, SkillLevel } from '../types';
import { Trash2, CheckCircle2, Search } from 'lucide-react';

interface MembersAttendanceTabProps {
  session: EventSession;
  members: Member[];
  registrations: Registration[];
  currentUser?: Member | null;
  isAdmin?: boolean;
  onUpdateRegistration: (memberId: string, status: 'attending' | 'absent', reason?: string) => void;
  onAddMember: (member: Omit<Member, 'id' | 'totalAttendance' | 'consecutiveAbsences'>) => void;
  onUpdateMemberSkill: (memberId: string, level: SkillLevel) => void;
  onResetAbsence: (memberId: string) => void;
  onClearAllMembers: () => void;
  onExportCsv: () => void;
  onDeleteMember: (memberId: string) => void;
}

export const MembersAttendanceTab: React.FC<MembersAttendanceTabProps> = ({
  session,
  members,
  registrations,
  currentUser,
  isAdmin = false,
  onUpdateRegistration,
  onAddMember,
  onUpdateMemberSkill,
  onClearAllMembers,
  onExportCsv,
  onDeleteMember,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'absent' | 'unregistered' | 'warning'>('all');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSelfRegisterModalOpen, setIsSelfRegisterModalOpen] = useState(false);
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [careModalOpen, setCareModalOpen] = useState(false);
  const [careMember, setCareMember] = useState<Member | null>(null);
  const [sendSuccessToast, setSendSuccessToast] = useState(false);
  const [selectedMemberForAbsent, setSelectedMemberForAbsent] = useState<Member | null>(null);
  const [tempReason, setTempReason] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [departments, setDepartments] = useState<string[]>(['研發部', '業務部', '品保部', '生管部', '管理部', '總經辦', '資管部', '行銷部']);
  const [customNewDeptInput, setCustomNewDeptInput] = useState('');
  const [customSelfDeptInput, setCustomSelfDeptInput] = useState('');

  const handleAddCustomNewDept = () => {
    const trimmed = customNewDeptInput.trim();
    if (!trimmed) return;
    if (!departments.includes(trimmed)) {
      setDepartments([...departments, trimmed]);
    }
    setNewDept(trimmed);
    setCustomNewDeptInput('');
  };

  const handleAddCustomSelfDept = () => {
    const trimmed = customSelfDeptInput.trim();
    if (!trimmed) return;
    if (!departments.includes(trimmed)) {
      setDepartments([...departments, trimmed]);
    }
    setSelfDept(trimmed);
    setCustomSelfDeptInput('');
  };

  // Add member form state
  const [newName, setNewName] = useState('');
  const [newDept, setNewDept] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSkill, setNewSkill] = useState<SkillLevel>('B-中階');

  // Self register form state (pre-filled if currentUser exists)
  const [selfName, setSelfName] = useState(currentUser?.name || '');
  const [selfDept, setSelfDept] = useState(currentUser?.department || '');
  const [selfEmail, setSelfEmail] = useState(currentUser?.email || '');
  const [selfLineId, setSelfLineId] = useState(currentUser?.phone || '');
  const [selfSkill, setSelfSkill] = useState<SkillLevel>(currentUser?.skillLevel || 'B-中階');

  // Map registrations
  const regMap = new Map<string, Registration>();
  registrations.forEach(r => regMap.set(r.memberId, r));

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const reg = regMap.get(m.id);
    const status = reg ? reg.status : 'unregistered';

    if (filterStatus === 'attending') return matchesSearch && status === 'attending';
    if (filterStatus === 'absent') return matchesSearch && status === 'absent';
    if (filterStatus === 'unregistered') return matchesSearch && status === 'unregistered';
    if (filterStatus === 'warning') return matchesSearch && m.consecutiveAbsences >= 5;
    return matchesSearch;
  });

  const attendingCount = members.filter(m => regMap.get(m.id)?.status === 'attending').length;
  const absentCount = members.filter(m => regMap.get(m.id)?.status === 'absent').length;

  const handleStatusChange = (member: Member, newStatus: 'attending' | 'absent') => {
    if (newStatus === 'absent') {
      setSelectedMemberForAbsent(member);
      const existingReg = regMap.get(member.id);
      setTempReason(existingReg?.excuseReason || '');
      setReasonModalOpen(true);
    } else {
      onUpdateRegistration(member.id, 'attending', undefined);
    }
  };

  const handleSaveReason = () => {
    if (!selectedMemberForAbsent) return;
    if (!tempReason.trim()) {
      alert('請填寫請假理由！');
      return;
    }
    onUpdateRegistration(selectedMemberForAbsent.id, 'absent', tempReason.trim());
    setReasonModalOpen(false);
    setSelectedMemberForAbsent(null);
    setTempReason('');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('請填寫姓名！');
      return;
    }
    onAddMember({
      name: newName.trim(),
      department: newDept.trim() || '常廣同仁',
      email: newEmail.trim() || `${newName.toLowerCase()}@lagis.com.tw`,
      phone: newPhone.trim() || '未填寫LINE',
      skillLevel: newSkill,
    });
    setNewName('');
    setNewDept('');
    setNewEmail('');
    setNewPhone('');
    setIsAddModalOpen(false);
  };

  const handleSelfRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfName.trim() || !selfEmail.trim()) {
      alert('請填寫姓名與 Gmail信箱！');
      return;
    }
    onAddMember({
      name: selfName.trim(),
      department: selfDept.trim() || '常廣同仁',
      email: selfEmail.trim(),
      phone: selfLineId.trim() || '未填寫LINE',
      skillLevel: selfSkill,
    });
    setIsSelfRegisterModalOpen(false);
    alert('🎉 成功！您的登入社員與部門資料已同步儲存至雲端，隨時可參與球敘！');
  };

  const handleOpenSelfRegister = () => {
    if (currentUser) {
      setSelfName(currentUser.name);
      setSelfDept(currentUser.department);
      setSelfEmail(currentUser.email);
      setSelfLineId(currentUser.phone);
      setSelfSkill(currentUser.skillLevel);
    }
    setIsSelfRegisterModalOpen(true);
  };

  const handleOpenAddModal = () => {
    if (currentUser) {
      setNewName(currentUser.name);
      setNewDept(currentUser.department);
      setNewEmail(currentUser.email);
      setNewPhone(currentUser.phone);
      setNewSkill(currentUser.skillLevel);
    }
    setIsAddModalOpen(true);
  };

  const handleSendCareEmail = (member: Member) => {
    setCareMember(member);
    setSendSuccessToast(false);
    setCareModalOpen(true);
  };

  const handleDispatchEmail = async () => {
    if (!careMember) return;
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: session.id.includes('tennis') ? 'tennis' : 'badminton',
          email: careMember.email,
          name: careMember.name,
          consecutiveAbsences: careMember.consecutiveAbsences,
        }),
      });
    } catch (e) {
      console.error(e);
    }

    setSendSuccessToast(true);

    const subject = `【LAGIS 社團關懷】近期球敘缺席關懷與揮拍邀請 🏸`;
    const body = `親愛的 ${careMember.name} 同仁您好：\n\n系統注意到您近期已連續 ${careMember.consecutiveAbsences} 次未參與常廣社團球敘（累計出席 ${careMember.totalAttendance} 場）。常廣羽球/網球社非常關心您的身心健康與工作狀況！\n\n生活與工作忙碌之餘，歡迎隨時回來與大家一同揮拍流汗、放鬆身心。\n\n如需請假或有任何建議，歡迎隨時聯繫社團幹部。\n\n祝 平安順心\nLAGIS 社團幹部團隊 敬上`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(careMember.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setTimeout(() => {
      window.open(gmailUrl, '_blank');
      setSendSuccessToast(false);
      setCareModalOpen(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16 pt-4 animate-fade-in font-sans">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">Members & Attendance ｜ 社員名冊與出缺席</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            社員出缺席登記管理
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            本週統計截止：{session.deadline} ｜ 已報名：{attendingCount} 人 / 請假：{absentCount} 人
            {currentUser && <span className="ml-2 text-orange-600 font-bold">（當前登入：{currentUser.name} / {currentUser.department || '常廣同仁'}）</span>}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleOpenSelfRegister}
            className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            👤 自動帶入我的登入資料報名
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            + 手動新增社員
          </button>
          <button
            type="button"
            onClick={onExportCsv}
            className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            匯出 CSV
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setClearModalOpen(true);
              }}
              className="text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              🗑️ 一鍵清除所有社員
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜尋姓名、部門、Gmail 或 LINE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === 'all' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            全部 ({members.length})
          </button>
          <button
            onClick={() => setFilterStatus('attending')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === 'attending' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            參加 ({attendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('absent')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === 'absent' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            請假 ({absentCount})
          </button>
          <button
            onClick={() => setFilterStatus('warning')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${filterStatus === 'warning' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            未到警示
          </button>
        </div>
      </div>

      {/* Members List (Responsive Card List Style) */}
      <div className="space-y-3">
        {filteredMembers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 italic bg-white rounded-2xl border border-slate-200">
            沒有找到符合條件的社員資料
          </div>
        ) : (
          filteredMembers.map((member) => {
            const reg = regMap.get(member.id);
            const status = reg ? reg.status : 'unregistered';
            const isCritical = member.consecutiveAbsences >= 5;

            return (
              <div key={member.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="font-extrabold text-slate-900 flex items-center space-x-2 text-base">
                      <span>{member.name}</span>
                      {currentUser?.id === member.id && (
                        <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded">您的帳號</span>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="text-xs text-slate-400 mt-0.5">{member.email} ｜ {member.department} ｜ 工號：{member.id}</div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500 font-medium">球技級別：</span>
                    <select
                      value={member.skillLevel}
                      onChange={(e) => onUpdateMemberSkill(member.id, e.target.value as SkillLevel)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="A-進階">A-進階</option>
                      <option value="B-中階">B-中階</option>
                      <option value="C-初階">C-初階</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  {/* Attendance Buttons */}
                  <div className="flex items-center space-x-2 flex-1">
                    <button
                      onClick={() => handleStatusChange(member, 'attending')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-xs ${
                        status === 'attending'
                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-transparent'
                      }`}
                    >
                      <span className="whitespace-nowrap">🏸 參加球敘</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(member, 'absent')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-1 shadow-xs ${
                        status === 'absent'
                          ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-600/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700 border border-transparent'
                      }`}
                    >
                      <span className="whitespace-nowrap">🌴 請假缺席</span>
                    </button>
                  </div>

                  {/* Admin stats & actions */}
                  {isAdmin && (
                    <div className="flex flex-col gap-3 text-xs text-slate-600 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <span>累計：<strong className="text-slate-900">{member.totalAttendance}場</strong></span>
                          <span>連續未到：<strong className={`font-bold ${isCritical ? 'text-rose-600' : 'text-slate-900'}`}>{member.consecutiveAbsences}次</strong></span>
                        </div>
                        {isCritical && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 whitespace-nowrap">
                            ⚠️ 達5場警示
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => handleSendCareEmail(member)}
                          className={`text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs cursor-pointer w-full text-center ${
                            isCritical
                              ? 'bg-orange-600 hover:bg-orange-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          ✉️ 發送關懷信
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMemberToDelete(member);
                            setDeleteModalOpen(true);
                          }}
                          className="text-xs font-bold px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer flex items-center justify-center space-x-1.5 w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>刪除社員紀錄</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {status === 'absent' && reg?.excuseReason && (
                  <div className="text-xs text-rose-600 bg-rose-50/60 p-2 rounded-lg border border-rose-100">
                    請假理由：{reg.excuseReason}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {reasonModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">填寫請假理由 ({selectedMemberForAbsent?.name})</h3>
            <textarea
              rows={3}
              placeholder="請輸入請假原因..."
              value={tempReason}
              onChange={(e) => setTempReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => setReasonModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveReason}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                確認儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">手動新增社員</h3>
              {isAdmin && (
                <span className="text-[10px] font-bold bg-[#274A56] text-[#F4F1E7] px-2.5 py-1 rounded-full">
                  🛡️ 管理員模式 (支援自訂部門)
                </span>
              )}
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">姓名 *</label>
                <input
                  type="text"
                  required
                  placeholder="例：王小明"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">部門</label>
                <input
                  type="text"
                  placeholder="例：研發部 或 自訂部門名稱"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
                <div className="flex flex-wrap gap-1.5 items-center mt-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setNewDept(dept)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        newDept === dept ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                  <div className="flex items-center gap-1 mt-1 sm:mt-0">
                    <input
                      type="text"
                      placeholder="自訂新部門..."
                      value={customNewDeptInput}
                      onChange={(e) => setCustomNewDeptInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomNewDept(); } }}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] w-28 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomNewDept}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-black w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer shadow-2xs"
                      title="新增自訂部門"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSelfRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">自動帶入登入資料報名</h3>
            <p className="text-xs text-slate-500">已自動載入您的登入身分與部門，點擊確認即可快速完成名冊與報名！</p>
            <form onSubmit={handleSelfRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">您的姓名 *</label>
                <input
                  type="text"
                  required
                  value={selfName}
                  onChange={(e) => setSelfName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">所屬部門</label>
                <input
                  type="text"
                  value={selfDept}
                  onChange={(e) => setSelfDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  placeholder="例：研發部 或 自訂部門名稱"
                />
                <div className="flex flex-wrap gap-1.5 items-center mt-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setSelfDept(dept)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        selfDept === dept ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                  <div className="flex items-center gap-1 mt-1 sm:mt-0">
                    <input
                      type="text"
                      placeholder="自訂新部門..."
                      value={customSelfDeptInput}
                      onChange={(e) => setCustomSelfDeptInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSelfDept(); } }}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] w-28 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomSelfDept}
                      className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-black w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer shadow-2xs"
                      title="新增自訂部門"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">電子郵件 Email *</label>
                <input
                  type="email"
                  required
                  value={selfEmail}
                  onChange={(e) => setSelfEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                />
              </div>
              <div className="flex space-x-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsSelfRegisterModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  確認送出並報名
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {clearModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">確認一鍵清除所有社員？</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              此操作將會清空目前該社團的所有社員名冊與出缺席資料。確定要繼續嗎？
            </p>
            <div className="flex space-x-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setClearModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearAllMembers();
                  setClearModalOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                確定清除全部
              </button>
            </div>
          </div>
        </div>
      )}

      {careModalOpen && careMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>✉️</span> 缺席關懷通知與郵件預覽
                </h3>
                <p className="text-xs text-slate-500">社員：{careMember.name} ｜ 連續未到：{careMember.consecutiveAbsences} 次</p>
              </div>
              <button
                type="button"
                onClick={() => setCareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-500">收件人 (Gmail)：</span>
                <span className="text-slate-900 font-mono ml-2">{careMember.email}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500">LINE / 電話：</span>
                <span className="text-slate-900 font-mono ml-2">{careMember.phone}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-1">信件主旨：</span>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 font-bold">
                  【LAGIS 社團關懷】近期球敘缺席關懷與揮拍邀請 🏸
                </div>
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-1">信件與 LINE 訊息內容：</span>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                  {`親愛的 ${careMember.name} 同仁您好：\n\n系統注意到您近期已連續 ${careMember.consecutiveAbsences} 次未參與常廣社團球敘（累計出席 ${careMember.totalAttendance} 場）。常廣羽球/網球社非常關心您的身心健康與工作狀況！\n\n生活與工作忙碌之餘，歡迎隨時回來與大家一同揮拍流汗、放鬆身心。\n\n如需請假或有任何建議，歡迎隨時聯繫社團幹部。\n\n祝 平安順心\nLAGIS 社團幹部團隊 敬上`}
                </div>
              </div>
            </div>

            {sendSuccessToast && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <span>🎉</span> 成功！已透過 Gmail 伺服器與 LINE Bot 成功發送關懷提醒通知！
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(careMember.email)}&su=${encodeURIComponent('【LAGIS 社團關懷】近期球敘缺席關懷與揮拍邀請 🏸')}&body=${encodeURIComponent(`親愛的 ${careMember.name} 同仁您好：\n\n系統注意到您近期已連續 ${careMember.consecutiveAbsences} 次未參與常廣社團球敘（累計出席 ${careMember.totalAttendance} 場）。常廣羽球/網球社非常關心您的身心健康與工作狀況！\n\n生活與工作忙碌之餘，歡迎隨時回來與大家一同揮拍流汗、放鬆身心。\n\n如需請假或有任何建議，歡迎隨時聯繫社團幹部。\n\n祝 平安順心\nLAGIS 社團幹部團隊 敬上`)}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 underline flex items-center gap-1"
              >
                <span>🌐</span> 直接開啟 Gmail 網頁撰寫
              </a>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setCareModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={handleDispatchEmail}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>🚀</span> 立即發送 Gmail 與 LINE 通知
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && memberToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 shadow-xl text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">確認刪除社員</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              確定要從名冊中刪除社員 <strong className="text-rose-600">「{memberToDelete.name}」</strong> 嗎？此操作將同時移除該社員的所有報名與出勤紀錄。
            </p>
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setMemberToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteMember(memberToDelete.id);
                  setDeleteModalOpen(false);
                  setMemberToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
