import React, { useState } from 'react';
import { Member, EventSession, Registration } from '../types';
import { Calendar, Clock, MapPin, Users, ArrowRight, UserX, ShieldAlert, CheckCircle2, ChevronRight, Mail, RefreshCw, X } from 'lucide-react';
import { ModalPortal } from './ModalPortal';

interface OverviewTabProps {
  session: EventSession;
  members: Member[];
  registrations: Registration[];
  currentUser?: Member | null;
  isAdmin?: boolean;
  setActiveTab: (tab: string) => void;
  onQuickToggle: (memberId: string, status: 'attending' | 'absent', reason?: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  session,
  members,
  registrations,
  currentUser,
  isAdmin = false,
  setActiveTab,
  onQuickToggle,
}) => {
  const regMap = new Map<string, Registration>();
  registrations.forEach(r => regMap.set(r.memberId, r));

  const attendingCount = registrations.filter(r => r.status === 'attending').length;
  const absentCount = registrations.filter(r => r.status === 'absent').length;
  const totalMembers = members.length;
  const attendingMembers = members.filter(m => regMap.get(m.id)?.status === 'attending');

  // Determine target member for intent form: currentUser if present, or first member if admin/guest
  const targetMember = currentUser || members[0];
  const currentReg = targetMember ? regMap.get(targetMember.id) : null;

  const [intentStatus, setIntentStatus] = useState<'attending' | 'absent'>(
    currentReg ? currentReg.status : 'attending'
  );
  const [excuseReason, setExcuseReason] = useState<string>(
    currentReg?.excuseReason || ''
  );
  const [showAttendersModal, setShowAttendersModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmitIntent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMember) {
      alert('請先選擇或登入社員身份！');
      return;
    }
    if (intentStatus === 'absent' && !excuseReason.trim()) {
      alert('請填寫請假原因！');
      return;
    }
    onQuickToggle(targetMember.id, intentStatus, intentStatus === 'absent' ? excuseReason.trim() : undefined);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 pt-2 animate-fade-in font-sans">
      {/* Top Banner Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xs space-y-5">
        
        {/* Header & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
                常廣羽球社 · 週三例會
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> 開放報名中
              </span>
              {currentReg?.status === 'attending' && (
                <span className="text-[10px] sm:text-[11px] font-bold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                  ✓ 出席已確認
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {session.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
            title="重新整理資料"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-start space-x-2.5 text-amber-900 text-xs leading-relaxed">
          <span className="text-sm">📢</span>
          <div>
            <strong className="font-bold block mb-0.5">報名排程通知</strong>
            系統固定於每週一早上 10:00 發出報名通知；截止時間為活動前一日（週二）中午 12:00。
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">活動日期與時間</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">{session.date} (星期三) ｜ {session.time}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 border-t border-slate-200/60 pt-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">活動地點</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">甲組羽球館 <span className="text-xs font-normal text-slate-500">(專用場地)</span></p>
            </div>
          </div>

          <div className="flex items-start space-x-3 border-t border-slate-200/60 pt-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">報名截止時間</span>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                2026/09/22 (二) 12:00 <span className="text-xs font-bold text-orange-600 ml-1.5">⏳ 截止前可隨時修改</span>
              </p>
            </div>
          </div>
        </div>



        {/* Stats Row & Attender List Button & Quick Register */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center space-x-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <span>✅ 已報名：{attendingCount} 人</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl">
              <span>👥 在籍社友：{totalMembers} 人</span>
            </span>
            {targetMember && (
              <button
                type="button"
                onClick={() => {
                  onQuickToggle(targetMember.id, 'attending');
                  setSuccessMessage(true);
                  setTimeout(() => setSuccessMessage(false), 3000);
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer flex items-center space-x-1"
              >
                <span>⚡ 一鍵參加本週</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowAttendersModal(true)}
            className="inline-flex items-center space-x-1 text-xs font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Users className="w-4 h-4 mr-1" />
            <span>查看名單 ({attendingCount})</span>
          </button>
        </div>

      </div>

      {/* Interactive Intent Submission Card (matching Image 1 bottom card) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-orange-600">✍️</span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">填寫 / 修改我的活動意願</h3>
              <p className="text-xs text-slate-500">
                {targetMember ? `當前登入身分：${targetMember.name} (${targetMember.department || '常廣同仁'})` : '每位社友每場保留一筆最新登記；選擇不參加時請填寫請假原因。'}
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            目前登記狀態：
            <span className={`ml-1 font-extrabold ${currentReg?.status === 'attending' ? 'text-emerald-600' : currentReg?.status === 'absent' ? 'text-rose-600' : 'text-slate-400'}`}>
              {currentReg?.status === 'attending' ? '已參加' : currentReg?.status === 'absent' ? '已請假' : '尚未登記'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmitIntent} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              請選擇您的參加意願 <span className="text-orange-600">*</span>
            </label>

            <div className="grid grid-cols-1 gap-3">
              {/* Attending Option */}
              <div
                onClick={() => setIntentStatus('attending')}
                className={`border-2 rounded-2xl p-4 sm:p-5 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  intentStatus === 'attending'
                    ? 'border-orange-600 bg-orange-50/40 ring-2 ring-orange-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="intentOption"
                    checked={intentStatus === 'attending'}
                    onChange={() => setIntentStatus('attending')}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 cursor-pointer flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-extrabold text-slate-900">參加活動</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        准時出席
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      固定每週三 18:00 - 19:30 於甲組羽球館熱血揮拍
                    </p>
                  </div>
                </div>
              </div>

              {/* Absent Option */}
              <div
                onClick={() => setIntentStatus('absent')}
                className={`border-2 rounded-2xl p-4 sm:p-5 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  intentStatus === 'absent'
                    ? 'border-orange-600 bg-orange-50/40 ring-2 ring-orange-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="intentOption"
                    checked={intentStatus === 'absent'}
                    onChange={() => setIntentStatus('absent')}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 cursor-pointer flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-extrabold text-slate-900">不參加</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        需填寫原因
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      本週因公務、事由或身體狀況無法到場
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Excuse Reason input if Absent */}
          {intentStatus === 'absent' && (
            <div className="space-y-2 animate-fade-in">
              <label className="block text-xs font-bold text-slate-700">
                請假原因 / 備註 <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="例如：因公出差、部門加班或身體不適..."
                value={excuseReason}
                onChange={(e) => setExcuseReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
              />
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-3">
              {successMessage && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl animate-fade-in">
                  ✓ 登記成功！
                </span>
              )}
              <button
                type="submit"
                className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                送出意願登記
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Attenders List Modal */}
      <ModalPortal isOpen={showAttendersModal} className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-600" /> 本週參加社友名單 ({attendingCount})
          </h3>
          <button
            type="button"
            onClick={() => setShowAttendersModal(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
          {attendingMembers.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-xs">目前尚無社員登記參加本週活動</p>
          ) : (
            attendingMembers.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-slate-900">{m.name}</span>
                  <span className="text-xs text-slate-400 ml-2">({m.department})</span>
                </div>
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg">
                  {m.skillLevel}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => setShowAttendersModal(false)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            關閉
          </button>
        </div>
      </ModalPortal>
    </div>
  );
};
