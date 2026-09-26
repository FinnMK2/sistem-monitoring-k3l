import React from 'react';

export default function LogAktivitas({
  selectedYear, activeMonthTab, setActiveMonthTab, exportToExcel, spsUrl, groupedTasks, visibleWeeks, MONTH_TO_WEEKS, WEEK_DATES
}) {
  return (
    <div className="space-y-lg text-left">
      <div className="p-md bg-white border border-[#cbd5e1] rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
        <div>
          <h2 className="font-bold text-headline-sm text-on-surface">Log Aktivitas & Spreadsheet</h2>
          {/* PERBAIKAN: Keterangan Minggu Otomatis Dinamis Berdasarkan Panjang visibleWeeks */}
          <p className="text-body-sm text-on-surface-variant mt-xs">Penjadwalan {visibleWeeks.length} Minggu — Unit: UPT Tanjung Karang</p>
        </div>
        <div className="flex items-center gap-sm">
          <button onClick={exportToExcel} className="p-sm bg-primary text-white rounded-full flex items-center justify-center shadow-sm hover:brightness-110 active:scale-95 transition-all" title="Excel">
            <span className="material-symbols-outlined">download</span>
          </button>
          <a href={spsUrl} target="_blank" rel="noopener noreferrer" className="px-md py-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center gap-xs shadow-sm transition-all text-xs font-bold">
            <span className="material-symbols-outlined text-sm">open_in_new</span><span>Lihat di SPS</span>
          </a>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-surface-container-low px-md py-sm overflow-x-auto whitespace-nowrap custom-scrollbar flex gap-sm border border-[#cbd5e1] rounded-xl sticky top-0 z-30 bg-white">
        {['Semua', 'TW 1', 'TW 2', 'TW 3', 'TW 4', 'Semester 1', 'Semester 2', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
          <button key={m} onClick={() => setActiveMonthTab(m)} className={`px-md py-xs rounded-full text-body-sm transition-all ${activeMonthTab === m ? 'bg-primary text-on-primary font-bold shadow-sm' : 'bg-white text-on-surface-variant font-medium border border-[#cbd5e1]'}`}>
            {m}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-[#cbd5e1] overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse table-fixed min-w-[2800px] bg-white">
            <thead>
              <tr className="bg-slate-100 text-[10px] font-bold text-center border-b border-slate-300">
                <th className="w-16 border-r border-slate-300 p-xs" rowSpan="2">ISO 45001</th>
                <th className="w-16 border-r border-slate-300 p-xs" rowSpan="2">PP 50</th>
                <th className="w-16 border-r border-slate-300 p-xs" rowSpan="2">MATLEV KAM</th>
                <th className="w-16 border-r border-slate-300 p-xs" rowSpan="2">No</th>
                <th className="w-12 border-r border-slate-300 p-xs" rowSpan="2">Sub</th>
                <th className="w-96 border-r border-slate-300 p-xs text-left px-md" rowSpan="2">Uraian Kegiatan</th>
                <th className="w-24 border-r border-slate-300 p-xs" rowSpan="2">PIC</th>
                <th className="w-20 border-r border-slate-300 p-xs" rowSpan="2">Biaya</th>
                <th className="w-20 border-r border-slate-300 p-xs" rowSpan="2">Target</th>
                <th className="w-24 border-r border-slate-300 p-xs" rowSpan="2">Prosedur</th>
                <th className="w-20 border-r border-slate-300 p-xs" rowSpan="2">Folder</th>
                <th className="w-16 border-r border-slate-300 p-xs" rowSpan="2">Link</th>
                <th className="w-16 border-r border-slate-300 p-xs" rowSpan="2">Status</th>
                {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map(m => {
                  const mWeeks = MONTH_TO_WEEKS[m].filter(w => visibleWeeks.includes(w));
                  if (mWeeks.length === 0) return null;
                  return (
                    <th key={m} className="border-r border-slate-300 bg-[#e2effa] py-1 text-slate-800" colSpan={mWeeks.length}>
                      {m} {selectedYear}
                    </th>
                  );
                })}
              </tr>
              <tr className="bg-[#fff7e6] text-[9px] border-b border-slate-300 text-slate-800">
                {visibleWeeks.map(w => (
                  <th key={w} className="border-r border-slate-300 font-bold py-1 bg-[#ffe8cc]" title={`Rentang Tanggal: ${WEEK_DATES[w]}`}>M-{w}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs text-left">
              {Object.keys(groupedTasks).length === 0 ? (
                <tr><td colSpan={13 + visibleWeeks.length} className="text-center py-xl text-on-surface-variant italic">Data tidak ditemukan.</td></tr>
              ) : (
                Object.entries(groupedTasks).map(([categoryName, categoryTasks]) => (
                  <React.Fragment key={categoryName}>
                    <tr className="bg-slate-200 border-b border-slate-300">
                      <td className="px-md py-1.5 border-r border-slate-300 font-bold text-slate-800 uppercase tracking-wide text-[10px]" colSpan={13 + visibleWeeks.length}>{categoryName}</td>
                    </tr>
                    {categoryTasks.map(task => {
                      const calculatedTarget = Array.isArray(task.weeks) 
                        ? task.weeks.length 
                        : Object.values(task.weeks || {}).reduce((sum, v) => sum + Number(v || 0), 0);

                      return (
                        <React.Fragment key={task.id}>
                          <tr className="border-b border-slate-200 hover:bg-slate-50 text-slate-700">
                            <td className="border-r border-slate-200 text-center bg-white" rowSpan="2">{task.iso45001 || ""}</td>
                            <td className="border-r border-slate-200 text-center bg-white" rowSpan="2">{task.pp50 || ""}</td>
                            <td className="border-r border-slate-200 text-center bg-white" rowSpan="2">{task.matlevKam || ""}</td>
                            <td className="border-r border-slate-200 text-center font-bold text-slate-800 bg-white" rowSpan="2">{task.no}</td>
                            <td className="border-r border-slate-200 text-center bg-white font-semibold text-slate-600" rowSpan="2">{task.subNo || ""}</td>
                            <td className="px-md border-r border-slate-200 bg-white font-medium align-middle" rowSpan="2">{task.title}</td>
                            <td className="border-r border-slate-200 text-center bg-white align-middle" rowSpan="2">
                              <span className="px-1.5 py-0.5 bg-slate-100 rounded font-mono text-[9px] font-bold">{task.pic}</span>
                            </td>
                            <td className="border-r border-slate-200 text-center bg-white" rowSpan="2">{task.biaya || "-"}</td>
                            <td className="border-r border-slate-200 text-center font-bold bg-amber-50 text-amber-900">{calculatedTarget}</td>
                            <td className="border-r border-slate-200 text-center bg-white" rowSpan="2">{task.prosedur || "-"}</td>
                            <td className="border-r border-slate-200 text-center bg-white" rowSpan="2">{task.folder || "-"}</td>
                            <td className="border-r border-slate-200 text-center bg-white" rowSpan="2">
                              {task.link ? <a href={task.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><span className="material-symbols-outlined text-sm">link</span></a> : "-"}
                            </td>
                            <td className="border-r border-slate-200 text-center bg-amber-50 font-bold text-[9px] text-amber-800 py-1 uppercase">Plan</td>
                            {visibleWeeks.map(w => {
                              const planValue = Array.isArray(task.weeks) ? (task.weeks.includes(w) ? 1 : undefined) : (task.weeks ? task.weeks[w] : undefined);
                              const isPlanned = planValue !== undefined && planValue > 0;
                              return (
                                <td key={w} className={`border-r border-slate-200 text-center text-[10px] font-bold ${isPlanned ? 'bg-amber-100 text-amber-800' : 'bg-white'}`}>{isPlanned ? planValue : ''}</td>
                              );
                            })}
                          </tr>
                          
                          <tr className="border-b border-slate-300 hover:bg-slate-50 text-slate-700">
                            <td className="border-r border-slate-200 text-center font-bold bg-emerald-100 text-emerald-900">{task.actual || 0}</td>
                            <td className="border-r border-slate-200 text-center bg-emerald-50 font-bold text-[9px] text-emerald-800 py-1 uppercase">Actual</td>
                            {visibleWeeks.map(w => {
                              const actualValue = task.actualWeeks ? task.actualWeeks[w] : undefined;
                              const isActual = actualValue !== undefined && actualValue > 0;
                              return (
                                <td key={w} className={`border-r border-slate-200 text-center text-[10px] font-bold ${isActual ? 'bg-emerald-500 text-white font-extrabold' : 'bg-white'}`}>{isActual ? actualValue : ''}</td>
                              );
                            })}
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}