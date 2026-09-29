import React, { useState } from 'react';
import { Member, SkillLevel } from '../types';
import { ShieldCheck, UserCheck, Lock, ArrowRight, X, KeyRound, Smartphone } from 'lucide-react';
import { ModalPortal } from './ModalPortal';

interface AuthScreenProps {
  members: Member[];
  onLogin: (member: Member) => void;
  onRegister: (member: Omit<Member, 'id' | 'totalAttendance' | 'consecutiveAbsences'>) => void;
  onUpdateMember: (member: Member) => void;
  onAdminLogin: () => void;
  currentSport: 'badminton' | 'tennis';
  setCurrentSport: (sport: 'badminton' | 'tennis') => void;
  departments: string[];
  onAddDepartment: (dept: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  members,
  onLogin,
  onRegister,
  onAdminLogin,
  currentSport,
  setCurrentSport,
  departments,
  onAddDepartment,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginInput, setLoginInput] = useState('');
  
  // Admin modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInputId, setAdminInputId] = useState('');

  // Registration form
  const [regName, setRegName] = useState('');
  const [regDept, setRegDept] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regId, setRegId] = useState('');
  const [regSkill, setRegSkill] = useState<SkillLevel>('B-中階');
  const [customAuthDeptInput, setCustomAuthDeptInput] = useState('');

  const handleAddCustomAuthDept = () => {
    const trimmed = customAuthDeptInput.trim();
    if (!trimmed) return;
    onAddDepartment(trimmed);
    setRegDept(trimmed);
    setCustomAuthDeptInput('');
  };

  const sportName = currentSport === 'badminton' ? '羽球社' : '網球社';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = loginInput.trim().toLowerCase();
    if (!query) {
      alert('請輸入個人工號或姓名！');
      return;
    }

    if (query === 'l0814') {
      onAdminLogin();
      return;
    }

    const found = members.find(m => 
      m.id.toLowerCase() === query || 
      m.name.toLowerCase() === query ||
      m.email.toLowerCase() === query ||
      m.phone.toLowerCase() === query
    );

    if (found) {
      if (found.id.toLowerCase() === 'l0814') {
        onAdminLogin();
      } else {
        onLogin(found);
      }
    } else {
      alert(`找不到與「${loginInput}」相符的${sportName}社員資料！若為首次參加，請點擊上方「首次加入註冊」。`);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      alert('請填寫完整姓名與電子郵件！');
      return;
    }

    const newMemberData = {
      name: regName.trim(),
      department: regDept.trim() || '常廣同仁',
      email: regEmail.trim(),
      phone: regId.trim() || `SP${Math.floor(100 + Math.random() * 900)}`,
      skillLevel: regSkill,
    };

    onRegister(newMemberData);
  };

  return (
    <div className="min-h-full bg-[#F4F1E7] flex flex-col justify-center py-6 px-4 font-sans relative space-y-4">
      {/* Top Header Badge & Admin Button */}
      <div className="flex justify-end max-w-lg mx-auto w-full">
        <button
          type="button"
          onClick={() => setShowAdminModal(true)}
          className="px-4 py-2 bg-[#274A56] hover:bg-[#33606C] text-[#F4F1E7] text-xs font-bold rounded-[12px] border border-[#DAD4C2] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-[#F2C466]" />
          <span>🛡️ 管理員入口</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center space-x-1.5 bg-white text-[#17262B] text-xs font-bold px-3.5 py-1 rounded-full border border-[#DAD4C2] shadow-2xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E2794F]" />
            <span>常廣股份有限公司 ｜ 運動社團專區</span>
          </span>
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-black text-[#17262B] tracking-tight">
          常廣 {sportName} · 登入與註冊系統
        </h2>
        <p className="mt-2 text-center text-xs text-[#4B5D62] max-w-sm mx-auto leading-relaxed">
          請輸入您的員工工號或姓名即可快速登入。
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4 space-y-6">
        {/* Sport Separator Toggle Card */}
        <div className="bg-white p-2 rounded-[16px] border border-[#DAD4C2] shadow-sm flex items-center justify-center space-x-2">
          <button
            type="button"
            onClick={() => setCurrentSport('badminton')}
            className={`flex-1 py-3 px-4 rounded-[12px] text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              currentSport === 'badminton'
                ? 'bg-[#274A56] text-[#F4F1E7] shadow-sm'
                : 'bg-transparent text-[#4B5D62] hover:bg-[#F4F1E7]'
            }`}
          >
            <span>🏸 羽球社專區</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentSport('tennis')}
            className={`flex-1 py-3 px-4 rounded-[12px] text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              currentSport === 'tennis'
                ? 'bg-[#274A56] text-[#F4F1E7] shadow-sm'
                : 'bg-transparent text-[#4B5D62] hover:bg-[#F4F1E7]'
            }`}
          >
            <span>🎾 網球社專區</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-[16px] border border-[#DAD4C2] shadow-[0_10px_30px_rgba(23,38,43,0.04)] space-y-6">
          {/* Tabs Switcher */}
          <div className="flex bg-[#F4F1E7] p-1.5 rounded-[12px] border border-[#DAD4C2]">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-[10px] transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-[#17262B] shadow-2xs border border-[#DAD4C2]'
                  : 'text-[#4B5D62] hover:text-[#17262B]'
              }`}
            >
              ⚡ 社友工號登入
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-[10px] transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-[#17262B] shadow-2xs border border-[#DAD4C2]'
                  : 'text-[#4B5D62] hover:text-[#17262B]'
              }`}
            >
              👤 首次加入註冊
            </button>
          </div>

          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-[#17262B]">{sportName}快速登入</h3>
                <p className="text-xs text-[#4B5D62]">請輸入您的員工工號或真實姓名進入專區</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#17262B] uppercase tracking-wider">個人工號 / 姓名</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4B5D62]">
                    <UserCheck className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="例：SP001 或 王小明"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F] text-[#17262B] font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E2794F] hover:bg-[#C36A3E] text-white font-bold py-3.5 px-4 rounded-[12px] shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>立即進入{sportName}專區</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-xs font-bold text-[#E2794F] hover:underline cursor-pointer"
                >
                  第一次參加{sportName}？ 立即在此切換首次註冊加入
                </button>
              </div>
            </form>
          )}

          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
              <div className="text-center space-y-1 mb-4">
                <h3 className="text-lg font-black text-[#17262B]">首次加入{sportName}註冊</h3>
                <p className="text-xs text-[#4B5D62]">填寫以下基本資料，註冊成功後將自動登入並進入{sportName}專區</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17262B] uppercase mb-1">真實姓名 *</label>
                  <input
                    type="text"
                    required
                    placeholder="例：王小明"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F] text-[#17262B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17262B] uppercase mb-1">所屬部門</label>
                  <input
                    type="text"
                    placeholder="例：研發課"
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F] text-[#17262B]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setRegDept(dept)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-[100px] border transition-all cursor-pointer ${
                      regDept === dept
                        ? 'bg-[#274A56] text-white border-[#274A56]'
                        : 'bg-[#F4F1E7] text-[#4B5D62] border-[#DAD4C2] hover:border-[#274A56]'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
                <div className="flex items-center gap-1 mt-1 sm:mt-0">
                  <input
                    type="text"
                    placeholder="自訂新部門..."
                    value={customAuthDeptInput}
                    onChange={(e) => setCustomAuthDeptInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomAuthDept(); } }}
                    className="bg-white border border-[#DAD4C2] rounded-lg px-2 py-1 text-[11px] w-28 focus:outline-none focus:ring-1 focus:ring-[#E2794F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAuthDept}
                    className="bg-[#E2794F] hover:bg-[#C36A3E] text-white text-xs font-black w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer shadow-2xs"
                    title="新增自訂部門"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17262B] uppercase mb-1">電子郵件 Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@lagis.com.tw"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F] text-[#17262B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17262B] uppercase mb-1">個人工號 *</label>
                  <input
                    type="text"
                    required
                    placeholder="例：SP008"
                    value={regId}
                    onChange={(e) => setRegId(e.target.value)}
                    className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F] text-[#17262B] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17262B] uppercase mb-1">球技分級</label>
                  <select
                    value={regSkill}
                    onChange={(e) => setRegSkill(e.target.value as SkillLevel)}
                    className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#E2794F] text-[#17262B]"
                  >
                    <option value="A-進階">A-進階 (競賽組)</option>
                    <option value="B-中階">B-中階 (切磋組)</option>
                    <option value="C-初階">C-初階 (歡樂組)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E2794F] hover:bg-[#C36A3E] text-white font-bold py-3.5 px-4 rounded-[12px] shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer mt-4"
              >
                <span>完成註冊並進入{sportName}專區</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs font-bold text-[#E2794F] hover:underline cursor-pointer"
                >
                  已經有工號？ 立即切換登入
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Admin Login Modal Window */}
      <ModalPortal isOpen={showAdminModal} className="bg-white rounded-[16px] p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-[#DAD4C2] space-y-5 relative">
        <button
          type="button"
          onClick={() => setShowAdminModal(false)}
          className="absolute top-5 right-5 text-[#4B5D62] hover:text-[#17262B] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 bg-orange-100 text-[#E2794F] rounded-[12px] flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-black text-[#17262B]">{sportName}管理員授權驗證</h3>
          <p className="text-xs text-[#4B5D62] mt-1">
            安全防護：進入管理員完整權限模式請輸入授權密碼。
          </p>
        </div>

        <div className="space-y-2 text-left">
          <label className="block text-xs font-bold text-[#17262B] uppercase tracking-wider">管理員密碼 *</label>
          <input
            type="password"
            placeholder="請輸入密碼"
            value={adminInputId}
            onChange={(e) => setAdminInputId(e.target.value)}
            className="w-full bg-[#F4F1E7]/50 border border-[#DAD4C2] rounded-[12px] px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E2794F] text-[#17262B]"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (adminInputId.trim().toUpperCase() === 'L0814' || adminInputId.trim() === '0814' || adminInputId.trim() === 'admin') {
              setShowAdminModal(false);
              onAdminLogin();
            } else {
              alert('❌ 驗證失敗：管理員密碼錯誤！');
            }
          }}
          className="w-full bg-[#274A56] hover:bg-[#33606C] text-[#F4F1E7] font-bold py-3.5 px-4 rounded-[12px] shadow-sm transition-all cursor-pointer"
        >
          驗證並進入管理員模式
        </button>
      </ModalPortal>
    </div>
  );
};
