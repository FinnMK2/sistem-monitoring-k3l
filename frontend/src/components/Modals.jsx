import React from 'react';

export default function Modals({
  profileModalOpen, setProfileModalOpen, settingsModalOpen, setSettingsModalOpen, userRole, spsUrl, setSpsUrl, webAppUrl, setWebAppUrl,
  handleLogout, showToast, adminPhone, setAdminPhone,
  helpModalOpen, setHelpModalOpen,
  editModalOpen, setEditModalOpen, editNo, setEditNo, editPic, setEditPic,
  editCategory, setEditCategory, editTitle, setEditTitle, editMonths, handleEditMonthChange,
  editWeeks, handleEditWeekValueChange, handleEditSubmit, MONTH_TO_WEEKS,
  newYearModalOpen, setNewYearModalOpen, inputNewYear, setInputNewYear, handleCreateNewYear,
  filterOpen, setFilterOpen, searchQuery, setSearchQuery, filterPic, setFilterPic,
  filterCategory, setFilterCategory, filterStatus, setFilterStatus, tasks, realisasiModal, setRealisasiModal,
  handleSaveRealisasi, selectedYear, handleDeleteTask, openEditModal
}) {

  const uniquePics = [...new Set(tasks.map(t => t?.pic).filter(Boolean))];

  return (
    <>
      {/* 1. MODAL: PROFIL PENGGUNA */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start sm:items-center justify-center p-md overflow-y-auto select-none">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative text-left animate-slide-up border border-slate-100 my-md sm:my-0 max-h-[calc(100vh-2rem)] flex flex-col">
            {/* Header */}
            <div className="bg-[#1c4475] text-white px-lg py-md flex justify-between items-center h-14 shrink-0">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-xl">account_circle</span>
                <span className="font-bold text-sm tracking-wide">Profil Pengguna</span>
              </div>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Tutup profil"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Isi profil */}
            <div className="overflow-y-auto custom-scrollbar">
              <div className="p-lg flex flex-col items-center border-b border-slate-100 bg-slate-50/60">
                <div className="w-16 h-16 rounded-full bg-[#2092e4] flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-4xl">account_circle</span>
                </div>
                <h4 className="text-base font-bold text-slate-800 mt-sm leading-tight">
                  {userRole === 'admin' ? 'Admin UPT' : 'Tamu UPT'}
                </h4>
                <p className="text-xs text-slate-400 mt-xs">UPT Tanjung Karang</p>
                <span className="mt-sm px-3 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold rounded-full">
                  AKTIF
                </span>
              </div>

              <div className="p-lg space-y-md text-sm">
                <div className="space-y-xs">
                  <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Informasi Akun</p>

                  {userRole === 'admin' && (
                    <div className="py-sm border-b border-slate-100 flex justify-between items-start gap-md">
                      <span className="font-bold text-slate-400 text-xs">NIP / ID</span>
                      <span className="font-bold text-slate-800 text-sm text-right">9416045X</span>
                    </div>
                  )}

                  <div className="py-sm border-b border-slate-100 flex justify-between items-start gap-md">
                    <span className="font-bold text-slate-400 text-xs">UNIT KERJA</span>
                    <span className="font-bold text-slate-800 text-sm text-right">PLN UIP3B - UPT Tanjung Karang</span>
                  </div>

                  <div className="py-sm border-b border-slate-100 flex justify-between items-start gap-md">
                    <span className="font-bold text-slate-400 text-xs">ROLE AKSES</span>
                    <span className="font-bold text-slate-800 text-sm text-right">
                      {userRole === 'admin' ? 'Administrator' : 'Tamu'}
                    </span>
                  </div>
                </div>

                {userRole === 'admin' ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-md">
                    <div className="flex items-start gap-md">
                      <div className="w-10 h-10 rounded-full bg-[#1c4475]/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#1c4475] text-xl">admin_panel_settings</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#1c4475]">Akses Administrator</p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Dapat mengelola rencana kegiatan, memperbarui realisasi, mengatur tahun pemantauan, dan mengelola data K3L.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-md">
                    <div className="flex items-start gap-md">
                      <div className="w-10 h-10 rounded-full bg-[#1c4475]/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[#1c4475] text-xl">visibility</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#1c4475]">Akses Monitoring</p>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          Akun tamu dapat melihat dashboard, memfilter periode dan tahun, serta meninjau daftar kegiatan. Perubahan data hanya dapat dilakukan oleh Administrator.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-lg py-md border-t flex items-center justify-between gap-sm shrink-0">
              <button
                type="button"
                onClick={handleLogout}
                className="px-md py-sm bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-xl font-bold transition-all text-xs active:scale-95 flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Keluar Akun</span>
              </button>

              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="px-md py-sm bg-[#1c4475] text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-xs shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL: UPDATE REALISASI KEGIATAN */}
      {realisasiModal.show && userRole === 'admin' && (() => {
        const plannedWeeks = Object.keys(realisasiModal.weeks || {})
          .map(Number)
          .filter(week => Number(realisasiModal.weeks?.[week] || 0) > 0)
          .sort((a, b) => a - b);

        const selectedWeek = Number(realisasiModal.selectedWeek || plannedWeeks[0] || 1);
        const targetThisWeek = Number(realisasiModal.weeks?.[selectedWeek] || 0);
        const actualThisWeek = Number(realisasiModal.actualWeeks?.[selectedWeek] || 0);

        const handleWeekSelect = (week) => {
          const weekNumber = Number(week);
          setRealisasiModal(prev => ({
            ...prev,
            selectedWeek: weekNumber,
            value: Number(prev.actualWeeks?.[weekNumber] || 0)
          }));
        };

        return (
          <div className="fixed inset-0 bg-black/50 z-[100] overflow-y-auto select-none">
            <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-md">
              <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl relative text-left animate-slide-up border border-slate-200 max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden">
              <div className="bg-[#1c4475] text-white px-md sm:px-lg py-sm sm:py-md flex justify-between items-center min-h-14 shrink-0">
                <div className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-xl">edit_document</span>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide">Update Realisasi Kegiatan</h3>
                    <p className="text-[10px] text-white/70 mt-0.5">Perbarui capaian aktual berdasarkan minggu pelaksanaan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRealisasiModal(prev => ({ ...prev, show: false }))}
                  className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Tutup modal"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-md sm:p-lg space-y-md sm:space-y-lg overflow-y-auto custom-scrollbar flex-1 min-h-0">
                {/* Detail kegiatan */}
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-md space-y-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detail Kegiatan</p>

                  <div className="grid grid-cols-[110px_1fr] gap-x-md gap-y-2 text-xs">
                    <span className="font-semibold text-slate-500">MATLEV KAM</span>
                    <span className="font-bold text-slate-800">{realisasiModal.no || '-'}</span>

                    <span className="font-semibold text-slate-500">PIC</span>
                    <span className="font-bold text-slate-800">{realisasiModal.pic || '-'}</span>

                    <span className="font-semibold text-slate-500">Uraian</span>
                    <span className="font-bold text-slate-800 leading-snug">{realisasiModal.activity || '-'}</span>

                    <span className="font-semibold text-slate-500">Kategori</span>
                    <span className="font-semibold text-slate-700 leading-snug">{realisasiModal.category || '-'}</span>
                  </div>
                </div>

                {/* Pemilihan minggu */}
                <div className="space-y-xs">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Minggu Pelaksanaan</label>
                  {plannedWeeks.length > 0 ? (
                    <select
                      value={selectedWeek}
                      onChange={(e) => handleWeekSelect(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-md h-12 shadow-sm focus:outline-none focus:border-[#1c4475] text-sm font-bold bg-white"
                    >
                      {plannedWeeks.map(week => (
                        <option key={week} value={week}>
                          M-{week} — Target {Number(realisasiModal.weeks?.[week] || 0)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-md py-sm text-xs text-amber-700">
                      Kegiatan ini belum memiliki target mingguan.
                    </div>
                  )}
                </div>

                {/* Ringkasan minggu terpilih */}
                <div className="grid grid-cols-2 gap-md">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-md">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-blue-500">Target M-{selectedWeek}</p>
                    <p className="text-2xl font-black text-[#1c4475] mt-1">{targetThisWeek}</p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-md">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Realisasi Saat Ini</p>
                    <p className="text-2xl font-black text-slate-700 mt-1">{actualThisWeek}</p>
                  </div>
                </div>

                {/* Nilai baru */}
                <div className="space-y-xs">
                  <div className="flex justify-between items-end gap-md">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Realisasi Baru</label>
                      <p className="text-[11px] text-slate-400 mt-1">Masukkan total realisasi untuk minggu yang dipilih.</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      targetThisWeek > 0 && Number(realisasiModal.value || 0) >= targetThisWeek
                        ? 'bg-emerald-50 text-emerald-600'
                        : Number(realisasiModal.value || 0) > 0
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-slate-100 text-slate-500'
                    }`}>
                      {targetThisWeek > 0 && Number(realisasiModal.value || 0) >= targetThisWeek
                        ? 'Target Terpenuhi'
                        : Number(realisasiModal.value || 0) > 0
                          ? 'Dalam Proses'
                          : 'Belum Mulai'}
                    </span>
                  </div>

                  <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden h-14 bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => setRealisasiModal(prev => ({ ...prev, value: Math.max(0, Number(prev.value || 0) - 1) }))}
                      className="w-14 h-full flex items-center justify-center hover:bg-slate-50 border-r border-slate-200 text-xl font-bold text-slate-600 transition-colors"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={realisasiModal.value}
                      onChange={(e) => setRealisasiModal(prev => ({ ...prev, value: Math.max(0, Number(e.target.value || 0)) }))}
                      className="flex-1 min-w-0 h-full text-center font-black text-lg outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => setRealisasiModal(prev => ({ ...prev, value: Number(prev.value || 0) + 1 }))}
                      className="w-14 h-full flex items-center justify-center hover:bg-slate-50 border-l border-slate-200 text-xl font-bold text-slate-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-slate-100 px-md sm:px-lg py-sm sm:py-md flex justify-end gap-sm shrink-0">
                <button
                  type="button"
                  onClick={() => setRealisasiModal(prev => ({ ...prev, show: false }))}
                  className="px-md py-sm bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl font-bold transition-all text-xs"
                >
                  Batal
                </button>

                <button
                  type="button"
                  disabled={plannedWeeks.length === 0}
                  onClick={() => handleSaveRealisasi(realisasiModal.taskId, selectedWeek, realisasiModal.value)}
                  className="px-lg py-sm bg-[#1c4475] hover:bg-[#132f53] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-xs text-xs"
                >
                  <span className="material-symbols-outlined text-base">save</span>
                  <span>Simpan Perubahan</span>
                </button>
              </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 3. MODAL: PENGATURAN SISTEM (ADMIN) */}
      {settingsModalOpen && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-start sm:items-center justify-center p-md overflow-y-auto select-none">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative text-left animate-slide-up border border-slate-100 my-md sm:my-0 max-h-[calc(100vh-2rem)] flex flex-col">
            <div className="bg-[#1c4475] text-white px-lg py-md flex justify-between items-center h-14 shrink-0">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-xl">settings</span>
                <span className="font-bold text-sm tracking-wide">Pengaturan Sistem</span>
              </div>
              <button type="button" onClick={() => setSettingsModalOpen(false)} className="text-white/80 hover:text-white transition-colors" aria-label="Tutup pengaturan">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-lg space-y-lg overflow-y-auto custom-scrollbar">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-md flex gap-md items-start">
                <span className="material-symbols-outlined text-[#1c4475]">info</span>
                <div>
                  <p className="text-xs font-bold text-[#1c4475]">Konfigurasi Administrator</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">Pengaturan ini terpisah dari Profil Pengguna agar identitas akun tidak bercampur dengan konfigurasi teknis sistem.</p>
                </div>
              </div>

              <div className="space-y-md">
                <div className="flex flex-col gap-xs">
                  <label className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Tautan Spreadsheet SPS</label>
                  <input
                    type="url"
                    value={spsUrl}
                    onChange={(e) => setSpsUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-md h-11 outline-none text-xs font-semibold focus:border-[#1c4475]"
                    placeholder="https://docs.google.com/spreadsheets/..."
                  />
                  <p className="text-[10px] text-slate-400">Digunakan untuk tombol Lihat di SPS / akses cepat ke spreadsheet utama.</p>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Nomor WhatsApp Pengingat</label>
                  <input
                    type="tel"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value.replace(/[^0-9+]/g, ''))}
                    className="w-full rounded-xl border border-slate-200 px-md h-11 outline-none text-xs font-semibold focus:border-[#1c4475]"
                    placeholder="Contoh: 08123456789"
                  />
                  <p className="text-[10px] text-slate-400">Dipakai sebagai nomor tujuan reminder manual. Fitur WA dapat dikonfigurasi lagi saat token Fonnte diaktifkan.</p>
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="text-[10px] font-black tracking-wider text-slate-400 uppercase">Endpoint Integrasi</label>
                  <div className="flex items-center gap-sm">
                    <input
                      value={webAppUrl}
                      readOnly
                      className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-md h-11 outline-none text-xs font-semibold text-slate-500"
                    />
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold whitespace-nowrap">TERHUBUNG</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Endpoint Google Apps Script diatur melalui proxy Vite, jadi tidak perlu diubah dari profil.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-lg py-md border-t flex justify-end gap-sm shrink-0">
              <button type="button" onClick={() => setSettingsModalOpen(false)} className="px-md py-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-xs">Batal</button>
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('gas_sps_url', spsUrl);
                  localStorage.setItem('gas_admin_phone', adminPhone);
                  setSettingsModalOpen(false);
                  showToast('Pengaturan sistem berhasil disimpan.');
                }}
                className="px-md py-sm bg-[#1c4475] text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-xs shadow-sm"
              >
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: EDIT DATA KEGIATAN */}
      {editModalOpen && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-md overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg p-md sm:p-lg shadow-2xl relative text-left animate-slide-up max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto custom-scrollbar my-2 sm:my-0">
            <h3 className="text-xl font-bold mb-md">Edit Kegiatan</h3>
            <form onSubmit={handleEditSubmit} className="space-y-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="text-xs font-bold text-outline">No (MATLEV KAM)</label>
                  <input value={editNo} onChange={(e) => setEditNo(e.target.value)} className="w-full rounded-xl border px-md h-12 outline-none" required />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-xs font-bold text-outline">PIC</label>
                  <input value={editPic} onChange={(e) => setEditPic(e.target.value)} className="w-full rounded-xl border px-md h-12 outline-none" required />
                </div>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-outline">Uraian Kegiatan</label>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-xl border px-md h-12 outline-none" required />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-outline mb-1">Bulan Pelaksanaan</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-sm">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map(m => (
                    <label key={m} className={`flex items-center justify-center py-2 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${editMonths.includes(m) ? 'border-primary bg-primary-container text-on-primary-container font-bold' : 'bg-white'}`}>
                      <input type="checkbox" checked={editMonths.includes(m)} onChange={(e) => handleEditMonthChange(m, e.target.checked)} className="hidden" />
                      <span className="text-xs">{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              {editMonths.length > 0 && (
                <div className="flex flex-col gap-xs">
                  <label className="text-xs font-bold text-outline mb-1">Target Rencana Mingguan (Plan)</label>
                  <div className="space-y-sm p-sm border rounded-2xl bg-slate-50 max-h-40 overflow-y-auto custom-scrollbar">
                    {editMonths.map(month => (
                      <div key={month} className="space-y-xs pb-sm border-b border-slate-100 last:border-0 last:pb-0">
                        <span className="font-bold text-xs uppercase text-primary">{month} :</span>
                        <div className="flex flex-wrap gap-xs">
                          {(MONTH_TO_WEEKS[month] || []).map(week => {
                            const value = editWeeks[week] || 0;
                            return (
                              <div key={week} className="flex items-center gap-xs bg-white border p-1 rounded-xl shadow-sm">
                                <span className="text-[10px] font-bold text-outline px-1 border-r">M-{week}</span>
                                <button type="button" className="w-4 h-4 flex items-center justify-center hover:bg-slate-100 rounded" onClick={() => handleEditWeekValueChange(week, Math.max(0, value - 1))}>-</button>
                                <span className="font-bold text-xs">{value}</span>
                                <button type="button" className="w-4 h-4 flex items-center justify-center hover:bg-slate-100 rounded" onClick={() => handleEditWeekValueChange(week, value + 1)}>+</button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-sm flex flex-col-reverse sm:flex-row justify-end gap-sm">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-md py-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-xs">Batal</button>
                <button type="submit" className="px-md py-sm bg-primary text-white rounded-xl font-bold hover:brightness-110 transition-all text-xs">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: TAMBAH TAHUN BARU */}
      {newYearModalOpen && userRole === 'admin' && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-md overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-sm p-md sm:p-lg shadow-2xl relative text-left animate-slide-up my-2 sm:my-0 max-h-[calc(100dvh-1.5rem)] overflow-y-auto custom-scrollbar">
            <h3 className="text-xl font-bold mb-md">Tambah Rencana Tahun Baru</h3>
            <div className="space-y-sm">
              <label className="text-xs font-bold text-outline">Masukkan Tahun Rencana</label>
              <input value={inputNewYear} onChange={(e) => setInputNewYear(e.target.value.replace(/\D/g, ''))} maxLength="4" className="w-full rounded-xl border px-md h-12 outline-none text-base font-bold text-slate-800" placeholder="Contoh: 2027" />
              <p className="text-[10px] text-slate-400">Seluruh struktur program dan rencana target (Plan) dari tahun yang sedang aktif saat ini akan disalin otomatis dengan realisasi aktual disetel ulang ke 0.</p>
            </div>
            <div className="mt-lg flex flex-col-reverse sm:flex-row justify-end gap-sm">
              <button type="button" onClick={() => setNewYearModalOpen(false)} className="px-md py-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-xs">Batal</button>
              <button type="button" onClick={handleCreateNewYear} className="px-md py-sm bg-secondary text-white rounded-xl font-bold hover:brightness-110 transition-all text-xs">Duplikat Rencana</button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: FILTER PENCARIAN */}
      {filterOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-md overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md p-md sm:p-lg shadow-2xl relative text-left animate-slide-up space-y-md my-2 sm:my-0 max-h-[calc(100dvh-1.5rem)] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center pb-sm border-b">
              <h3 className="text-lg font-bold">Filter Kegiatan</h3>
              <button onClick={() => setFilterOpen(false)} className="text-slate-400 hover:text-slate-700"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="space-y-sm">
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-outline">Kata Kunci Pencarian</label>
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border px-md h-11 outline-none text-sm" placeholder="Ketik rincian atau kategori..." />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-outline">PIC Penanggung Jawab</label>
                <select value={filterPic} onChange={(e) => setFilterPic(e.target.value)} className="w-full rounded-xl border px-md h-11 outline-none bg-white text-sm">
                  <option value="all">Semua PIC</option>
                  {uniquePics.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-outline">Kategori Program</label>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full rounded-xl border px-md h-11 outline-none bg-white text-sm">
                  <option value="all">Semua Kategori</option>
                  <option value="1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN">1. Kepemimpinan</option>
                  <option value="2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN">2. Sosialisasi</option>
                  <option value="3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN">3. Pembinaan Teknis</option>
                  <option value="4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN">4. Identifikasi Kerawanan</option>
                  <option value="5. KOMPETENSI DAN PELATIHAN">5. Kompetensi</option>
                  <option value="6. PELAPORAN">6. Pelaporan</option>
                  <option value="7. PROGRAM PENDUKUNG">7. Program Pendukung</option>
                </select>
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-xs font-bold text-outline">Status Penyelesaian</label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full rounded-xl border px-md h-11 outline-none bg-white text-sm">
                  <option value="all">Semua Status</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dalam Proses">Dalam Proses</option>
                  <option value="Belum Mulai">Belum Mulai</option>
                </select>
              </div>
            </div>
            <div className="pt-sm flex flex-col-reverse sm:flex-row sm:justify-between gap-sm">
              <button onClick={() => { setSearchQuery(''); setFilterPic('all'); setFilterCategory('all'); setFilterStatus('all'); }} className="text-xs text-error font-bold hover:underline">Reset Filter</button>
              <button onClick={() => setFilterOpen(false)} className="px-md py-sm bg-primary text-white rounded-xl font-bold hover:brightness-110 transition-all text-xs">Terapkan Filter</button>
            </div>
          </div>
        </div>
      )}
      {/* 7. MODAL: PUSAT BANTUAN */}
      {helpModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[120] flex items-start sm:items-center justify-center p-md overflow-y-auto select-none">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative text-left animate-slide-up border border-slate-100 my-md sm:my-0 max-h-[calc(100vh-2rem)] flex flex-col">
            <div className="bg-[#1c4475] text-white px-lg py-md flex justify-between items-center h-14 shrink-0">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-xl">help</span>
                <span className="font-bold text-sm tracking-wide">Pusat Bantuan</span>
              </div>
              <button type="button" onClick={() => setHelpModalOpen(false)} className="text-white/80 hover:text-white transition-colors" aria-label="Tutup pusat bantuan">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-lg overflow-y-auto custom-scrollbar space-y-lg">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-md flex gap-md items-start">
                <div className="w-10 h-10 rounded-full bg-[#1c4475]/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#1c4475]">info</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1c4475]">Panduan {userRole === 'admin' ? 'Administrator' : 'Tamu'}</p>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {userRole === 'admin' ? 'Gunakan panduan ini untuk mengelola rencana, realisasi, tahun pemantauan, dan data kegiatan K3L.' : 'Gunakan panduan ini untuk membaca dashboard, memfilter data, dan melihat progres kegiatan K3L.'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="border border-slate-200 rounded-2xl p-md">
                  <div className="flex items-center gap-sm mb-sm">
                    <span className="material-symbols-outlined text-primary">dashboard</span>
                    <p className="text-sm font-bold text-slate-800">Beranda & Dashboard</p>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Gunakan pilihan Tahun dan Periode untuk menyesuaikan angka kartu, grafik, target, realisasi, dan status.</p>
                </div>
                <div className="border border-slate-200 rounded-2xl p-md">
                  <div className="flex items-center gap-sm mb-sm">
                    <span className="material-symbols-outlined text-primary">view_list</span>
                    <p className="text-sm font-bold text-slate-800">Daftar Kegiatan</p>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">Lihat uraian, PIC, target, realisasi, dan status. Gunakan filter untuk mencari kegiatan tertentu.</p>
                </div>
                {userRole === 'admin' && (<>
                  <div className="border border-slate-200 rounded-2xl p-md">
                    <div className="flex items-center gap-sm mb-sm"><span className="material-symbols-outlined text-primary">add_task</span><p className="text-sm font-bold text-slate-800">Kelola Kegiatan</p></div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Tambahkan rencana melalui menu Tambah Kegiatan. Pada menu Pemantauan Kegiatan, gunakan ikon Update Realisasi, Edit, dan Hapus.</p>
                  </div>
                  <div className="border border-slate-200 rounded-2xl p-md">
                    <div className="flex items-center gap-sm mb-sm"><span className="material-symbols-outlined text-primary">calendar_month</span><p className="text-sm font-bold text-slate-800">Manajemen Tahun</p></div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Tombol + Tahun menduplikasi rencana tahun aktif dan mengosongkan realisasi. Tahun 2026 tidak dapat dihapus.</p>
                  </div>
                  <div className="border border-slate-200 rounded-2xl p-md md:col-span-2">
                    <div className="flex items-center gap-sm mb-sm"><span className="material-symbols-outlined text-primary">settings</span><p className="text-sm font-bold text-slate-800">Pengaturan Sistem</p></div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Konfigurasi Spreadsheet dan nomor pengingat tersedia di menu Pengaturan Sistem.</p>
                  </div>
                </>)}
                {userRole === 'guest' && (
                  <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-md md:col-span-2">
                    <div className="flex items-center gap-sm mb-sm"><span className="material-symbols-outlined text-emerald-700">visibility</span><p className="text-sm font-bold text-emerald-800">Mode Lihat Saja</p></div>
                    <p className="text-[11px] text-emerald-700/80 leading-relaxed">Akun Tamu tidak dapat menambah, mengedit, menghapus, atau memperbarui realisasi. Jika ada data yang perlu diperbaiki, hubungi Administrator UPT.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-slate-50 px-lg py-md border-t flex justify-end shrink-0">
              <button type="button" onClick={() => setHelpModalOpen(false)} className="px-md py-sm bg-[#1c4475] text-white rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all text-xs shadow-sm">Mengerti</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}