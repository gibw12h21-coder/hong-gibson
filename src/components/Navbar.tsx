import React from 'react';
import { Member } from '../types';
import { LogOut, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  attendingCount: number;
  currentSport: 'badminton' | 'tennis';
  setCurrentSport: (sport: 'badminton' | 'tennis') => void;
  isSaving: boolean;
  currentUser: Member | null;
  onLogout: () => void;
  isAdmin: boolean;
  onRefresh: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isSaving,
  currentUser,
  onLogout,
  isAdmin,
  onRefresh,
}) => {
  const tabs = [
    { id: 'overview', name: '本週活動報名' },
    { id: 'members-attendance', name: '社員名冊與出缺席' },
    { id: 'notifications', name: '個人資料維護' },
  ];

  return (
    <header className="bg-[#274A56] text-[#F4F1E7] border-b border-[#33606C] sticky top-0 z-50 font-sans shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4 sm:h-20 border-b border-[#33606C] gap-2">
          {/* Editorial Brand */}
          <div className="flex items-center space-x-3 cursor-pointer min-w-0" onClick={() => setActiveTab('overview')}>
            <div className="w-9 h-9 rounded-[10px] bg-[#E2794F] text-white flex items-center justify-center font-black text-sm flex-shrink-0 shadow-2xs font-mono">
              L
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-[#F2C466] uppercase tracking-widest truncate font-mono">
                LAGIS ｜ 常廣羽球社
              </div>
              <h1 className="text-sm sm:text-lg font-black text-white tracking-tight truncate">
                內部管理系統
              </h1>
            </div>
          </div>

          {/* Sync & User Profile */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              type="button"
              onClick={onRefresh}
              className={`px-3 py-1.5 bg-[#33606C] hover:bg-[#33606C]/80 text-[#F4F1E7] rounded-[10px] text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 border border-[#DAD4C2]/20 ${isSaving ? 'animate-pulse' : ''}`}
              title="立即同步最新資料"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isSaving ? '同步中...' : '同步雲端'}</span>
            </button>

            <div className="text-right pl-2 border-l border-[#33606C]">
              <span className="text-xs font-bold text-white block truncate max-w-[100px] sm:max-w-none">
                {isAdmin ? '🛡️ 管理員' : currentUser?.name}
              </span>
              <span className="text-[10px] text-[#DAD4C2] block truncate font-mono">
                {isAdmin ? '全權限模式' : currentUser?.department}
              </span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-2 text-[#DAD4C2] hover:text-white hover:bg-[#33606C] rounded-[10px] transition-colors cursor-pointer flex-shrink-0"
              title="登出 / 切換帳號"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Editorial Navigation Tabs */}
        <div className="flex space-x-6 sm:space-x-8 overflow-x-auto py-3 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap pb-1 relative ${
                  isActive
                    ? 'text-[#F2C466] border-b-2 border-[#E2794F]'
                    : 'text-[#DAD4C2] hover:text-white'
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
