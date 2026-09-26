import React, { useState, useEffect, useRef } from 'react';
// Mengimpor database eksternal
import {
  INITIAL_TASKS, MONTH_TO_WEEKS, TAB_WEEK_MAPPING, WEEK_DATES, PREDEFINED_ACTIVITIES
} from './database';

// Mengimpor komponen modular eksternal
import Splashscreen from './components/Splashscreen';
import Login from './components/Login';
import LogAktivitas from './components/LogAktivitas';
import Modals from './components/Modals';

// Daftar Nomor Indeks Kegiatan Standar per Kategori Utama
const CATEGORY_INDEXES = {
  '1': ["1.1", "1.2", "1.3", "1.4"],
  '2': ["2.1", "2.2"],
  '3': ["3.1", "3.2", "3.3", "3.4"],
  '4': ["4.1", "4.2", "4.3", "4.4"],
  '5': ["5.1", "5.2"],
  '6': ["6.1"],
  '7': ["7"]
};

// FUNGSI BANTUAN: Menghasilkan tanggal mingguan dinamis berdasarkan tahun terpilih (Senin - Minggu)
function generateWeekDates(year) {
  const dates = {};
  const yearNum = parseInt(year);
  let current = new Date(yearNum, 0, 1);
  
  // Jika 1 Januari bukan hari Senin, hitung sisa hari menuju hari Senin pertama
  let firstDay = current.getDay();
  let daysToNextMonday = firstDay === 1 ? 7 : (firstDay === 0 ? 1 : 8 - firstDay);
  
  // Minggu ke-1 (pendek / parsial dari 1 Jan s.d hari Minggu pertama)
  let week1End = new Date(current);
  week1End.setDate(current.getDate() + (daysToNextMonday - 1));
  
  dates[1] = `${String(current.getDate()).padStart(2, '0')}/${String(current.getMonth() + 1).padStart(2, '0')}-${String(week1End.getDate()).padStart(2, '0')}/${String(week1End.getMonth() + 1).padStart(2, '0')}`;
  
  // Mulai minggu ke-2 (hari Senin pertama di tahun tersebut)
  current = new Date(week1End);
  current.setDate(current.getDate() + 1);
  
  for (let w = 2; w <= 53; w++) {
    let start = new Date(current);
    let end = new Date(current);
    end.setDate(end.getDate() + 6);
    
    // Batasi hari terakhir di 31 Desember agar tidak melompat ke tahun berikutnya
    if (end.getFullYear() > yearNum) {
      end = new Date(yearNum, 11, 31);
    }
    
    const startStr = `${String(start.getDate()).padStart(2, '0')}/${String(start.getMonth() + 1).padStart(2, '0')}`;
    const endStr = `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}`;
    
    dates[w] = `${startStr}-${endStr}`;
    current.setDate(current.getDate() + 7);
  }
  return dates;
}

