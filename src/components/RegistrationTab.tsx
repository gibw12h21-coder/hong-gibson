import React, { useState } from 'react';
import { Member, EventSession, Registration } from '../types';
import { Calendar, Clock, MapPin, CheckCircle2, UserX, Download, Search, AlertCircle, FileText, Send, Sparkles } from 'lucide-react';

interface RegistrationTabProps {
  session: EventSession;
  members: Member[];
  registrations: Registration[];
  onUpdateRegistration: (memberId: string, status: 'attending' | 'absent', reason?: string) => void;
  onExportCsv: () => void;
}

export const RegistrationTab: React.FC<RegistrationTabProps> = ({
  session,
  members,
  registrations,
  onUpdateRegistration,
  onExportCsv,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'attending' | 'absent' | 'unregistered'>('all');
  
  // Modal state for reason input when marking absent
  const [reasonModalOpen, setReasonModalOpen] = useState(false);
  const [selectedMemberForAbsent, setSelectedMemberForAbsent] = useState<Member | null>(null);
  const [absenceReasonCategory, setAbsenceReasonCategory] = useState<string>('公務出差');
  const [absenceReasonNote, setAbsenceReasonNote] = useState('');

  // Map registrations by memberId
  const regMap = new Map<string, Registration>();
  registrations.forEach(r => regMap.set(r.memberId, r));

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.department.toLowerCase().includes(searchTerm.toLowerCase());
    const reg = regMap.get(m.id);
    const status = reg ? reg.status : 'unregistered';

    if (filterStatus === 'attending') return matchesSearch && status === 'attending';
    if (filterStatus === 'absent') return matchesSearch && status === 'absent';
    if (filterStatus === 'unregistered') return matchesSearch && status === 'unregistered';
    return matchesSearch;
  });

  const attendingCount = members.filter(m => regMap.get(m.id)?.status === 'attending').length;
  const absentCount = members.filter(m => regMap.get(m.id)?.status === 'absent').length;
  const unregisteredCount = members.length - attendingCount - absentCount;
  const isFull = attendingCount >= 16;
  const capacityPercent = Math.min(100, Math.round((attendingCount / 16) * 100));

  const handleStatusChange = (member: Member, newStatus: 'attending' | 'absent') => {
    if (newStatus === 'absent') {
      setSelectedMemberForAbsent(member);
      const existingReg = regMap.get(member.id);
      setAbsenceReasonCategory('公務出差');
      setAbsenceReasonNote(existingReg?.excuseReason || '');
      setReasonModalOpen(true);
    } else {
      onUpdateRegistration(member.id, 'attending', undefined);
    }
  };

  const handleSaveReason = () => {
    if (!selectedMemberForAbsent) return;
    const finalReason = absenceReasonCategory === '其他' && absenceReasonNote.trim() 
      ? `其他: ${absenceReasonNote.trim()}` 
      : absenceReasonCategory;

    onUpdateRegistration(selectedMemberForAbsent.id, 'absent', finalReason);
    setReasonModalOpen(false);
    setSelectedMemberForAbsent(null);
    setAbsenceReasonNote('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in font-sans">
      {/* Header Info */}
      <div className="bg-white rounded-[16px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(23,38,43,0.04)] border border-[#DAD4C2] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#274A56] text-[#F4F1E7] text-xs font-bold px-3 py-1 rounded-[100px]">
              每週一統計截止
            </span>
            <span className="text-xs text-[#4B5D62] flex items-center font-mono">
              <Clock className="w-3.5 h-3.5 mr-1 text-[#E2794F]" /> 截止時間：{session.deadline}
            </span>
            <span className="text-xs font-bold text-[#E2794F] bg-orange-50 px-3 py-1 rounded-[100px] border border-orange-200 font-mono">
              ⏱️ 距離截止還有 1 日 14 時 22 分
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#17262B]">
            {session.title} 報名與出席管理
          </h2>
          <p className="text-[#4B5D62] text-sm leading-relaxed">
            球場地點：{session.location} ｜ 請各位社員於期限內完成登記。
          </p>

          {/* Capacity Progress Bar */}
          <div className="pt-2 space-y-1.5 max-w-md">
            <div className="flex justify-between text-xs font-bold text-[#17262B]">
              <span>場地人數額度：<strong className="font-mono text-base text-[#E2794F]">{attendingCount}</strong> / 16 人</span>
              <span className="font-mono">{capacityPercent}%</span>
            </div>
            <div className="w-full bg-[#F4F1E7] h-3 rounded-full overflow-hidden border border-[#DAD4C2]">
              <div 
                className={`h-full transition-all duration-500 ${isFull ? 'bg-[#C25A5A]' : 'bg-[#E2794F]'}`}
                style={{ width: `${capacityPercent}%` }}
              />
            </div>
            {isFull && (
              <div className="pt-1">
                <span className="inline-flex items-center text-xs font-bold bg-[#FBE8E6] text-[#C25A5A] px-3 py-1 rounded-[100px] border border-[#C25A5A]/30">
                  ⚠️ 場地已滿 (16/16) —— 後續報名將自動轉入候補名單
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={onExportCsv}
            className="flex-1 md:flex-none bg-[#274A56] hover:bg-[#33606C] text-[#F4F1E7] font-bold px-5 py-3 rounded-[12px] shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>匯出名單 (CSV)</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[16px] shadow-[0_10px_30px_rgba(23,38,43,0.04)] border border-[#DAD4C2] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#4B5D62]">確定參加</span>
            <div className="text-3xl font-black mt-1 text-[#17262B] font-mono">{attendingCount} <span className="text-sm font-medium text-[#4B5D62]">位</span></div>
            <p className="text-xs text-[#3F8F62] font-bold mt-1">✓ 列入本週分組名單</p>
          </div>
          <div className="w-14 h-14 bg-[#E4F1E9] text-[#3F8F62] rounded-[12px] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[16px] shadow-[0_10px_30px_rgba(23,38,43,0.04)] border border-[#DAD4C2] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#4B5D62]">請假 / 不參加</span>
            <div className="text-3xl font-black mt-1 text-[#17262B] font-mono">{absentCount} <span className="text-sm font-medium text-[#4B5D62]">位</span></div>
            <p className="text-xs text-[#C25A5A] font-bold mt-1">已附上請假原因</p>
          </div>
          <div className="w-14 h-14 bg-[#FBE8E6] text-[#C25A5A] rounded-[12px] flex items-center justify-center">
            <UserX className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[16px] shadow-[0_10px_30px_rgba(23,38,43,0.04)] border border-[#DAD4C2] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-[#4B5D62]">尚未回報</span>
            <div className="text-3xl font-black mt-1 text-[#17262B] font-mono">{unregisteredCount} <span className="text-sm font-medium text-[#4B5D62]">位</span></div>
            <p className="text-xs text-[#E2794F] font-bold mt-1">請儘速完成登記</p>
          </div>
          <div className="w-14 h-14 bg-orange-50 text-[#E2794F] rounded-[12px] flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-[16px] p-6 shadow-[0_10px_30px_rgba(23,38,43,0.04)] border border-[#DAD4C2] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs filter */}
          <div className="flex space-x-2 w-full md:w-auto overflow-x-auto pb-1">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-[#274A56] text-[#F4F1E7]'
                  : 'bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#DAD4C2]/50'
              }`}
            >
              全部社員 ({members.length})
            </button>
            <button
              onClick={() => setFilterStatus('attending')}
              className={`px-4 py-2 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'attending'
                  ? 'bg-[#274A56] text-[#F4F1E7]'
                  : 'bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#DAD4C2]/50'
              }`}
            >
              已參加 ({attendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('absent')}
              className={`px-4 py-2 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'absent'
                  ? 'bg-[#274A56] text-[#F4F1E7]'
                  : 'bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#DAD4C2]/50'
              }`}
            >
              已請假 ({absentCount})
            </button>
            <button
              onClick={() => setFilterStatus('unregistered')}
              className={`px-4 py-2 rounded-[12px] text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'unregistered'
                  ? 'bg-[#274A56] text-[#F4F1E7]'
                  : 'bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#DAD4C2]/50'
              }`}
            >
              未回報 ({unregisteredCount})
            </button>
          </div>

          {/* Search Box */}
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

        {/* Member Registration Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DAD4C2] text-xs font-bold uppercase tracking-wider text-[#4B5D62] bg-[#F4F1E7]">
                <th className="py-3 px-4 rounded-l-[12px]">球友姓名 / 部門</th>
                <th className="py-3 px-4">實力分級</th>
                <th className="py-3 px-4">出席狀況</th>
                <th className="py-3 px-4">請假原因 (若不參加)</th>
                <th className="py-3 px-4 rounded-r-[12px] text-right">狀態操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DAD4C2]/60 text-xs">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[#4B5D62] font-medium">
                    沒有找到符合條件的球友紀錄
                  </td>
                </tr>
              ) : (
                filteredMembers.map(member => {
                  const reg = regMap.get(member.id);
                  const status = reg ? reg.status : 'unregistered';

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
                        <span className="inline-flex items-center px-2.5 py-1 rounded-[100px] text-[11px] font-bold bg-[#F4F1E7] text-[#17262B] border border-[#DAD4C2]">
                          {member.skillLevel}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {status === 'attending' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-[100px] text-[11px] font-bold bg-[#E4F1E9] text-[#3F8F62]">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 確定參加
                          </span>
                        )}
                        {status === 'absent' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-[100px] text-[11px] font-bold bg-[#FBE8E6] text-[#C25A5A]">
                            <UserX className="w-3.5 h-3.5 mr-1" /> 不參加 (已請假)
                          </span>
                        )}
                        {status === 'unregistered' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-[100px] text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            ⏳ 尚未回報
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 max-w-xs truncate">
                        {reg?.excuseReason ? (
                          <span className="text-[11px] text-[#4B5D62] bg-[#F4F1E7] px-3 py-1 rounded-[10px] block truncate" title={reg.excuseReason}>
                            💬 {reg.excuseReason}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#4B5D62] italic">無</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleStatusChange(member, 'attending')}
                            className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                              status === 'attending'
                                ? 'bg-[#3F8F62] text-white shadow-2xs'
                                : 'bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#3F8F62] hover:text-white'
                            }`}
                          >
                            參加
                          </button>
                          <button
                            onClick={() => handleStatusChange(member, 'absent')}
                            className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                              status === 'absent'
                                ? 'bg-[#C25A5A] text-white shadow-2xs'
                                : 'bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#C25A5A] hover:text-white'
                            }`}
                          >
                            不參加
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reason Input Modal (Dropdown Select) */}
      {reasonModalOpen && selectedMemberForAbsent && (
        <div className="fixed inset-0 bg-[#17262B]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-[#DAD4C2] animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-[12px] bg-[#FBE8E6] text-[#C25A5A] flex items-center justify-center font-bold">
                  <UserX className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#17262B]">填寫請假理由</h3>
                  <p className="text-xs text-[#4B5D62]">球友：{selectedMemberForAbsent.name} ({selectedMemberForAbsent.department})</p>
                </div>
              </div>
              <button
                onClick={() => setReasonModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F1E7] text-[#4B5D62] hover:bg-[#DAD4C2] flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#17262B] uppercase tracking-wider block">
                  不參加原因選項 <span className="text-[#C25A5A]">* (必填)</span>
                </label>
                <select
                  value={absenceReasonCategory}
                  onChange={e => setAbsenceReasonCategory(e.target.value)}
                  className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] p-3 text-xs font-bold text-[#17262B] focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
                >
                  <option value="公務出差">公務出差</option>
                  <option value="身體不適">身體不適</option>
                  <option value="私人事務">私人事務</option>
                  <option value="其他">其他 (請在下方補充說明)</option>
                </select>
              </div>

              {absenceReasonCategory === '其他' && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-xs font-bold text-[#17262B] uppercase tracking-wider block">
                    其他原因補充說明 *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="請簡述請假原因..."
                    value={absenceReasonNote}
                    onChange={e => setAbsenceReasonNote(e.target.value)}
                    className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F]"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setReasonModalOpen(false)}
                className="flex-1 bg-[#F4F1E7] hover:bg-[#DAD4C2] text-[#17262B] font-bold py-3 rounded-[12px] transition-all cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveReason}
                className="flex-1 bg-[#E2794F] hover:bg-[#C36A3E] text-white font-bold py-3 rounded-[12px] shadow-sm transition-all cursor-pointer"
              >
                確認送出請假
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
