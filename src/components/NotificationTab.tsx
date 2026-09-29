import React, { useState } from 'react';
import { Member, SkillLevel } from '../types';
import { UserCheck, CheckCircle2, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

interface NotificationTabProps {
  currentUser: Member | null;
  members: Member[];
  onUpdateMember: (member: Member) => void;
  isAdmin: boolean;
  departments: string[];
  onAddDepartment: (dept: string) => void;
}

export const NotificationTab: React.FC<NotificationTabProps> = ({
  currentUser,
  members,
  onUpdateMember,
  isAdmin,
  departments,
  onAddDepartment,
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentUser ? currentUser.id : (members[0]?.id || ''));
  const targetMember = members.find(m => m.id === selectedMemberId) || currentUser || members[0];

  const [editName, setEditName] = useState(targetMember?.name || '');
  const [editDept, setEditDept] = useState(targetMember?.department || '');
  const [editEmail, setEditEmail] = useState(targetMember?.email || '');
  const [editPhone, setEditPhone] = useState(targetMember?.phone || '');
  const [editSkill, setEditSkill] = useState<SkillLevel>(targetMember?.skillLevel || 'B-中階');
  const [customDeptInput, setCustomDeptInput] = useState('');

  const handleAddCustomDept = () => {
    const trimmed = customDeptInput.trim();
    if (!trimmed) return;
    onAddDepartment(trimmed);
    setEditDept(trimmed);
    setCustomDeptInput('');
  };
  const [successMsg, setSuccessMsg] = useState('');

  React.useEffect(() => {
    if (targetMember) {
      setEditName(targetMember.name);
      setEditDept(targetMember.department);
      setEditEmail(targetMember.email);
      setEditPhone(targetMember.phone);
      setEditSkill(targetMember.skillLevel);
    }
  }, [selectedMemberId, targetMember]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMember) return;

    const updated: Member = {
      ...targetMember,
      name: editName.trim(),
      department: editDept.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      skillLevel: editSkill,
    };

    onUpdateMember(updated);
    setSuccessMsg('✅ 個人與註冊資料已成功更新！');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 pt-4 animate-fade-in font-sans">
      {/* Editorial Header */}
      <div className="bg-white rounded-[16px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(23,38,43,0.04)] border border-[#DAD4C2] space-y-2">
        <div className="text-xs font-bold text-[#E2794F] uppercase tracking-widest font-mono">Profile Maintenance ｜ 個人資料維護</div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#17262B] tracking-tight">
          個人資料與註冊內容維護
        </h2>
        <p className="text-[#4B5D62] text-sm leading-relaxed">
          在此檢視與編輯您的個人姓名、所屬部門、聯絡信箱與球技分級設定。
        </p>
      </div>

      {successMsg && (
        <div className="bg-[#E4F1E9] border border-[#3F8F62]/30 text-[#3F8F62] p-4 rounded-[12px] flex items-center space-x-3 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold text-xs">{successMsg}</span>
        </div>
      )}

      {isAdmin && (
        <div className="bg-[#274A56] text-[#F4F1E7] p-5 rounded-[16px] flex flex-col gap-3 shadow-sm border border-[#33606C]">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#F2C466] shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-bold text-xs uppercase tracking-wider block text-[#F2C466]">管理員完整權限模式</span>
              <span className="text-xs text-[#F4F1E7]/80 mt-0.5 block">您可切換並協助任意社員編輯或更新其註冊資料。</span>
            </div>
          </div>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="bg-[#33606C] border border-[#DAD4C2]/30 text-white text-xs font-bold rounded-[12px] px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E2794F] w-full"
          >
            {members.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.department} - {m.id})
              </option>
            ))}
          </select>

          {/* Audit Log Warning Notice */}
          <div className="pt-2 border-t border-white/10 flex items-center space-x-2 text-[11px] text-[#F2C466]">
            <FileText className="w-4 h-4 shrink-0" />
            <span>⚠️ 系統稽核提示：所有管理員針對社員資料的修改操作均會寫入系統稽核日誌 (Audit Log) 以供查核。</span>
          </div>
        </div>
      )}

      {targetMember ? (
        <div className="bg-white p-8 rounded-[16px] border border-[#DAD4C2] shadow-[0_10px_30px_rgba(23,38,43,0.04)] space-y-6">
          <div className="flex items-center space-x-4 pb-6 border-b border-[#DAD4C2]">
            <div className="w-14 h-14 rounded-[12px] bg-[#274A56] text-[#F4F1E7] flex items-center justify-center font-black text-xl font-mono shadow-2xs">
              {targetMember.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-black text-[#17262B] flex items-center gap-2">
                <span>{targetMember.name}</span>
                <span className="text-xs font-bold bg-[#F4F1E7] text-[#4B5D62] px-3 py-1 rounded-[100px] border border-[#DAD4C2] font-mono">工號：{targetMember.id}</span>
              </h3>
              <p className="text-xs text-[#4B5D62] mt-1 font-mono">
                累計出席：<strong className="text-[#17262B]">{targetMember.totalAttendance}</strong> 場 ｜ 連續未到：<strong className="text-[#17262B]">{targetMember.consecutiveAbsences}</strong> 次
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#17262B] uppercase tracking-wider mb-2">真實姓名 *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-4 py-3 text-xs font-medium text-[#17262B] focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17262B] uppercase tracking-wider mb-2">所屬部門 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如：研發課 或 自訂部門名稱"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-4 py-3 text-xs font-medium text-[#17262B] focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
                />
                <div className="flex flex-wrap gap-1.5 items-center mt-2.5">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setEditDept(dept)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-[8px] border transition-all cursor-pointer ${
                        editDept === dept
                          ? 'bg-[#274A56] text-[#F4F1E7] border-[#274A56]'
                          : 'bg-[#F4F1E7] text-[#4B5D62] border-[#DAD4C2] hover:bg-[#274A56] hover:text-white'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                  <div className="flex items-center gap-1 mt-1 sm:mt-0">
                    <input
                      type="text"
                      placeholder="自訂新部門..."
                      value={customDeptInput}
                      onChange={(e) => setCustomDeptInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomDept(); } }}
                      className="bg-white border border-[#DAD4C2] rounded-lg px-2 py-1.5 text-[11px] w-28 focus:outline-none focus:ring-1 focus:ring-[#E2794F]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomDept}
                      className="bg-[#E2794F] hover:bg-[#C36A3E] text-white text-xs font-black w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer shadow-2xs"
                      title="新增自訂部門"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#17262B] uppercase tracking-wider mb-2">電子郵件 Email *</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-4 py-3 text-xs font-medium text-[#17262B] focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17262B] uppercase tracking-wider mb-2">聯絡電話 / 分機 *</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-4 py-3 text-xs font-medium text-[#17262B] focus:outline-none focus:ring-2 focus:ring-[#E2794F] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17262B] uppercase tracking-wider mb-2">球技實力分級設定</label>
              <select
                value={editSkill}
                onChange={(e) => setEditSkill(e.target.value as SkillLevel)}
                className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-4 py-3 text-xs font-bold text-[#17262B] focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
              >
                <option value="A-進階">A-進階 (校隊/高手/雙打極佳)</option>
                <option value="B-中階">B-中階 (常規打球/雙打順暢)</option>
                <option value="C-初階">C-初階 (新手入門/快樂流汗)</option>
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#E2794F] hover:bg-[#C36A3E] text-white font-bold px-8 py-3.5 rounded-[12px] shadow-sm transition-all cursor-pointer"
              >
                儲存個人資料修改
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};