export default function App() {
  const [activeView, setActiveView] = useState('beranda');
  const [sidebarOpen, setSidebarOpen] = useState(true); // State Sidebar Universal (Desktop & Mobile)
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeMonthTab, setActiveMonthTab] = useState('Semua');
  
  // State Splash Screen Sekuensial Sesuai Video PLN Resmi (Tepat 3 Langkah)
  const [isOpening, setIsOpening] = useState(true);
  const [splashStep, setSplashStep] = useState(0); // 0: Blank, 1: "#1", 2: "Energy", 3: "Solutions", 4: "Company", 5: "PLN Logo"

  const [selectedYear, setSelectedYear] = useState('2026');
  const [allYearsData, setAllYearsData] = useState({ '2026': INITIAL_TASKS });

  const tasks = allYearsData[selectedYear] || [];
  const setTasks = (newTasks) => {
    setAllYearsData(prev => ({
      ...prev,
      [selectedYear]: typeof newTasks === 'function' ? newTasks(prev[selectedYear]) : newTasks
    }));
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPic, setFilterPic] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || 'guest');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('k3l_dark_mode') === 'true');

  // STATE: Menampung konfigurasi nomor WA targets di Profil Admin
  const [adminPhone, setAdminPhone] = useState(() => localStorage.getItem('gas_admin_phone') || '');

  const [formCategory, setFormCategory] = useState('1');
  const [formCategoryCustom, setFormCategoryCustom] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [formPic, setFormPic] = useState('');
  const [formNo, setFormNo] = useState('');
  const [formNoCustom, setFormNoCustom] = useState('');
  const [formSub, setFormSub] = useState(''); // State untuk huruf Sub standar (A, B, C...)
  const [formSubCustom, setFormSubCustom] = useState(''); // State untuk input manual jika memilih Sub "Lainnya"
  const [formActivitySelect, setFormActivitySelect] = useState('');
  const [formActivityCustom, setFormActivityCustom] = useState('');
  const [isCustomActivity, setIsCustomActivity] = useState(false);
  const [formMonths, setFormMonths] = useState([]);
  const [formWeeks, setFormWeeks] = useState({});
  const [formLink, setFormLink] = useState('');

  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [newYearModalOpen, setNewYearModalOpen] = useState(false);
  const [inputNewYear, setInputNewYear] = useState('');
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifDropdownRef = useRef(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editNo, setEditNo] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editPic, setEditPic] = useState('');
  const [editCategory, setEditCategory] = useState('1');
  const [editMonths, setEditMonths] = useState([]);
  const [editWeeks, setEditWeeks] = useState({});

  const GAS_URL = '/gas';
  const DEFAULT_SPS_URL = 'https://docs.google.com/spreadsheets/d/1RAXGeY1kGDS9RWPj-ktILv_LUA-ZKqr1duhCK61iaTk/edit?gid=1863440814#gid=1863440814';
  const [spsUrl, setSpsUrl] = useState(localStorage.getItem('gas_sps_url') || DEFAULT_SPS_URL);
  const [webAppUrl, setWebAppUrl] = useState(GAS_URL);
  const [realisasiModal, setRealisasiModal] = useState({
    show: false,
    taskId: null,
    no: '',
    pic: '',
    activity: '',
    category: '',
    selectedWeek: 1,
    value: 0,
    weeks: {},
    actualWeeks: {}
  });

  // Tema tampilan: disimpan lokal agar pilihan pengguna tetap sama setelah refresh
  useEffect(() => {
    localStorage.setItem('k3l_dark_mode', String(isDarkMode));
    document.documentElement.classList.toggle('k3l-dark', isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
  }, [isDarkMode]);

  // Helper komunikasi tunggal ke Google Apps Script melalui Vite proxy
  const requestGAS = async ({ method = 'GET', params = {}, body = null } = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${GAS_URL}?${query}` : GAS_URL;

    const options = { method };
    if (body !== null) {
      options.headers = { 'Content-Type': 'text/plain;charset=utf-8' };
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const text = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Respons server bukan JSON: ${text.slice(0, 200)}`);
    }
  };

  // Memuat data berdasarkan tahun dari Google Sheets
  const fetchDataFromGAS = async (year = selectedYear, silent = false) => {
    if (!silent) setIsDataLoading(true);

    try {
      const result = await requestGAS({
        method: 'GET',
        params: { action: 'read', year }
      });

      if (result?.status === 'success' && Array.isArray(result.data)) {
        setAllYearsData(prev => ({ ...prev, [year]: result.data }));
        if (!silent) showToast(`Sinkronisasi data Google Sheets ${year} berhasil!`, 'success');
        return result.data;
      }

      throw new Error(result?.message || 'Data Google Sheets tidak valid.');
    } catch (err) {
      console.error('GAS Read Error:', err);
      if (!silent) showToast('Gagal terhubung ke Google Sheets.', 'error');
      return null;
    } finally {
      if (!silent) setIsDataLoading(false);
    }
  };

  // Splash screen + sinkronisasi awal
  useEffect(() => {
    const step1 = setTimeout(() => setSplashStep(1), 200);
    const step2 = setTimeout(() => setSplashStep(2), 800);
    const step3 = setTimeout(() => setSplashStep(3), 1400);
    const step4 = setTimeout(() => setSplashStep(4), 1800);
    const step5 = setTimeout(() => setSplashStep(5), 2200);

    fetchDataFromGAS('2026', true);

    const finish = setTimeout(() => {
      setSplashStep(6);
      setIsOpening(false);
    }, 3700);

    return () => {
      clearTimeout(step1); clearTimeout(step2); clearTimeout(step3);
      clearTimeout(step4); clearTimeout(step5); clearTimeout(finish);
    };
  }, []);

  // Muat ulang data saat tahun diganti
  useEffect(() => {
    if (!isOpening) fetchDataFromGAS(selectedYear, false);
  }, [selectedYear, isOpening]);

  // Tutup dropdown notifikasi otomatis saat pengguna klik di luar area notifikasi
  useEffect(() => {
    const handleClickOutsideNotification = (event) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setNotifDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideNotification);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotification);
    };
  }, []);

  // Hak akses Tamu: cegah akses ke halaman/aksi khusus Admin dari state lama.
  useEffect(() => {
    const adminOnlyViews = ['log', 'entri-baru'];

    if (userRole !== 'admin') {
      if (adminOnlyViews.includes(activeView)) {
        setActiveView('beranda');
      }

      setNotifDropdownOpen(false);
      setSettingsModalOpen(false);
      setEditModalOpen(false);
      setNewYearModalOpen(false);
      setRealisasiModal(prev => prev?.show ? { ...prev, show: false } : prev);
    }
  }, [userRole, activeView]);

  // PENYELARASAN: Pendeteksi otomatis parameter link WA (?update_task=X) untuk membuka modal secara instan
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const updateTaskId = params.get('update_task');
    if (updateTaskId && tasks.length > 0) {
      window.history.replaceState({}, document.title, window.location.pathname);

      // Link pembaruan realisasi hanya boleh membuka aksi tulis untuk Admin.
      if (userRole !== 'admin') {
        setActiveView('formulir-list');
        showToast('Akun Tamu hanya memiliki akses lihat saja.', 'info');
        return;
      }

      const taskToUpdate = tasks.find(t => String(t.id) === updateTaskId);
      if (taskToUpdate) {
        setActiveView('formulir-list');
        openRealisasiModal(taskToUpdate);
      }
    }
  }, [tasks, userRole]);

  // Semua aksi tulis memakai satu jalur proxy yang sama
  const syncWithGAS = async (action, payload = {}, yearOverride = selectedYear) => {
    const adminOnlyActions = new Set([
      'add',
      'edit',
      'delete',
      'create_year',
      'delete_year',
      'send_wa',
      'update_actual'
    ]);

    if (adminOnlyActions.has(action) && userRole !== 'admin') {
      showToast('Akses ditolak. Akun Tamu hanya dapat melihat data.', 'error');
      return { success: false, result: { status: 'error', message: 'Akses ditolak.' } };
    }

    try {
      const result = await requestGAS({
        method: 'POST',
        body: { action, year: yearOverride, ...payload }
      });

      if (result?.status === 'success') return { success: true, result };

      console.error('GAS Action Error:', result);
      showToast(result?.message || 'Aksi Google Sheets gagal.');
      return { success: false, result };
    } catch (err) {
      console.error('GAS Sync Error:', err);
      showToast('Gagal terhubung ke Google Sheets.');
      return { success: false, error: err };
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      showToast('Memverifikasi akun Anda...');
      const result = await requestGAS({
        method: 'POST',
        body: {
          action: 'login',
          email: formEmail,
          password: formPassword
        }
      });

      if (result?.status === 'success') {
        setIsLoggedIn(true);
        setUserRole(result.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', result.role);
        showToast(`Login berhasil! Selamat datang, ${result.role === 'admin' ? 'Administrator' : 'Tamu'}`);
      } else {
        alert(result?.message || 'Alamat email atau kata sandi Anda salah!');
        showToast(result?.message || 'Email atau password salah!');
      }
    } catch (err) {
      console.error('Login Error:', err);
      showToast('Koneksi autentikasi gagal.');
    }
  };

  const showToast = (message, type) => {
    const normalizedMessage = String(message || '');
    let resolvedType = type;

    if (!resolvedType) {
      if (/gagal|salah|error|tidak ditemukan|tidak valid|mohon|harus/i.test(normalizedMessage)) {
        resolvedType = 'error';
      } else if (/berhasil|tersimpan|disimpan|diperbarui|dihapus|ditambahkan|dikirim|selamat datang/i.test(normalizedMessage)) {
        resolvedType = 'success';
      } else {
        resolvedType = 'info';
      }
    }

    setToast({ show: true, message: normalizedMessage, type: resolvedType });
    setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
  };

  // Logout terpusat: hanya hapus sesi login, jangan menghapus pengaturan sistem.
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');

    setIsLoggedIn(false);
    setUserRole('guest');
    setProfileModalOpen(false);
    setSettingsModalOpen(false);
    setNotifDropdownOpen(false);
    setActiveView('beranda');
    setFormEmail('');
    setFormPassword('');

    showToast('Anda berhasil keluar dari akun.');
  };

  // KIRIM PENGINGAT WA melalui backend Apps Script
  const sendRealWhatsAppAutomated = async (task) => {
    if (userRole !== 'admin') { showToast('Akses ditolak.', 'error'); return; }
    if (!adminPhone) {
      showToast('Gagal mengirim WA: daftarkan nomor WhatsApp di Profil Admin terlebih dahulu.');
      return;
    }

    const webLink = `${window.location.origin}${window.location.pathname}?update_task=${task.id}`;
    const messageText = `Halo Rekan K3L (${task.pic}),\n\n*PENGINGAT PROGRAM K3L MINGGU INI*\n\nAgenda: *"${task.title}"*\nMATLEV KAM: *${task.no}*\nTarget Plan: *${task.target}*\nRealisasi Sekarang: *${task.actual || 0}*\n\nApakah agenda ini sudah dilakukan?\nJika sudah, silakan laporkan/ubah realisasinya melalui tautan berikut:\n${webLink}\n\nTerima kasih,\nSistem Monitoring K3L PLN`;

    showToast('Mengirim WhatsApp otomatis...');
    const { success, result } = await syncWithGAS('send_wa', {
      phone: adminPhone.trim(),
      message: messageText
    });

    if (success) {
      showToast(`Pesan pengingat dikirim ke ${adminPhone}.`);
    } else {
      showToast(result?.message || 'Gagal mengirim WhatsApp.');
    }
  };

  // Simpan nilai realisasi per minggu lalu hitung ulang total & status kegiatan
  const handleSaveRealisasi = async (taskId, week, newValue) => {
    if (userRole !== 'admin') { showToast('Akses ditolak.', 'error'); return; }
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) {
      showToast('Kegiatan tidak ditemukan.');
      return;
    }

    const weekNumber = Number(week);
    const cleanValue = Math.max(0, Number(newValue || 0));
    const newActualWeeks = {
      ...(targetTask.actualWeeks || {}),
      [weekNumber]: cleanValue
    };

    // Nilai 0 tidak perlu disimpan sebagai entri mingguan aktif.
    if (cleanValue === 0) delete newActualWeeks[weekNumber];

    const newActual = Object.values(newActualWeeks)
      .reduce((sum, value) => sum + Number(value || 0), 0);

    const calculatedTarget = Object.values(targetTask.weeks || {})
      .reduce((sum, value) => sum + Number(value || 0), 0);

    const newStatus = calculatedTarget > 0 && newActual >= calculatedTarget
      ? 'Selesai'
      : newActual > 0
        ? 'Dalam Proses'
        : 'Belum Mulai';

    const updatedTask = {
      ...targetTask,
      actual: newActual,
      actualWeeks: newActualWeeks,
      status: newStatus
    };

    showToast('Menyimpan realisasi...');
    const { success } = await syncWithGAS('edit', updatedTask);
    if (!success) return;

    // Tetap perbarui state lokal agar UI langsung berubah walau sinkronisasi read belum tersedia.
    setTasks(prev => prev.map(task => task?.id === taskId ? updatedTask : task));
    await fetchDataFromGAS(selectedYear, true);

    setRealisasiModal({
      show: false,
      taskId: null,
      no: '',
      pic: '',
      activity: '',
      category: '',
      selectedWeek: 1,
      value: 0,
      weeks: {},
      actualWeeks: {}
    });

    showToast('Realisasi berhasil diperbarui!');
  };

  // Membuka modal realisasi dengan minggu pertama yang memang memiliki target.
  const openRealisasiModal = (task) => {
    if (userRole !== 'admin') { showToast('Akun Tamu hanya memiliki akses lihat saja.', 'info'); return; }
    if (!task) return;

    const weeksObject = Array.isArray(task.weeks)
      ? task.weeks.reduce((acc, week) => ({ ...acc, [Number(week)]: 1 }), {})
      : { ...(task.weeks || {}) };

    const plannedWeeks = Object.keys(weeksObject)
      .map(Number)
      .filter(week => Number(weeksObject[week] || 0) > 0)
      .sort((a, b) => a - b);

    const firstWeek = plannedWeeks[0] || 1;
    const actualWeeks = { ...(task.actualWeeks || {}) };

    setRealisasiModal({
      show: true,
      taskId: task.id,
      no: `${task.no || ''}${task.subNo ? ` ${task.subNo}` : ''}`.trim(),
      pic: task.pic || 'Petugas K3L',
      activity: task.title || '',
      category: task.category || 'Kategori Program',
      selectedWeek: firstWeek,
      value: Number(actualWeeks[firstWeek] || 0),
      weeks: weeksObject,
      actualWeeks
    });
  };

  const handleDeleteTask = (taskId) => {
  if (userRole !== 'admin') { showToast('Akses ditolak.', 'error'); return; }
  const deletedTask = tasks.find(t => t.id === taskId);

  if (!deletedTask) {
    showToast("Kegiatan tidak ditemukan.");
    return;
  }

  const confirmed = window.confirm(
    `Apakah Anda yakin ingin menghapus kegiatan "${deletedTask.title}"?`
  );

  if (!confirmed) return;

  const updated = tasks.filter(t => t.id !== taskId);
  setTasks(updated);

  if (webAppUrl) {
    syncWithGAS("delete", { id: deletedTask.id });
  }

  showToast("Kegiatan berhasil dihapus!");
};

  const openEditModal = (task) => {
    if (userRole !== 'admin') { showToast('Akun Tamu hanya memiliki akses lihat saja.', 'info'); return; }
    setEditTaskId(task.id);
    setEditNo(task.no);
    setEditTitle(task.title);
    setEditPic(task.pic);
    const catNum = task.categoryNum.charAt(0);
    setEditCategory(catNum || '1');
    setEditMonths(task.months || []);
    
    const weeksObj = {};
    if (Array.isArray(task.weeks)) {
      task.weeks.forEach(w => { weeksObj[w] = 1; });
    } else {
      Object.assign(weeksObj, task.weeks);
    }
    setEditWeeks(weeksObj);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (userRole !== 'admin') { showToast('Akses ditolak.', 'error'); return; }
    if (!editTitle || !editPic || !editNo) {
      showToast("Mohon lengkapi seluruh kolom!"); return;
    }
    if (Object.keys(editWeeks).length === 0) {
      showToast("Mohon pilih minimal satu minggu pelaksanaan!"); return;
    }

    const categoryNames = {
      '1': { main: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN", num: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN" },
      '2': { main: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN", num: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN" },
      '3': { main: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN", num: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN" },
      '4': { main: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", num: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN" },
      '5': { main: "5. KOMPETENSI DAN PELATIHAN", num: "5. KOMPETENSI DAN PELATIHAN" },
      '6': { main: "6. PELAPORAN", num: "6. PELAPORAN" },
      '7': { main: "7. PROGRAM PENDUKUNG", num: "7. PROGRAM PENDUKUNG" }
    };

    const selectedCat = categoryNames[editCategory] || categoryNames['1'];
    const calculatedTarget = Object.values(editWeeks).reduce((sum, v) => sum + v, 0);

    const originalTask = tasks.find(task => task.id === editTaskId);
    if (!originalTask) {
      showToast('Kegiatan yang akan diedit tidak ditemukan.');
      return;
    }

    const updated = {
      ...originalTask,
      no: editNo.trim().toUpperCase(),
      title: editTitle,
      category: selectedCat.main,
      categoryNum: selectedCat.num,
      pic: editPic,
      target: calculatedTarget,
      months: editMonths,
      weeks: editWeeks
    };

    showToast('Menyimpan perubahan ke Google Sheets...');
    const { success } = await syncWithGAS('edit', updated);
    if (!success) return;

    await fetchDataFromGAS(selectedYear, true);
    showToast('Kegiatan diperbarui!');
    setEditModalOpen(false);
    setEditTaskId(null);
  };

  const getNextCategoryNumber = () => {
    const categoryNums = tasks.map(t => {
      if (!t) return 7;
      const match = t.categoryNum ? t.categoryNum.match(/^(\d+)/) : null;
      return match ? parseInt(match[1]) : 7;
    });
    const maxNum = categoryNums.length > 0 ? Math.max(...categoryNums) : 7;
    return maxNum + 1;
  };

  const handleCreateNewYear = async () => {
    if (userRole !== 'admin') { showToast('Akses ditolak.', 'error'); return; }
    const newYear = String(inputNewYear || '').trim();
    const sourceYear = String(selectedYear || '2026');

    if (!newYear) return;
    if (!/^\d{4}$/.test(newYear)) {
      showToast('Tahun harus terdiri dari 4 digit, contoh: 2027.');
      return;
    }
    if (allYearsData[newYear]) {
      showToast('Tahun tersebut sudah terdaftar!');
      return;
    }

    showToast(`Membuat Tab Sheet Tahun ${newYear}...`);
    const { success, result } = await syncWithGAS('create_year', {
      year: newYear,
      sourceYear
    }, newYear);

    if (!success) {
      showToast(result?.message || `Gagal membuat tahun ${newYear}.`);
      return;
    }

    setAllYearsData(prev => ({ ...prev, [newYear]: [] }));
    setSelectedYear(newYear);
    setNewYearModalOpen(false);
    setInputNewYear('');
    await fetchDataFromGAS(newYear, true);
    showToast(`Tahun ${newYear} berhasil dibuat.`);
  };

  // PEMUTAKHIRAN: Hapus tahun sekarang otomatis mengirimkan instruksi 'delete_year' ke Google Sheets
  const handleDeleteYear = async (yearToDelete) => {
    if (userRole !== 'admin') { showToast('Akses ditolak.', 'error'); return; }
    const availableYears = Object.keys(allYearsData);
    if (availableYears.length <= 1) {
      showToast('Gagal: harus menyisakan minimal satu tahun aktif.');
      return;
    }
    if (yearToDelete === '2026') {
      showToast('Tahun default 2026 tidak boleh dihapus.');
      return;
    }

    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus seluruh data dan TAB SHEET Tahun ${yearToDelete} secara permanen?`);
    if (!confirmed) return;

    showToast(`Menghapus Tab Sheet Tahun ${yearToDelete}...`);
    const { success, result } = await syncWithGAS('delete_year', { year: yearToDelete }, yearToDelete);
    if (!success) {
      showToast(result?.message || `Gagal menghapus tahun ${yearToDelete}.`);
      return;
    }

    const updatedYearsData = { ...allYearsData };
    delete updatedYearsData[yearToDelete];
    setAllYearsData(updatedYearsData);
    const remainingYears = Object.keys(updatedYearsData).sort();
    setSelectedYear(remainingYears[0] || '2026');
    showToast(`Tahun ${yearToDelete} berhasil dihapus.`);
  };

  const handleCategoryChange = (val) => {
    setFormCategory(val);
    setFormNo(''); 
    setFormNoCustom(''); 
    setFormSub(''); 
    setFormSubCustom(''); 
    setFormActivitySelect('');
    setFormActivityCustom('');
    setIsCustomActivity(false);
    if (val === 'Lainnya') {
      setIsCustomCategory(true);
      setIsCustomActivity(true);
      setFormActivitySelect('Lainnya');
      
      const nextNum = getNextCategoryNumber();
      setFormNoCustom(`${nextNum}.`);
    } else {
      setIsCustomCategory(false);
      setFormCategoryCustom('');
    }
  };

  const handleActivitySelectChange = (val) => {
    setFormActivitySelect(val);
    if (val === 'Lainnya') { setIsCustomActivity(true); } else { setIsCustomActivity(false); setFormActivityCustom(''); }
  };

  const handleMonthChange = (month, checked) => {
    if (checked) { setFormMonths([...formMonths, month]); } else {
      setFormMonths(formMonths.filter(x => x !== month));
      const weeksToRemove = MONTH_TO_WEEKS[month] || [];
      setFormWeeks(prev => { const next = { ...prev }; weeksToRemove.forEach(w => delete next[w]); return next; });
    }
  };

  const handleWeekValueChange = (week, value) => {
    setFormWeeks(prev => { const next = { ...prev }; if (value > 0) { next[week] = value; } else { delete next[week]; } return next; });
  };

  const handleEditMonthChange = (month, checked) => {
    if (checked) { setEditMonths([...editMonths, month]); } else {
      setEditMonths(editMonths.filter(x => x !== month));
      const weeksToRemove = MONTH_TO_WEEKS[month] || [];
      setEditWeeks(prev => { const next = { ...prev }; weeksToRemove.forEach(w => delete next[w]); return next; });
    }
  };

  const handleEditWeekValueChange = (week, value) => {
    setEditWeeks(prev => { const next = { ...prev }; if (value > 0) { next[week] = value; } else { delete next[week]; } return next; });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (userRole !== 'admin') { showToast('Akses ditolak.', 'error'); return; }
    const finalActivity = isCustomActivity ? formActivityCustom : formActivitySelect;
    const finalCategory = isCustomCategory ? formCategoryCustom : formCategory;
    const finalNo = (isCustomCategory || formNo === 'Lainnya') ? formNoCustom : formNo;
    const finalSub = formSub === 'Lainnya' ? formSubCustom : formSub;
    
    if (!finalActivity || !formPic || !finalNo || (isCustomCategory && !formCategoryCustom)) {
      showToast("Mohon lengkapi seluruh kolom formulir!"); return;
    }
    if (Object.keys(formWeeks).length === 0) {
      showToast("Mohon pilih minimal satu minggu pelaksanaan!"); return;
    }

    const categoryNames = {
      '1': { main: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN", num: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN" },
      '2': { main: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN", num: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN" },
      '3': { main: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN", num: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN" },
      '4': { main: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", num: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN" },
      '5': { main: "5. KOMPETENSI DAN PELATIHAN", num: "5. KOMPETENSI DAN PELATIHAN" },
      '6': { main: "6. PELAPORAN", num: "6. PELAPORAN" },
      '7': { main: "7. PROGRAM PENDUKUNG", num: "7. PROGRAM PENDUKUNG" }
    };

    const selectedCat = categoryNames[formCategory] || categoryNames['1'];
    const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t ? t.id : 1)) + 1 : 1;
    let categoryMain = isCustomCategory ? formCategoryCustom : selectedCat.main;
    let categoryNum = isCustomCategory ? formCategoryCustom : selectedCat.num;
    const calculatedTarget = Object.values(formWeeks || {}).reduce((sum, v) => sum + v, 0);

    const newTask = {
      id: newId, iso45001: "", pp50: "", matlevKam: "", no: finalNo.trim().toUpperCase(), subNo: finalSub.trim().toUpperCase(),
      title: finalActivity, category: categoryMain, categoryNum: categoryNum, pic: formPic, biaya: "-",
      target: calculatedTarget, actual: 0, status: "Belum Mulai", prosedur: "-", folder: "-", link: formLink,
      months: formMonths, weeks: formWeeks, actualWeeks: {}
    };

    showToast("Menyimpan kegiatan ke Google Sheets...");
    const { success } = await syncWithGAS("add", newTask);
    if (!success) return;

    await fetchDataFromGAS(selectedYear, true);
    showToast("Kegiatan baru berhasil ditambahkan!");

    setFormNo(''); setFormNoCustom(''); setFormSub(''); setFormSubCustom(''); setFormActivitySelect(''); setFormActivityCustom(''); setIsCustomActivity(false);
    setFormPic(''); setFormLink(''); setFormMonths([]); setFormWeeks({}); setFormCategory('1');
    setFormCategoryCustom(''); setIsCustomCategory(false); setActiveView('formulir-list'); 
  };

  // PEMUTAKHIRAN PDF: Langsung membuka jendela ekspor PDF resmi langsung dari Google Sheets! (Landscape, A4 & Rapi)
  const exportToPdf = () => {
    showToast("Mempersiapkan dokumen PDF resmi dari Google Sheets...");
    
    const spreadsheetId = "1RAXGeY1kGDS9RWPj-ktILv_LUA-ZKqr1duhCK61iaTk";
    const gid = "1863440814"; 
    
    const pdfUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=pdf` +
                   `&gid=${gid}` +
                   `&size=A4` +             // Ukuran Kertas A4
                   `&portrait=false` +      // Landscape agar tabel mendatar muat sempurna
                   `&fitw=true` +           // Fit to width agar kolom muat mendatar
                   `&gridlines=true` +      // Tampilkan garis kotak tabel agar rapi
                   `&fzr=true`;             // Bekukan baris header agar rapi
                   
    window.open(pdfUrl, '_blank');
  };

  const getTabWeeks = (tab) => {
    if (tab === 'Semua') return Array.from({ length: 53 }, (_, i) => i + 1);
    if (tab === 'TW 1') return Array.from({ length: 13 }, (_, i) => i + 1);
    if (tab === 'TW 2') return Array.from({ length: 13 }, (_, i) => i + 14);
    if (tab === 'TW 3') return Array.from({ length: 13 }, (_, i) => i + 27);
    if (tab === 'TW 4') return Array.from({ length: 14 }, (_, i) => i + 40);
    if (tab === 'Semester 1') return Array.from({ length: 26 }, (_, i) => i + 1);
    if (tab === 'Semester 2') return Array.from({ length: 27 }, (_, i) => i + 27);
    return TAB_WEEK_MAPPING[tab] || Array.from({ length: 53 }, (_, i) => i + 1);
  };

  // Filter global berdasarkan periode minggu TW / Semester
  const isTaskInWeeks = (task, weeksList) => {
    if (!task || !task.weeks) return false;
    return Object.keys(task.weeks).some(w => {
      const weekNum = Number(w);
      return weeksList.includes(weekNum) && task.weeks[w] > 0;
    });
  };

  const visibleWeeks = getTabWeeks(activeMonthTab);

  // Menyaring data program secara global berdasarkan filter periode
  const periodFilteredTasks = tasks.filter(task => {
    if (activeMonthTab === 'Semua') return true;
    return isTaskInWeeks(task, visibleWeeks);
  });

  // Ganti data statis dasbor agar otomatis menghitung data terfilter periode!
  const totalActivities = periodFilteredTasks.filter(Boolean).length;
  const completedActivities = periodFilteredTasks.filter(t => t && t.status === "Selesai").length;
  const inProgressActivities = periodFilteredTasks.filter(t => t && t.status === "Dalam Proses").length;
  const notStartedActivities = periodFilteredTasks.filter(t => t && t.status === "Belum Mulai").length;
  
  const completedPercent = totalActivities > 0 ? ((completedActivities / totalActivities) * 100).toFixed(0) : 0;
  const inProgressPercent = totalActivities > 0 ? ((inProgressActivities / totalActivities) * 100).toFixed(0) : 0;
  const notStartedPercent = totalActivities > 0 ? ((notStartedActivities / totalActivities) * 100).toFixed(0) : 0;
  const compliancePercentage = totalActivities > 0 ? ((completedActivities / totalActivities) * 100).toFixed(1) : "0.0";

  const categoriesList = [
    "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN", "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN",
    "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN", "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",
    "5. KOMPETENSI DAN PELATIHAN", "6. PELAPORAN", "7. PROGRAM PENDUKUNG"
  ];

  // Hitung Kepatuhan Bulanan secara Dinamis untuk Grafik Tren Bulanan
  const getMonthlyCompliance = (month) => {
    const monthWeeks = MONTH_TO_WEEKS[month] || [];
    
    // Cari kegiatan yang terjadwal di bulan ini
    const monthTasks = tasks.filter(t => {
      if (!t || !t.weeks) return false;
      return Object.keys(t.weeks).some(w => monthWeeks.includes(Number(w)) && t.weeks[w] > 0);
    });
    
    const total = monthTasks.length;
    if (total === 0) return 0;
    
    // Hitung kegiatan yang selesai di bulan ini (Actual >= Plan)
    const completed = monthTasks.filter(t => {
      const planSum = monthWeeks.reduce((sum, w) => sum + Number(t.weeks[w] || 0), 0);
      const actualSum = monthWeeks.reduce((sum, w) => sum + Number(t.actualWeeks[w] || 0), 0);
      return actualSum >= planSum;
    }).length;
    
    return Math.round((completed / total) * 100);
  };

  const getChartMonths = (tab) => {
    if (tab === 'TW 1') return ['Jan', 'Feb', 'Mar'];
    if (tab === 'TW 2') return ['Apr', 'Mei', 'Jun'];
    if (tab === 'TW 3') return ['Jul', 'Agu', 'Sep'];
    if (tab === 'TW 4') return ['Okt', 'Nov', 'Des'];
    if (tab === 'Semester 1') return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
    if (tab === 'Semester 2') return ['Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    // Default 'Semua' / Bulan tunggal
    if (tab !== 'Semua' && MONTH_TO_WEEKS[tab.slice(0,3)]) {
      return [tab.slice(0,3)];
    }
    return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  };

  const chartMonths = getChartMonths(activeMonthTab);
  const chartSubtitle = activeMonthTab === 'Semua' ? `Jan - Des ${selectedYear}` : `${chartMonths[0]} - ${chartMonths[chartMonths.length - 1]} ${selectedYear}`;

  const monthlyStats = chartMonths.map(month => {
    const percent = getMonthlyCompliance(month);
    return { month: month.toUpperCase(), val: `${percent}%` };
  });

  const categoryComplianceStats = categoriesList.map(cat => {
    const catTasks = periodFilteredTasks.filter(t => t && t.categoryNum === cat); const total = catTasks.length;
    const completed = catTasks.filter(t => t && t.status === "Selesai").length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { name: cat, total, completed, percent };
  });

  // Filter pencarian dan status di formulir pemantauan (menggunakan periodFilteredTasks!)
  const filteredTasks = periodFilteredTasks.filter(task => {
    if (!task) return false;
    const title = task.title || "";
    const category = task.category || "";
    
    const matchesSearch = title.toLowerCase().includes((searchQuery || "").toLowerCase()) || 
                          category.toLowerCase().includes((searchQuery || "").toLowerCase());
    const matchesPic = filterPic === 'all' || task.pic === filterPic;
    const matchesCategory = filterCategory === 'all' || task.categoryNum === filterCategory;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesPic && matchesCategory && matchesStatus;
  });

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    if (task && task.categoryNum) {
      const group = groups[task.categoryNum] || []; group.push(task); groups[task.categoryNum] = group;
    }
    return groups;
  }, {});

  // Subtitle dinamis untuk bagian Dashboard Beranda
  const getPeriodSubtitle = (tab, year) => {
    if (tab === 'Semua') return `Periode: Jan - Des ${year}`;
    if (tab === 'TW 1') return `Periode: TW 1 (M1 - M13) ${year}`;
    if (tab === 'TW 2') return `Periode: TW 2 (M14 - M26) ${year}`;
    if (tab === 'TW 3') return `Periode: TW 3 (M27 - M39) ${year}`;
    if (tab === 'TW 4') return `Periode: TW 4 (M40 - M53) ${year}`;
    if (tab === 'Semester 1') return `Periode: Semester 1 (M1 - M26) ${year}`;
    if (tab === 'Semester 2') return `Periode: Semester 2 (M27 - M53) ${year}`;
    return `Periode: Bulan ${tab} ${year}`;
  };

  if (isOpening) { return <Splashscreen splashStep={splashStep} />; }

  if (!isLoggedIn) {
    return (
      <Login 
        formEmail={formEmail} setFormEmail={setFormEmail} formPassword={formPassword} setFormPassword={setFormPassword}
        showPassword={showPassword} setShowPassword={setShowPassword} handleLoginSubmit={handleLoginSubmit}
        setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} showToast={showToast}
      />
    );
  }

  return (
    <div className="k3l-app bg-[#f6f8fc] font-body-md text-on-surface min-h-screen flex animate-fade-in text-left transition-colors duration-300">
      <style>{`
        .k3l-dark body, .k3l-dark .k3l-app { background:#0b1220 !important; color:#e5edf8 !important; }
        .k3l-dark .bg-white,
        .k3l-dark .bg-surface,
        .k3l-dark .bg-surface-container-lowest { background:#111b2e !important; }
        .k3l-dark .bg-surface-container,
        .k3l-dark .bg-surface-container-low { background:#0f1929 !important; }
        .k3l-dark .bg-surface-container-high,
        .k3l-dark .bg-slate-50,
        .k3l-dark .bg-slate-100 { background:#18243a !important; }
        .k3l-dark .text-on-surface,
        .k3l-dark .text-on-background,
        .k3l-dark .text-slate-900,
        .k3l-dark .text-slate-800,
        .k3l-dark .text-slate-700 { color:#e7eef9 !important; }
        .k3l-dark .text-on-surface-variant,
        .k3l-dark .text-slate-600,
        .k3l-dark .text-slate-500,
        .k3l-dark .text-slate-400,
        .k3l-dark .text-outline { color:#9fb0c8 !important; }
        .k3l-dark .border-outline-variant,
        .k3l-dark .border-slate-100,
        .k3l-dark .border-slate-200,
        .k3l-dark .border-slate-300 { border-color:#2a3850 !important; }
        .k3l-dark input, .k3l-dark select, .k3l-dark textarea { background:#111b2e !important; color:#e7eef9 !important; border-color:#31405a !important; }
        .k3l-dark .hover\:bg-slate-100:hover, .k3l-dark .hover\:bg-slate-50:hover { background:#1a2942 !important; }
        .k3l-dark .shadow-sm, .k3l-dark .shadow, .k3l-dark .shadow-md, .k3l-dark .shadow-xl { box-shadow:0 10px 30px rgba(0,0,0,.22) !important; }
      `}</style>
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="sidebar-overlay fixed inset-0 bg-black/50 z-[45] lg:hidden transition-all duration-300"
        ></div>
      )}

      {/* SIDEBAR */}
      <aside className={`flex flex-col h-screen fixed left-0 top-0 w-56 bg-surface-container border-r border-outline-variant z-50 transition-all duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-outline-variant">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-primary text-2xl font-bold">bolt</span>
            <div>
              <h1 className="text-lg font-bold text-primary leading-tight">Monitoring K3L</h1>
              <p className="font-label-md text-label-md text-on-surface-variant">UIP3B SUMATERA</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-3 space-y-1 overflow-y-auto custom-scrollbar">
          <button onClick={() => { setActiveView('beranda'); }} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'beranda' ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
            <span className="material-symbols-outlined">home</span><span className="font-label-md">Beranda</span>
          </button>
          <button onClick={() => { setActiveView('formulir-list'); }} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'formulir-list' ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
            <span className="material-symbols-outlined">{userRole === 'admin' ? 'description' : 'view_list'}</span>
            <span className="font-label-md">{userRole === 'admin' ? 'Pemantauan Kegiatan' : 'Daftar Kegiatan'}</span>
          </button>
          {userRole === 'admin' && (
            <button onClick={() => { setActiveView('log'); }} className={`w-full flex items-center justify-start text-left gap-3 px-4 py-3 rounded-xl transition-colors ${activeView === 'log' ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <span className="material-symbols-outlined">list_alt</span><span className="font-label-md">Riwayat Aktivitas</span>
            </button>
          )}
        </nav>

        <div className="mt-auto p-md space-y-xs border-t border-outline-variant bg-surface-container-low">
          {userRole === 'admin' && (
            <button onClick={() => { setActiveView('entri-baru'); }} className="w-full flex items-center justify-start text-left gap-sm py-md px-lg bg-primary text-on-primary rounded-lg font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm">
              <span className="material-symbols-outlined">add</span><span>Tambah Kegiatan</span>
            </button>
          )}
          {userRole === 'admin' && (
            <button onClick={() => setSettingsModalOpen(true)} className="w-full flex items-center justify-start text-left gap-md p-md rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">settings</span><span className="font-label-md">Pengaturan Sistem</span>
            </button>
          )}
          <button onClick={() => { setHelpModalOpen(true); }} className="w-full flex items-center justify-start text-left gap-md p-md rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">help</span><span className="font-label-md">Pusat Bantuan</span>
          </button>
        </div>
      </aside>

      {/* BODY CONTENT */}
      <div className={`flex-grow min-h-screen flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'lg:pl-56' : 'lg:pl-0'
      }`}>
        <header className="flex flex-wrap lg:flex-nowrap justify-between items-center gap-sm px-3 sm:px-5 lg:px-6 py-2.5 bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40 shadow-sm min-h-[62px]">
          <div className="flex items-center gap-sm md:gap-md min-w-0 flex-1 lg:flex-none">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 text-on-surface-variant hover:bg-slate-100 rounded-full transition-all active:scale-95"
              title="Toggle Menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="rounded-xl border border-outline-variant bg-surface text-[11px] sm:text-xs px-sm sm:px-md h-10 font-bold focus:outline-none shadow-sm cursor-pointer border-slate-300 max-w-[118px] sm:max-w-none">
              {Object.keys(allYearsData).sort().map(yr => <option key={yr} value={yr}>Tahun {yr}</option>)}
            </select>

            {/* FILTER PERIODE GLOBAL */}
            <select value={activeMonthTab} onChange={(e) => setActiveMonthTab(e.target.value)} className="rounded-xl border border-outline-variant bg-surface text-[11px] sm:text-xs px-sm sm:px-md h-10 font-bold focus:outline-none shadow-sm cursor-pointer border-slate-300 min-w-0 max-w-[150px] sm:max-w-[220px]">
              <option value="Semua">Semua Periode</option>
              <option value="TW 1">TW 1 (M1-M13)</option>
              <option value="TW 2">TW 2 (M14-M26)</option>
              <option value="TW 3">TW 3 (M27-M39)</option>
              <option value="TW 4">TW 4 (M40-M53)</option>
              <option value="Semester 1">Semester 1 (M1-M26)</option>
              <option value="Semester 2">Semester 2 (M27-M53)</option>
              <option value="Januari">Januari</option>
              <option value="Februari">Februari</option>
              <option value="Maret">Maret</option>
              <option value="April">April</option>
              <option value="Mei">Mei</option>
              <option value="Juni">Juni</option>
              <option value="Juli">Juli</option>
              <option value="Agustus">Agustus</option>
              <option value="September">September</option>
              <option value="Oktober">Oktober</option>
              <option value="November">November</option>
              <option value="Desember">Desember</option>
            </select>

            {userRole === 'admin' && (
              <div className="hidden md:flex gap-xs">
                <button onClick={() => setNewYearModalOpen(true)} className="h-10 px-md bg-secondary text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-xs shadow"><span className="material-symbols-outlined text-sm">calendar_add_on</span><span>+ Tahun</span></button>
                {selectedYear !== '2026' && (
                  <button onClick={() => handleDeleteYear(selectedYear)} className="h-10 px-md bg-error text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-xs shadow"><span className="material-symbols-outlined text-sm">delete_sweep</span><span>Hapus {selectedYear}</span></button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <button
              type="button"
              onClick={() => setIsDarkMode(prev => !prev)}
              className="h-9 w-9 rounded-xl border border-outline-variant bg-white text-on-surface-variant hover:bg-slate-100 flex items-center justify-center transition-all active:scale-95 shadow-sm"
              title={isDarkMode ? 'Gunakan mode terang' : 'Gunakan dark mode'}
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined text-[20px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            {userRole === 'admin' && (
            <div className="relative" ref={notifDropdownRef}>
              <button onClick={() => setNotifDropdownOpen(prev => !prev)} className="relative p-sm text-on-surface-variant hover:bg-surface-container rounded-full transition-all active:scale-90"><span className="material-symbols-outlined">notifications</span>
                {tasks.filter(t => t.status !== 'Selesai').length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full animate-bounce"></span>}
              </button>
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-80 bg-white rounded-2xl shadow-xl border border-outline-variant z-[130] p-md space-y-md text-left animate-slide-up">
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm"><span className="font-bold text-sm text-on-surface">Alert Kegiatan Pending</span><span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">{tasks.filter(t => t.status !== 'Selesai').length} Pending</span></div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-sm">
                    {tasks.filter(t => t && t.status !== 'Selesai').slice(0, 5).map(task => (
                      <div key={task.id} className="p-sm hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors space-y-xs">
                        <p className="text-xs font-semibold text-on-surface-variant line-clamp-1">{task.title}</p>
                        <p className="text-[10px] text-outline">PIC: {task.pic} | Status: {task.status}</p>
                        {userRole === 'admin' && (
                          <button onClick={() => { setNotifDropdownOpen(false); sendRealWhatsAppAutomated(task); }} className="w-full py-1 text-center bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-[10px] font-bold transition-all">Kirim Pengingat WA</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            )}

            <button onClick={() => setProfileModalOpen(true)} className={`flex items-center gap-sm ${userRole === 'admin' ? 'pl-md border-l border-outline-variant' : ''} hover:bg-slate-100 p-1.5 rounded-xl transition-all active:scale-95 text-left`}>
              <div className="text-right hidden sm:block">
                <p className="font-label-md text-label-md font-bold text-on-surface">{userRole === 'admin' ? 'Admin UPT' : 'Tamu UPT'}</p>
                <p className="text-[10px] text-outline">Tanjung Karang</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm border border-outline-variant"><span className="material-symbols-outlined">account_circle</span></div>
            </button>
          </div>
        </header>

        {userRole === 'admin' && (
          <div className="md:hidden sticky top-[64px] z-30 bg-white/95 backdrop-blur border-b border-outline-variant px-3 py-2 flex gap-2 overflow-x-auto">
            <button onClick={() => setNewYearModalOpen(true)} className="shrink-0 h-9 px-3 bg-secondary text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm">
              <span className="material-symbols-outlined text-sm">calendar_add_on</span>+ Tahun
            </button>
            {selectedYear !== '2026' && (
              <button onClick={() => handleDeleteYear(selectedYear)} className="shrink-0 h-9 px-3 bg-error text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-sm">delete_sweep</span>Hapus {selectedYear}
              </button>
            )}
          </div>
        )}

        <main className="flex-grow p-4 sm:p-5 lg:p-6 space-y-5 max-w-[1500px] w-full mx-auto font-sans overflow-x-hidden">
          {/* BERANDA DENGAN JUDUL SUB PERIODE DINAMIS */}
          {activeView === 'beranda' && (
            <div className="space-y-5">
              <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
                <div className="text-left">
                  <div className="flex flex-wrap items-center gap-sm">
                    <h3 className="font-headline-md lg:font-headline-lg text-headline-md lg:text-headline-lg text-on-background">
                      Dashboard Monitoring
                    </h3>
                    {userRole === 'guest' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#1c4475] border border-blue-100 text-[10px] font-bold uppercase tracking-wide">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Mode Lihat Saja
                      </span>
                    )}
                  </div>
                  <p className="text-on-surface-variant text-sm lg:text-base">{getPeriodSubtitle(activeMonthTab, selectedYear)}</p>
                </div>
              </section>

              {userRole === 'guest' && (
                <section className="bg-blue-50/70 border border-blue-100 rounded-2xl p-md lg:p-lg flex items-start gap-md shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#1c4475]/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#1c4475]">monitoring</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-[#1c4475]">Ringkasan Monitoring K3L</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      Anda masuk sebagai Tamu. Data pada halaman ini dapat dilihat dan difilter berdasarkan tahun atau periode, tetapi tidak dapat diubah.
                    </p>
                  </div>
                </section>
              )}
              <section className="grid grid-cols-1 min-[520px]:grid-cols-2 lg:grid-cols-4 gap-md lg:gap-lg">
                <div className="bg-white p-lg rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40 text-left">
                  <div className="flex justify-between items-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-2xl">task_alt</span>
                    </div>
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                      Periode aktif
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Kegiatan</h4>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-black text-slate-800">{totalActivities}</p>
                      <span className="text-[11px] text-slate-400 font-medium mb-1">kegiatan</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-lg rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40 text-left">
                  <div className="flex justify-between items-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <span className="material-symbols-outlined text-2xl">check_circle</span>
                    </div>
                    <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                      {completedActivities} / {totalActivities}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kegiatan Selesai</h4>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-black text-slate-800">{completedActivities}</p>
                      <span className="text-[11px] text-slate-400 font-medium mb-1">selesai</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-lg rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40 text-left">
                  <div className="flex justify-between items-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <span className="material-symbols-outlined text-2xl">pending_actions</span>
                    </div>
                    <span className="text-[11px] font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                      {notStartedActivities} belum mulai
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dalam Proses</h4>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-black text-slate-800">{inProgressActivities}</p>
                      <span className="text-[11px] text-slate-400 font-medium mb-1">aktif</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#11355e] p-lg rounded-2xl border border-[#11355e] shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-40 text-left text-white">
                  <div className="flex justify-between items-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-2xl">verified_user</span>
                    </div>
                    <span className="text-[11px] font-semibold bg-white/10 text-white/90 px-2.5 py-1 rounded-full">
                      {completedActivities} dari {totalActivities}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-white/70 uppercase tracking-wider">Kepatuhan Keseluruhan</h4>
                    <p className="text-3xl font-black text-white">{compliancePercentage}%</p>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-12 gap-4 text-left">
                <div className="col-span-12 lg:col-span-6 space-y-lg">
                  <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-md"><h4 className="font-title-lg font-bold">Tren Kepatuhan Bulanan</h4><span className="text-body-sm text-outline font-semibold">{chartSubtitle}</span></div>
                    <div className="space-y-sm w-full">
                      {/* PENYEMPURNAAN TREN BULANAN: Menggunakan struktur pembungkus flex-1 untuk menyelaraskan batang lurus pas di tengah dengan label bulannya */}
                      <div className="h-44 flex relative w-full">
                        <div className="w-10 flex flex-col justify-between text-[10px] text-outline font-semibold pr-2 text-right pb-4"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
                        <div className="flex-1 h-40 relative border-l border-b border-outline-variant/60 pb-4">
                          <div className="absolute inset-x-0 top-0 border-t border-dashed border-outline-variant/30"></div>
                          <div className="absolute inset-x-0 top-[25%] border-t border-dashed border-outline-variant/30"></div>
                          <div className="absolute inset-x-0 top-[50%] border-t border-dashed border-outline-variant/30"></div>
                          <div className="absolute inset-x-0 top-[75%] border-t border-dashed border-outline-variant/30"></div>
                          
                          <div className="absolute inset-0 flex items-end px-2">
                            {monthlyStats.map((item, idx) => (
                              <div key={idx} className="flex-1 flex flex-col justify-end items-center h-full">
                                {/* Batang di-lebar-kan sedikit lagi menjadi w-5 sm:w-6 md:w-7 untuk penampilan prima & berjarak rapi */}
                                <div 
                                  style={{ height: item.val }} 
                                  className="w-5 sm:w-6 md:w-7 bg-primary/20 hover:bg-primary rounded-t-lg transition-all group relative cursor-pointer"
                                >
                                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 z-10 font-bold whitespace-nowrap">
                                    {item.val}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex pl-10 text-[10px] font-bold text-outline uppercase tracking-wider">
                        {monthlyStats.map((item, idx) => (
                          <div key={idx} className="flex-1 text-center">{item.month}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                    <h3 className="font-title-lg text-title-lg mb-4 font-bold">Distribusi Status Aktivitas</h3>
                    <div className="space-y-sm w-full">
                      <div className="h-44 flex relative w-full">
                        <div className="w-10 flex flex-col justify-between text-[10px] text-outline font-semibold pr-2 text-right pb-4"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
                        <div className="flex-1 h-40 relative border-l border-b border-outline-variant/60 pb-4">
                          <div className="absolute inset-x-0 top-0 border-t border-dashed border-outline-variant/30"></div>
                          <div className="absolute inset-x-0 top-[25%] border-t border-dashed border-outline-variant/30"></div>
                          <div className="absolute inset-x-0 top-[50%] border-t border-dashed border-outline-variant/30"></div>
                          <div className="absolute inset-x-0 top-[75%] border-t border-dashed border-outline-variant/30"></div>
                          <div className="absolute inset-0 flex items-end justify-around px-8">
                            <div style={{ height: `${completedPercent}%` }} className="w-12 bg-[#10b981] rounded-t-lg transition-all group relative cursor-pointer"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 z-10 font-bold whitespace-nowrap">{completedActivities} ({completedPercent}%)</div></div>
                            <div style={{ height: `${inProgressPercent}%` }} className="w-12 bg-primary rounded-t-lg transition-all group relative cursor-pointer"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 z-10 font-bold whitespace-nowrap">{inProgressActivities} ({inProgressPercent}%)</div></div>
                            <div style={{ height: `${notStartedPercent}%` }} className="w-12 bg-error rounded-t-lg transition-all group relative cursor-pointer"><div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 z-10 font-bold whitespace-nowrap">{notStartedActivities} ({notStartedPercent}%)</div></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex pl-10 text-[10px] font-bold text-outline uppercase tracking-wider"><div className="flex-1 text-center font-semibold">Selesai</div><div className="flex-1 text-center font-semibold">Proses</div><div className="flex-1 text-center font-semibold">Belum</div></div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest rounded-xl border border-outline-variant p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-5"><h4 className="font-title-lg font-bold">Kepatuhan Per Kategori Program</h4><span className="text-xs bg-primary/10 text-primary font-bold px-2 py-1 rounded-full">7 Kategori</span></div>
                  <div className="space-y-sm overflow-y-auto max-h-[390px] pr-2 custom-scrollbar">
                    {categoryComplianceStats.map((cat, idx) => (
                      <div key={idx} className="space-y-xs pb-sm last:pb-0 border-b border-slate-100 last:border-none">
                        <div className="flex justify-between items-start text-xs"><span className="font-semibold text-slate-700 leading-tight pr-md text-left">{cat.name}</span><span className={`font-bold ${cat.percent >= 80 ? 'text-[#10b981]' : cat.percent >= 50 ? 'text-primary' : 'text-error'}`}>{cat.percent}%</span></div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${cat.percent >= 80 ? 'bg-[#10b981]' : cat.percent >= 50 ? 'bg-primary' : 'bg-error'}`} style={{ width: `${cat.percent}%` }}></div></div>
                        <div className="flex justify-between text-[10px] text-outline"><span>Progres: {cat.completed} dari {cat.total} Sub-Program</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: DAFTAR KEGIATAN / PEMANTAUAN */}
          {activeView === 'formulir-list' && (
            <div className="space-y-lg">
              <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md text-left">
                <div>
                  <div className="flex flex-wrap items-center gap-sm mb-xs">
                    <h3 className="font-headline-md text-headline-md">{userRole === 'admin' ? `Pemantauan Kegiatan (${selectedYear})` : `Daftar Kegiatan (${selectedYear})`}</h3>
                    {userRole === 'guest' && (
                      <span className="inline-flex items-center gap-xs px-sm py-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold uppercase tracking-wide">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Lihat Saja
                      </span>
                    )}
                  </div>
                  <p className="text-on-surface-variant text-sm">
                    {userRole === 'admin'
                      ? 'Kelola progres realisasi aktual K3L UIP3B Sumatera'
                      : 'Lihat target, realisasi, dan status kegiatan tanpa mengubah data.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-sm w-full md:w-auto">
                  <button onClick={() => setFilterOpen(true)} className="flex-1 md:flex-none px-md py-sm bg-surface-container border border-outline-variant rounded-lg flex items-center justify-center gap-sm hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined">filter_list</span>
                    <span className="font-label-md">Filter</span>
                  </button>
                  {userRole === 'admin' && (
                    <button onClick={() => setActiveView('entri-baru')} className="flex-1 md:flex-none px-md py-sm bg-primary text-on-primary rounded-lg flex items-center justify-center gap-sm hover:brightness-110 active:scale-95 transition-all shadow-sm">
                      <span className="material-symbols-outlined">add</span>
                      <span className="font-label-md">Tambah Kegiatan</span>
                    </button>
                  )}
                </div>
              </section>

              {userRole === 'guest' && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-lg py-md flex items-start gap-md text-left">
                  <span className="material-symbols-outlined text-blue-600 mt-0.5">info</span>
                  <div>
                    <p className="text-sm font-bold text-blue-900">Mode pemantauan tamu</p>
                    <p className="text-xs text-blue-700 mt-xs">Gunakan filter untuk mencari kegiatan berdasarkan PIC, kategori, atau status. Perubahan data hanya dapat dilakukan oleh Administrator.</p>
                  </div>
                </div>
              )}

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
                <div className="p-lg border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md bg-surface-container-low">
                  <div className="flex text-left gap-md bg-transparent items-center">
                    <span className="material-symbols-outlined text-primary">{userRole === 'admin' ? 'description' : 'view_list'}</span>
                    <h4 className="font-title-lg font-bold">{userRole === 'admin' ? 'Pemantauan Kegiatan K3L' : 'Daftar Kegiatan K3L'}</h4>
                  </div>
                  {userRole === 'guest' && (
                    <span className="text-xs text-on-surface-variant">{filteredTasks.length} kegiatan ditampilkan</span>
                  )}
                </div>
                <div className="overflow-x-auto custom-scrollbar -mx-1 px-1">
                  <table className="w-full text-left border-collapse min-w-[760px] xl:min-w-0">
                    <thead>
                      <tr className="bg-surface-container-high border-b border-outline-variant"><th className="p-md text-[11px] font-bold text-on-surface-variant uppercase tracking-wider w-12">No</th><th className="p-md text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Uraian Kegiatan</th><th className="p-md text-[11px] font-bold text-[#475569] uppercase tracking-wider w-32 min-w-[120px] text-left">PIC</th><th className="p-md text-[11px] font-bold text-[#475569] uppercase tracking-wider text-center">Target</th><th className="p-md text-[11px] font-bold text-[#475569] uppercase tracking-wider text-center">Realisasi</th><th className="p-md text-[11px] font-bold text-[#475569] uppercase tracking-wider">Status</th>
                        {userRole === 'admin' && <th className="p-md text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant">
                      {isDataLoading ? (
                        <tr>
                          <td colSpan={userRole === 'admin' ? 7 : 6} className="px-lg py-14 text-center">
                            <div className="flex flex-col items-center gap-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                              <p className="font-bold text-sm text-on-surface">Memuat data kegiatan...</p>
                              <p className="text-xs">Sedang menyinkronkan data dari SPS. Mohon tunggu sebentar.</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredTasks.length === 0 ? (
                        <tr>
                          <td colSpan={userRole === 'admin' ? 7 : 6} className="px-lg py-12 text-center">
                            <div className="flex flex-col items-center gap-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
                              <p className="font-bold text-sm text-on-surface">Tidak ada kegiatan yang ditemukan</p>
                              <p className="text-xs">Coba ubah filter, tahun, atau periode yang sedang dipilih.</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredTasks.map(task => {
                        if (!task) return null;
                        
                        // Perhitungan Target Dinamis sesuai cakupan minggu periode yang aktif
                        const calculatedTarget = Array.isArray(task.weeks) 
                          ? task.weeks.filter(w => visibleWeeks.includes(Number(w))).length 
                          : Object.keys(task.weeks || {}).reduce((sum, w) => {
                              const weekNum = Number(w);
                              return visibleWeeks.includes(weekNum) ? sum + Number(task.weeks[w] || 0) : sum;
                            }, 0);

                        // Perhitungan Realisasi Dinamis sesuai cakupan minggu periode yang aktif
                        const calculatedActual = Object.keys(task.actualWeeks || {}).reduce((sum, w) => {
                          const weekNum = Number(w);
                          return visibleWeeks.includes(weekNum) ? sum + Number(task.actualWeeks[w] || 0) : sum;
                        }, 0);

                        // Status dinamis mengikuti filter periode
                        let dynamicStatus = "Belum Mulai";
                        if (calculatedActual >= calculatedTarget && calculatedTarget > 0) {
                          dynamicStatus = "Selesai";
                        } else if (calculatedActual > 0) {
                          dynamicStatus = "Dalam Proses";
                        }

                        return (
                          <tr key={task.id} className="hover:bg-primary/5 transition-colors group">
                            <td className="p-md font-code-md text-on-surface-variant">{task.no || ""} {task.subNo || ""}</td>
                            <td className="p-md">
                              <div className="font-medium text-sm text-left">{task.title || ""}</div>
                              <div className="text-body-sm text-outline text-left">{task.category || ""}</div>
                            </td>
                            {/* PENYEMPURNAAN KOLOM PIC: whitespace-nowrap & text-left agar kotak berjejer lurus di tengah & sangat rapi */}
                            <td className="p-md whitespace-nowrap text-left">
                              <span className="px-sm py-xs bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs tracking-wide border border-slate-200">
                                {task.pic || ""}
                              </span>
                            </td>
                            <td className="p-md text-center font-bold">{calculatedTarget}</td>
                            <td className="p-md text-center">{calculatedActual}</td>
                            <td className="p-md">
                              <span className={`flex items-center gap-xs font-semibold ${dynamicStatus === 'Selesai' ? 'text-[#10b981]' : dynamicStatus === 'Dalam Proses' ? 'text-primary' : 'text-error'}`}>
                                <span className="material-symbols-outlined text-sm">{dynamicStatus === 'Selesai' ? 'check_circle' : dynamicStatus === 'Dalam Proses' ? 'schedule' : 'warning'}</span>
                                <span className="font-label-md text-xs">{dynamicStatus}</span>
                              </span>
                            </td>
                            {userRole === 'admin' && (
                              <td className="p-md">
                                <div className="flex justify-end items-center gap-sm">
                                  <button
                                    type="button"
                                    title="Update Realisasi"
                                    onClick={() => openRealisasiModal(task)}
                                    className="p-2 rounded-lg text-outline hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-90"
                                  >
                                    <span className="material-symbols-outlined text-lg">edit_document</span>
                                  </button>

                                  <button
                                    type="button"
                                    title="Edit Kegiatan"
                                    onClick={() => openEditModal(task)}
                                    className="p-2 rounded-lg text-outline hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90"
                                  >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                  </button>

                                  <button
                                    type="button"
                                    title="Hapus Kegiatan"
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-2 rounded-lg text-outline hover:text-red-600 hover:bg-red-50 transition-all active:scale-90"
                                  >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ENTRI BARU */}
          {activeView === 'entri-baru' && userRole === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
              <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-md lg:p-xl rounded-2xl border border-outline-variant shadow-sm space-y-lg">
                <div className="flex justify-between items-start mb-4 border-b border-outline-variant/30 pb-md"><div className="text-left"><h2 className="font-headline-md text-headline-md text-on-surface">Formulir Entri Data ({selectedYear})</h2><p className="font-body-md text-body-md text-on-surface-variant">Daftarkan entri pemantauan K3L baru</p></div></div>
                <form className="space-y-lg text-left" onSubmit={handleFormSubmit}>
                  {/* PENATAAN dropdown & KOLOM INPUT SUB */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-md">
                    <div className="flex flex-col gap-xs col-span-1 md:col-span-6">
                      <label className="font-label-md text-label-md text-on-surface-variant">Kategori</label>
                      <select value={formCategory} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full rounded-xl border border-outline-variant bg-surface text-body-md px-md h-12 shadow-sm focus:outline-none">
                        <option value="1">1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN</option>
                        <option value="2">2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN</option>
                        <option value="3">3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN</option>
                        <option value="4">4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN</option>
                        <option value="5">5. KOMPETENSI DAN PELATIHAN</option>
                        <option value="6">6. PELAPORAN</option>
                        <option value="7">7. PROGRAM PENDUKUNG</option>
                        <option value="Lainnya">Lainnya...</option>
                      </select>
                    </div>

                    {/* DIBUAT DROPDOWN DINAMIS BERDASARKAN PILIHAN KATEGORI (DISET MATLEV KAM) */}
                    <div className="flex flex-col gap-xs col-span-1 md:col-span-3">
                      <label className="font-label-md text-label-md text-[#475569]">No (MATLEV KAM)</label>
                      {isCustomCategory ? (
                        <input type="text" value={formNo} onChange={(e) => setFormNo(e.target.value)} className="w-full rounded-xl border border-outline-variant bg-surface px-md h-12 shadow-sm focus:outline-none" placeholder="Tulis No..." required />
                      ) : (
                        <select 
                          value={formNo} 
                          onChange={(e) => { 
                            setFormNo(e.target.value); 
                            if(e.target.value !== 'Lainnya') {
                              setFormNoCustom(''); 
                            } else {
                              setFormNoCustom(`${formCategory}.`);
                            }
                          }} 
                          className="w-full rounded-xl border border-outline-variant bg-surface pl-3 pr-8 h-12 shadow-sm focus:outline-none border-slate-300" 
                          required
                        >
                          <option value="">Pilih No</option>
                          {(CATEGORY_INDEXES[formCategory] || []).map(indexNo => (
                            <option key={indexNo} value={indexNo}>{indexNo}</option>
                          ))}
                          <option value="Lainnya">Lainnya...</option>
                        </select>
                      )}
                      {/* INPUT MANUAL UNTUK NO INDEKS LAINNYA */}
                      {formNo === 'Lainnya' && !isCustomCategory && (
                        <input type="text" value={formNoCustom} onChange={(e) => setFormNoCustom(e.target.value)} className="w-full mt-2 rounded-xl border border-slate-300 bg-surface px-md h-12 shadow-sm focus:outline-none" placeholder="Tulis No Kustom..." required />
                      )}
                    </div>

                    {/* INPUT HURUF SUB BERUPA DROPDOWN */}
                    <div className="flex flex-col gap-xs col-span-1 md:col-span-3">
                      <label className="font-label-md text-label-md text-[#475569]">Sub (Huruf Indeks)</label>
                      <select 
                        value={formSub} 
                        onChange={(e) => {
                          setFormSub(e.target.value);
                          if (e.target.value !== 'Lainnya') {
                            setFormSubCustom('');
                          }
                        }} 
                        className="w-full rounded-xl border border-slate-200 px-md h-12 shadow-sm focus:outline-none text-sm font-bold bg-white"
                      >
                        <option value="">Pilih Sub</option>
                        {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map(subChar => (
                          <option key={subChar} value={subChar}>{subChar}</option>
                        ))}
                        <option value="Lainnya">Lainnya...</option>
                      </select>
                      {/* INPUT MANUAL UNTUK SUB LAINNYA */}
                      {formSub === 'Lainnya' && (
                        <input 
                          type="text" 
                          value={formSubCustom} 
                          onChange={(e) => setFormSubCustom(e.target.value)} 
                          className="w-full mt-2 rounded-xl border border-slate-300 bg-surface px-md h-12 shadow-sm focus:outline-none" 
                          placeholder="Tulis Sub Kustom (misal: J)..." 
                          required 
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-xs">
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-md text-label-md text-[#475569]">PIC</label>
                      <input value={formPic} onChange={(e) => setFormPic(e.target.value)} className="w-full rounded-xl border border-[#cbd5e1] bg-surface px-md h-12 shadow-sm focus:outline-none" placeholder="Contoh: PJ OP KAM" type="text" required />
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-md text-label-md text-on-surface-variant">Tautan (Opsional)</label>
                      <input value={formLink} onChange={(e) => setFormLink(e.target.value)} className="w-full rounded-xl border border-outline-variant bg-surface px-md h-12 shadow-sm focus:outline-none" placeholder="https://..." type="url" />
                    </div>
                  </div>

                  {isCustomCategory && (
                    <div className="flex flex-col gap-xs mt-xs">
                      <label className="font-label-md text-label-md text-on-surface-variant">Kategori Baru</label>
                      <input type="text" value={formCategoryCustom} onChange={(e) => setFormCategoryCustom(e.target.value)} className="w-full rounded-xl border border-outline-variant bg-surface px-md h-12 shadow-sm focus:outline-none" placeholder="Tulis kategori kustom..." />
                    </div>
                  )}
                  <div className="flex flex-col gap-xs mt-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant">Uraian Kegiatan</label>
                    {isCustomCategory ? <input type="text" value={formActivityCustom} onChange={(e) => setFormActivityCustom(e.target.value)} className="w-full rounded-xl border border-[#cbd5e1] bg-surface px-md h-12 shadow-sm focus:outline-none" placeholder="Rincian..." /> : 
                      <><select value={formActivitySelect} onChange={(e) => handleActivitySelectChange(e.target.value)} className="w-full rounded-xl border border-[#cbd5e1] bg-surface pl-3 pr-8 h-12 shadow-sm focus:outline-none"><option value="">Pilih Kegiatan</option>{(PREDEFINED_ACTIVITIES[formCategory] || []).map((act, idx) => <option key={idx} value={act}>{act}</option>)}<option value="Lainnya">Lainnya...</option></select>{isCustomActivity && <input type="text" value={formActivityCustom} onChange={(e) => setFormActivityCustom(e.target.value)} className="w-full mt-xs rounded-xl border border-outline-variant bg-surface p-md h-12" placeholder="Tulis kegiatan..." />}</>
                    }
                  </div>
                  
                  <div className="flex flex-col gap-xs mt-xs"><label className="font-label-md text-label-md text-on-surface-variant mb-sm">Bulan Pelaksanaan</label><div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-sm">{['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map(m => <label key={m} className={`flex flex-col items-center justify-center p-sm border border-outline-variant rounded-xl cursor-pointer hover:bg-slate-50 transition-colors ${formMonths.includes(m) ? 'border-primary bg-primary-container text-on-primary-container font-bold' : 'bg-white'}`}><input type="checkbox" checked={formMonths.includes(m)} onChange={(e) => handleMonthChange(m, e.target.checked)} className="hidden" /><span className="text-[10px]">{m.toUpperCase()}</span></label>)}</div></div>
                  
                  {/* ATUR TARGET RENCANA (PLAN) STEPPER */}
                  <div className="flex flex-col gap-xs pt-md">
                    <label className="font-label-md text-label-md text-on-surface-variant mb-sm">Target Rencana Mingguan (Plan)</label>
                    {formMonths.length === 0 ? (
                      <div className="p-md border border-dashed rounded-xl text-center text-sm italic bg-slate-50">Pilih bulan pelaksanaan terlebih dahulu.</div>
                    ) : (
                      <div className="space-y-md p-md border rounded-2xl bg-slate-50 shadow-inner">
                        {formMonths.map(month => (
                          <div key={month} className="space-y-sm text-left border-b border-slate-100 pb-sm last:border-0 last:pb-0">
                            <span className="font-bold text-xs uppercase text-primary">{month} :</span>
                            <div className="flex flex-wrap gap-sm mt-1">
                              {(MONTH_TO_WEEKS[month] || []).map(week => {
                                const value = formWeeks[week] || 0;
                                return (
                                  <div key={week} className="flex items-center gap-xs bg-white border border-[#cbd5e1] p-1 rounded-xl shadow-sm">
                                    <span className="text-xs font-bold text-outline pr-1 border-r border-slate-100 pl-1">M-{week}</span>
                                    <button type="button" className="w-5 h-5 flex items-center bg-white rounded justify-center" onClick={() => handleWeekValueChange(week, Math.max(0, value - 1))}>-</button>
                                    <span className="font-bold">{value}</span>
                                    <button type="button" className="w-5 h-5 flex items-center bg-white rounded justify-center" onClick={() => handleWeekValueChange(week, value + 1)}>+</button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-lg flex"><button className="flex-1 bg-primary text-on-primary px-lg py-md rounded-lg font-bold hover:bg-surface-tint shadow-md h-12" type="submit">Kirim Entri</button></div>
                </form>
              </div>
              <div className="col-span-12 lg:col-span-5 space-y-lg text-left">
                <div className="bg-inverse-surface text-inverse-on-surface p-lg rounded-2xl border border-outline shadow-xl flex flex-col space-y-md">
                  <div className="flex items-center gap-md mb-xl"><span className="material-symbols-outlined text-primary-fixed">visibility</span><div><h3 className="font-headline-sm text-headline-sm">Pratinjau Tabel Langsung</h3><p className="font-body-sm text-body-sm opacity-70">Visualisasi entri real-time</p></div></div>
                  <div className="bg-surface-container-lowest text-on-surface rounded-lg overflow-hidden border border-outline-variant shadow-inner">
                    <div className="grid grid-cols-12 bg-surface-container-high border-b border-outline-variant">
                      <div className="col-span-6 p-md font-label-md text-[10px] sm:text-label-md border-r">Uraian Kegiatan</div>
                      <div className="col-span-2 p-md font-label-md text-[10px] sm:text-label-md border-r text-center">PIC</div>
                      <div className="col-span-2 p-md font-label-md text-[10px] sm:text-label-md border-r text-center">Trgt</div>
                      <div className="col-span-2 p-md font-label-md text-[10px] sm:text-label-md text-center">Status</div>
                    </div>
                    <div className="grid grid-cols-12 min-h-[100px] items-start bg-white">
                      <div className="col-span-6 p-md font-body-sm text-[12px] border-r italic text-on-surface-variant break-words">{isCustomActivity ? formActivityCustom : formActivitySelect || "Belum ada rincian kegiatan..."}</div>
                      <div className="col-span-2 p-md font-body-sm text-[12px] border-r text-center">{formPic || "-"}</div>
                      <div className="col-span-2 p-md font-body-sm text-[12px] border-r text-center">{Object.values(formWeeks || {}).reduce((sum, v) => sum + Number(v || 0), 0)}</div>
                      <div className="col-span-2 p-md text-center py-md"><span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded text-[10px] font-bold">PLAN</span></div>
                    </div>
                    <div className="grid grid-cols-6 sm:grid-cols-12 border-t bg-slate-50 overflow-hidden">{['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map(m => <div key={m} className={`p-xs text-[10px] border-r text-center last:border-r-0 truncate ${formMonths.includes(m) ? 'bg-secondary text-white font-bold opacity-100' : 'opacity-40'}`}>{m}</div>)}</div>
                  </div>
                  <div className="mt-xl space-y-md">
                    <div className="flex flex-col gap-xs text-left">
                      <div className="flex items-center gap-sm">
                        <span className="w-3 h-3 rounded-full bg-secondary animate-pulse"></span>
                        <span className="text-body-sm">Fase Draft (No: {(isCustomCategory || formNo === 'Lainnya') ? formNoCustom : formNo || "-"} {formSub === 'Lainnya' ? formSubCustom : formSub || ""})</span>
                      </div>
                      <div className="flex items-center gap-sm mt-xs">
                        <span className="material-symbols-outlined text-sm text-outline">calendar_month</span>
                        <span className="text-body-sm font-medium opacity-80">
                          Minggu Terpilih: {Object.keys(formWeeks).length > 0 ? Object.keys(formWeeks).map(w => `M-${w} (${formWeeks[w]}x)`).join(', ') : 'Belum ada'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: LOG AKTIVITAS (SHEET) */}
          {activeView === 'log' && (
            <LogAktivitas 
              selectedYear={selectedYear} activeMonthTab={activeMonthTab} setActiveMonthTab={setActiveMonthTab}
              exportToExcel={exportToPdf} // SINKRONISASI: Sekarang mengarah langsung ke fungsi ekspor PDF dinamis dari Google Sheets asli
              spsUrl={spsUrl} groupedTasks={groupedTasks} visibleWeeks={visibleWeeks}
              MONTH_TO_WEEKS={MONTH_TO_WEEKS} 
              WEEK_DATES={generateWeekDates(selectedYear)} // Menerapkan rentang tanggal mingguan dinamis sesuai tahun aktif
            />
          )}
        </main>
      </div>

      {/* SEMUA MODALS DIIMPORT SECARA MODULAR */}
      <Modals 
        profileModalOpen={profileModalOpen} setProfileModalOpen={setProfileModalOpen}
        settingsModalOpen={settingsModalOpen} setSettingsModalOpen={setSettingsModalOpen}
        userRole={userRole} spsUrl={spsUrl} setSpsUrl={setSpsUrl} webAppUrl={webAppUrl} setWebAppUrl={setWebAppUrl}
        handleLogout={handleLogout} showToast={showToast}
        adminPhone={adminPhone} setAdminPhone={setAdminPhone} 
        helpModalOpen={helpModalOpen} setHelpModalOpen={setHelpModalOpen}
        editModalOpen={editModalOpen} setEditModalOpen={setEditModalOpen}
        editNo={editNo} setEditNo={setEditNo} editPic={editPic} setEditPic={setEditPic}
        editCategory={editCategory} setEditCategory={setEditCategory}
        editTitle={editTitle} setEditTitle={setEditTitle}
        editMonths={editMonths} handleEditMonthChange={handleEditMonthChange}
        editWeeks={editWeeks} handleEditWeekValueChange={handleEditWeekValueChange}
        handleEditSubmit={handleEditSubmit} MONTH_TO_WEEKS={MONTH_TO_WEEKS}
        newYearModalOpen={newYearModalOpen} setNewYearModalOpen={setNewYearModalOpen}
        inputNewYear={inputNewYear} setInputNewYear={setInputNewYear}
        handleCreateNewYear={handleCreateNewYear}
        filterOpen={filterOpen} setFilterOpen={setFilterOpen}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        filterPic={filterPic} setFilterPic={setFilterPic}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        filterStatus={filterStatus} setFilterStatus={setFilterStatus}
        tasks={tasks} realisasiModal={realisasiModal} setRealisasiModal={setRealisasiModal}
        handleSaveRealisasi={handleSaveRealisasi} selectedYear={selectedYear}
        handleDeleteTask={handleDeleteTask} openEditModal={openEditModal} 
      />

      {/* TOAST SYSTEM */}
      {toast.show && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] max-w-[calc(100vw-2rem)] sm:max-w-md px-lg py-md rounded-xl shadow-2xl border flex items-center gap-sm text-xs font-semibold transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : toast.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-slate-800 text-white border-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-lg shrink-0">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <span className="leading-relaxed">{toast.message}</span>
        </div>
      )}
    </div>
  );
}