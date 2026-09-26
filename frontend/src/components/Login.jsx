import React from 'react';

export default function Login({
  formEmail, setFormEmail, formPassword, setFormPassword,
  showPassword, setShowPassword, handleLoginSubmit,
  setIsLoggedIn, setUserRole, showToast
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-md select-none">
      <div className="bg-white rounded-3xl w-full max-w-md p-lg shadow-2xl border border-slate-100 text-center space-y-lg animate-fade-in">
        {/* Logo PLN */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#005c4b]/10 flex items-center justify-center text-[#005c4b]">
            <span className="material-symbols-outlined text-4xl font-bold">bolt</span>
          </div>
        </div>

        {/* Judul */}
        <div>
          <h2 className="text-2xl font-black text-slate-800 leading-snug">Sistem Pemantauan K3L</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">UIP3B SUMATERA - UPT TANJUNG KARANG</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLoginSubmit} className="space-y-md text-left">
          <div className="flex flex-col gap-xs">
            <label className="text-xs font-bold text-slate-400">Alamat Email</label>
            <input 
              type="email" 
              value={formEmail} 
              onChange={(e) => setFormEmail(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 px-md h-12 outline-none focus:border-primary transition-all font-semibold text-slate-700" 
              placeholder="Masukkan email..." 
              required 
            />
          </div>

          <div className="flex flex-col gap-xs relative">
            <label className="text-xs font-bold text-slate-400">Kata Sandi (Password)</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={formPassword} 
                onChange={(e) => setFormPassword(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 pl-md pr-12 h-12 outline-none focus:border-primary transition-all font-semibold text-slate-700" 
                placeholder="Masukkan password..." 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="pt-sm space-y-sm">
            <button type="submit" className="w-full py-md bg-[#11355e] hover:bg-[#0c2742] text-white rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm">
              Masuk ke Dashboard
            </button>
            <button 
              type="button" 
              onClick={() => {
                setIsLoggedIn(true);
                setUserRole('guest');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'guest');
                showToast("Masuk sebagai Tamu (Lihat Saja)");
              }} 
              className="w-full py-md border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all active:scale-95 text-sm bg-white"
            >
              Masuk sebagai Tamu (Lihat Saja)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}