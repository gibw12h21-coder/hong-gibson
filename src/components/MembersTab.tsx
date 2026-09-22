import React, { useState } from 'react';
import { Member, SkillLevel } from '../types';
import { Users, UserPlus, AlertTriangle, ShieldAlert, Award, Mail, Phone, Search, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';

interface MembersTabProps {
  members: Member[];
  onAddMember: (member: Omit<Member, 'id' | 'totalAttendance' | 'consecutiveAbsences'>) => void;
  onUpdateMemberSkill: (memberId: string, level: SkillLevel) => void;
  onResetAbsence: (memberId: string) => void;
  onClearAllMembers?: () => void;
}

export const MembersTab: React.FC<MembersTabProps> = ({
  members,
  onAddMember,
  onUpdateMemberSkill,
  onResetAbsence,
  onClearAllMembers,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWarning, setFilterWarning] = useState<'all' | 'warning' | 'critical'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearConfirmText, setClearConfirmText] = useState('');

  // New member form state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('B-中階');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departments, setDepartments] = useState<string[]>(['研發部', '業務部', '品保部', '生管部', '管理部', '總經辦', '資管部', '行銷部']);
  const [customDeptInput, setCustomDeptInput] = useState('');

  const handleAddCustomDept = () => {
    const trimmed = customDeptInput.trim();
    if (!trimmed) return;
    if (!departments.includes(trimmed)) {
      setDepartments([...departments, trimmed]);
    }
    setDepartment(trimmed);
    setCustomDeptInput('');
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.department.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterWarning === 'warning') return matchesSearch && m.consecutiveAbsences >= 3 && m.consecutiveAbsences < 5;
    if (filterWarning === 'critical') return matchesSearch && m.consecutiveAbsences >= 5;
    return matchesSearch;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !department.trim()) {
      alert('請填寫完整球友姓名與部門！');
      return;
    }
    onAddMember({
      name: name.trim(),
      department: department.trim(),
      skillLevel,
      email: email.trim() || `${name.toLowerCase()}@company.com`,
      phone: phone.trim() || '0900-000-000',
    });
    setName('');
    setDepartment('');
    setEmail('');
    setPhone('');
    setIsAddModalOpen(false);
  };

  const warningCount = members.filter(m => m.consecutiveAbsences >= 3 && m.consecutiveAbsences < 5).length;
  const criticalCount = members.filter(m => m.consecutiveAbsences >= 5).length;

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-[16px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(23,38,43,0.04)] border border-[#DAD4C2] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#274A56] text-[#F4F1E7] text-xs font-bold px-3 py-1 rounded-[100px]">
              球友名冊與出勤管理
            </span>
            <span className="text-xs bg-[#F4F1E7] text-[#17262B] px-3 py-1 rounded-[100px] font-bold border border-[#DAD4C2] font-mono">
              總社員：{members.length} 人
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#17262B]">
            社員出勤與連續未到追蹤
          </h2>
          <p className="text-[#4B5D62] text-sm leading-relaxed">
            系統自動追蹤每位球友的連續未到次數。連續 3-4 次未到會給予警示，達 5 次以上會強烈提醒社長關注。
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto bg-[#E2794F] hover:bg-[#C36A3E] text-white font-bold px-6 py-3.5 rounded-[12px] shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>新增社員</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-[16px] p-6 shadow-[0_10px_30px_rgba(23,38,43,0.04)] border border-[#DAD4C2] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex space-x-2 w-full md:w-auto overflow-x-auto pb-1">
            <button
              onClick={() => setFilterWarning('all')}
              className={`px-4 py-2 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                filterWarning === 'all'
                  ? 'bg-[#274A56] text-[#F4F1E7]'
                  : 'bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#DAD4C2]/50'
              }`}
            >
              全部社員 ({members.length})
            </button>
            <button
              onClick={() => setFilterWarning('warning')}
              className={`px-4 py-2 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                filterWarning === 'warning'
                  ? 'bg-[#274A56] text-[#F4F1E7]'
                  : 'bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#DAD4C2]/50'
              }`}
            >
              接近5次警示 ({warningCount})
            </button>
            <button
              onClick={() => setFilterWarning('critical')}
              className={`px-4 py-2 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                filterWarning === 'critical'
                  ? 'bg-[#274A56] text-[#F4F1E7]'
                  : 'bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#DAD4C2]/50'
              }`}
            >
              達5次以上限制 ({criticalCount})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5D62]" />
            <input
              type="text"
              placeholder="搜尋姓名或部門..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
            />
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DAD4C2] text-xs font-bold uppercase tracking-wider text-[#4B5D62] bg-[#F4F1E7]">
                <th className="py-3 px-4 rounded-l-[12px]">姓名與部門</th>
                <th className="py-3 px-4">實力分級</th>
                <th className="py-3 px-4">累計出席</th>
                <th className="py-3 px-4">連續未到</th>
                <th className="py-3 px-4">聯絡資訊</th>
                <th className="py-3 px-4 rounded-r-[12px] text-right">管理操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DAD4C2]/60 text-xs">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-[#4B5D62] font-medium">
                    沒有找到符合條件的社員紀錄
                  </td>
                </tr>
              ) : (
                filteredMembers.map(member => {
                  const isWarning = member.consecutiveAbsences >= 3 && member.consecutiveAbsences < 5;
                  const isCritical = member.consecutiveAbsences >= 5;

                  return (
                    <tr key={member.id} className="hover:bg-[#F4F1E7]/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-[12px] bg-[#274A56] text-[#F4F1E7] font-black flex items-center justify-center shadow-2xs font-mono">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-[#17262B] block">{member.name}</span>
                            <span className="text-[11px] text-[#4B5D62] font-mono">{member.department}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={member.skillLevel}
                          onChange={e => onUpdateMemberSkill(member.id, e.target.value as SkillLevel)}
                          className="bg-[#F4F1E7] border border-[#DAD4C2] rounded-[10px] px-2.5 py-1.5 text-xs font-bold text-[#17262B] focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
                        >
                          <option value="A-進階">A-進階</option>
                          <option value="B-中階">B-中階</option>
                          <option value="C-初階">C-初階</option>
                        </select>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-base text-[#17262B]">
                          {member.totalAttendance} <span className="text-xs font-normal text-[#4B5D62]">場</span>
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {isCritical ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-[100px] text-[11px] font-bold bg-[#FBE8E6] text-[#C25A5A] border border-[#C25A5A]/30">
                            <ShieldAlert className="w-3.5 h-3.5 mr-1" /> 連續 {member.consecutiveAbsences} 場未到 (危險)
                          </span>
                        ) : isWarning ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-[100px] text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> 連續 {member.consecutiveAbsences} 場未到
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-[100px] text-[11px] font-bold bg-[#E4F1E9] text-[#3F8F62]">
                            正常 ({member.consecutiveAbsences} 場)
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="space-y-0.5 text-[11px] text-[#4B5D62]">
                          <div className="flex items-center"><Mail className="w-3 h-3 mr-1 text-[#274A56]" /> {member.email}</div>
                          <div className="flex items-center font-mono"><Phone className="w-3 h-3 mr-1 text-[#274A56]" /> {member.phone}</div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        {member.consecutiveAbsences > 0 && (
                          <button
                            onClick={() => onResetAbsence(member.id)}
                            className="bg-[#F4F1E7] hover:bg-[#DAD4C2] text-[#17262B] font-bold px-3 py-1.5 rounded-[10px] text-xs transition-all cursor-pointer border border-[#DAD4C2]"
                            title="手動歸零連續未到次數"
                          >
                            重置未到
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Alert Section with Clear All Button */}
      {onClearAllMembers && (
        <div className="bg-[#FBE8E6] rounded-[16px] p-6 border border-[#C25A5A]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#C25A5A] text-white rounded-[12px] flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#C25A5A]">危險操作區：一鍵清除全部社員與名冊記錄</h4>
              <p className="text-xs text-[#4B5D62] mt-0.5">如果您需要重新初始化球隊資料庫或交接給新社長，可點擊右側進行資料清空。</p>
            </div>
          </div>
          <button
            onClick={() => {
              setClearConfirmText('');
              setIsClearModalOpen(true);
            }}
            className="w-full md:w-auto bg-[#C25A5A] hover:bg-[#A94C4C] text-white font-bold px-5 py-3 rounded-[12px] text-xs transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>一鍵清除全部資料...</span>
          </button>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#17262B]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#DAD4C2] animate-scale-up space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#17262B]">新增羽球社社員</h3>
                <span className="text-[10px] font-bold bg-[#274A56] text-[#F4F1E7] px-2 py-0.5 rounded-full inline-block mt-1">
                  🛡️ 管理員模式 (支援自訂部門)
                </span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#DAD4C2] flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#17262B] uppercase tracking-wider block">社員姓名 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如：王小明"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#17262B] uppercase tracking-wider block">部門 / 單位 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如：研發部 或 自訂部門名稱"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
                />
                <div className="flex flex-wrap gap-1.5 items-center mt-2">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setDepartment(dept)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-[8px] border transition-all cursor-pointer ${
                        department === dept ? 'bg-[#274A56] text-[#F4F1E7] border-[#274A56]' : 'bg-[#F4F1E7] text-[#4B5D62] border-[#DAD4C2] hover:bg-[#274A56] hover:text-white'
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
                      className="bg-white border border-[#DAD4C2] rounded-lg px-2 py-1 text-[11px] w-28 focus:outline-none focus:ring-1 focus:ring-[#E2794F]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomDept}
                      className="bg-[#E2794F] hover:bg-[#C36A3E] text-white text-xs font-black w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer shadow-2xs"
                      title="新增自訂部門"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#17262B] uppercase tracking-wider block">實力分級</label>
                <select
                  value={skillLevel}
                  onChange={e => setSkillLevel(e.target.value as SkillLevel)}
                  className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-4 py-2.5 text-xs font-bold text-[#17262B] focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
                >
                  <option value="A-進階">A-進階 (校隊/高手)</option>
                  <option value="B-中階">B-中階 (常規打球/雙打順暢)</option>
                  <option value="C-初階">C-初階 (新手入門/快樂流汗)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#17262B] uppercase tracking-wider block">電子郵件</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 bg-[#F4F1E7] hover:bg-[#DAD4C2] text-[#17262B] font-bold py-3 rounded-[12px] transition-all cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#E2794F] hover:bg-[#C36A3E] text-white font-bold py-3 rounded-[12px] shadow-sm transition-all cursor-pointer"
                >
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal with Typing Requirement */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#17262B]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#DAD4C2] animate-scale-up space-y-6">
            <div className="w-16 h-16 bg-[#FBE8E6] text-[#C25A5A] rounded-[16px] flex items-center justify-center mx-auto shadow-2xs">
              <Trash2 className="w-8 h-8" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-[#17262B]">安全確認：清除所有資料</h3>
              <p className="text-xs text-[#4B5D62] leading-relaxed">
                此動作將永久清空所有社員名冊與本週報名記錄。請在下方輸入 <strong className="text-[#C25A5A]">「確認清除」</strong> 以解鎖刪除按鈕：
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="請輸入：確認清除"
                value={clearConfirmText}
                onChange={e => setClearConfirmText(e.target.value)}
                className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] p-3 text-xs font-bold text-center text-[#17262B] focus:outline-none focus:ring-2 focus:ring-[#C25A5A]"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="flex-1 bg-[#F4F1E7] hover:bg-[#DAD4C2] text-[#17262B] font-bold py-3 rounded-[12px] transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                disabled={clearConfirmText !== '確認清除'}
                onClick={() => {
                  if (clearConfirmText === '確認清除') {
                    onClearAllMembers?.();
                    setIsClearModalOpen(false);
                    setClearConfirmText('');
                  }
                }}
                className={`flex-1 py-3 rounded-[12px] font-bold transition-all ${
                  clearConfirmText === '確認清除'
                    ? 'bg-[#C25A5A] hover:bg-[#A94C4C] text-white shadow-sm cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                確認執行清除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
