// Database K3L PLN UIP3B SUMATERA (FR-K3L-KKK-003-2)
export const INITIAL_TASKS = [
  // 1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN
  {
    id: 1, iso45001: "", pp50: "", matlevKam: "", no: "1.1", subNo: "A", title: "Dokumen RKAP",
    category: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN", categoryNum: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Jan"], weeks: { 6: 1 }, actualWeeks: { 6: 1 }
  },
  {
    id: 2, iso45001: "", pp50: "", matlevKam: "", no: "1.2", subNo: "B", title: "Inspeksi Manager UP",
    category: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN", categoryNum: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN",
    pic: "PJ OP KAM", biaya: "-", target: 24, actual: 12, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    weeks: { 2: 2, 6: 2, 10: 2, 14: 2, 18: 2, 22: 2, 26: 2, 30: 2, 34: 2, 38: 2, 42: 2, 46: 2 },
    actualWeeks: { 2: 2, 6: 2, 10: 2, 14: 2, 18: 2, 22: 2 }
  },
  {
    id: 3, iso45001: "", pp50: "", matlevKam: "", no: "1.3", subNo: "C", title: "Pendokumentasian Lokasi penempatan Aset CCTV dan Portal",
    category: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN", categoryNum: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Jan"], weeks: { 4: 1 }, actualWeeks: { 4: 1 }
  },
  {
    id: 4, iso45001: "", pp50: "", matlevKam: "", no: "1.3", subNo: "D", title: "Review Peta Zona Keamanan",
    category: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN", categoryNum: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN",
    pic: "PJ OP KAM", biaya: "-", target: 7, actual: 6, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"],
    weeks: { 3: 1, 7: 1, 11: 1, 15: 1, 19: 1, 23: 1, 29: 1 },
    actualWeeks: { 3: 1, 7: 1, 11: 1, 15: 1, 19: 1, 23: 1 }
  },
  {
    id: 5, iso45001: "", pp50: "", matlevKam: "", no: "1.3", subNo: "E", title: "Integrasi pemantauan Pengamanan",
    category: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN", categoryNum: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 0, status: "Belum Mulai", prosedur: "-", folder: "-", link: "",
    months: ["Feb"], weeks: { 8: 1 }, actualWeeks: {}
  },
  {
    id: 6, iso45001: "", pp50: "", matlevKam: "", no: "1.4", subNo: "F", title: "Penyusunan Renpam",
    category: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN", categoryNum: "1. KEPEMIMPINAN DAN KOMITMEN MANAJEMEN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Jan"], weeks: { 5: 1 }, actualWeeks: { 5: 1 }
  },

  // 2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN
  {
    id: 7, iso45001: "", pp50: "", matlevKam: "", no: "2.1", subNo: "A", title: "Melakukan PKT dengan Polda Lampung",
    category: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN", categoryNum: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Mei"], weeks: { 22: 1 }, actualWeeks: { 22: 1 }
  },
  {
    id: 8, iso45001: "", pp50: "", matlevKam: "", no: "2.1", subNo: "A", title: "Pengamanan Siaga Idul Fitri 2026",
    category: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN", categoryNum: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN",
    pic: "PJ OP KAM", target: 3, actual: 3, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Mar"], weeks: { 13: 1, 14: 1, 15: 1 }, actualWeeks: { 13: 1, 14: 1, 15: 1 }
  },
  {
    id: 9, iso45001: "", pp50: "", matlevKam: "", no: "2.1", subNo: "A", title: "Pengamanan Siaga Hari Besar Nasional",
    category: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN", categoryNum: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 5, actual: 3, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Jan", "Mar", "Jun"], weeks: { 1: 1, 13: 1, 14: 1, 15: 1, 26: 1 }, actualWeeks: { 1: 1, 13: 1, 14: 1 }
  },
  {
    id: 10, iso45001: "", pp50: "", matlevKam: "", no: "2.1", subNo: "A", title: "Pengamanan Siaga Natal 2026 dan Tahun Baru 2026",
    category: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN", categoryNum: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 3, actual: 0, status: "Belum Mulai", prosedur: "-", folder: "-", link: "",
    months: ["Des"], weeks: { 51: 1, 52: 1, 53: 1 }, actualWeeks: {}
  },
  {
    id: 11, iso45001: "", pp50: "", matlevKam: "", no: "2.2", subNo: "B", title: "Sosialisasi internal Peningkatan Pemahaman Sistem Pengamanan",
    category: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN", categoryNum: "2. SOSIALISASI, KOORDINASI DAN KERJASAMA DENGAN STAKEHOLDER PENGAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 4, actual: 1, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Apr", "Jul", "Sep", "Nov"], weeks: { 16: 1, 28: 1, 39: 1, 47: 1 }, actualWeeks: { 11: 1 }
  },

  // 3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN
  {
    id: 12, iso45001: "", pp50: "", matlevKam: "", no: "3.1", subNo: "A", title: "SK TIM Implementasi SMP",
    category: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN", categoryNum: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Feb"], weeks: { 6: 1 }, actualWeeks: { 6: 1 }
  },
  {
    id: 13, iso45001: "", pp50: "", matlevKam: "", no: "3.1", subNo: "B", title: "Workplan implementasi SMP",
    category: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN", categoryNum: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Apr"], weeks: { 17: 1 }, actualWeeks: { 17: 1 }
  },
  {
    id: 14, iso45001: "", pp50: "", matlevKam: "", no: "3.2", subNo: "C", title: "Audit Internal (Jadwal, Undangan dan LHA) dan Tindaklanjut",
    category: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN", categoryNum: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Apr"], weeks: { 16: 1 }, actualWeeks: { 16: 1 }
  },
  {
    id: 15, iso45001: "", pp50: "", matlevKam: "", no: "3.3", subNo: "D", title: "RTM SMP (Jadwal, Undangan, Absensi, Dokumentasi, Notulen)",
    category: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN", categoryNum: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 2, actual: 2, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Apr", "Jul"], weeks: { 17: 1, 29: 1 }, actualWeeks: { 17: 1, 29: 1 }
  },
  {
    id: 16, iso45001: "", pp50: "", matlevKam: "", no: "3.4", subNo: "E", title: "Audit BUJP (Undangan, Absensi, Dokumentasi, BA, Monitoring Tindaklanjut)",
    category: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN", categoryNum: "3. PEMBINAAN TEKNIS, AUDIT DAN TINJAUAN MANAJEMEN SISTEM PENGAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 4, actual: 2, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Mar", "Mei", "Sep", "Des"], weeks: { 12: 1, 21: 1, 38: 1, 50: 1 }, actualWeeks: { 12: 1, 21: 1 }
  },

  // 4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN
  {
    id: 17, iso45001: "", pp50: "", matlevKam: "", no: "4.1", subNo: "A", title: "Peta Kerawanan Internal",
    category: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", categoryNum: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 12, actual: 6, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    weeks: { 4: 1, 8: 1, 12: 1, 16: 1, 20: 1, 24: 1, 28: 1, 32: 1, 36: 1, 40: 1, 44: 1, 48: 1 },
    actualWeeks: { 4: 1, 8: 1, 12: 1, 16: 1, 20: 1, 24: 1 }
  },
  {
    id: 18, iso45001: "", pp50: "", matlevKam: "", no: "4.1", subNo: "B", title: "Peta Kerawanan POLRI",
    category: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", categoryNum: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 2, actual: 0, status: "Belum Mulai", prosedur: "-", folder: "-", link: "",
    months: ["Jun", "Des"], weeks: { 25: 1, 51: 1 }, actualWeeks: {}
  },
  {
    id: 19, iso45001: "", pp50: "", matlevKam: "", no: "4.1", subNo: "C", title: "SOP Pengendalian Keamanan",
    category: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", categoryNum: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 2, actual: 1, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Mar", "Jul"], weeks: { 10: 1, 29: 1 }, actualWeeks: { 11: 1 }
  },
  {
    id: 20, iso45001: "", pp50: "", matlevKam: "", no: "4.1", subNo: "D", title: "Tindaklanjut Kerawanan",
    category: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", categoryNum: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 4, actual: 2, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Mar", "Mei", "Agu", "Okt"], weeks: { 10: 1, 18: 1, 32: 1, 42: 1 }, actualWeeks: { 10: 1, 18: 1 }
  },
  {
    id: 21, iso45001: "", pp50: "", matlevKam: "", no: "4.2", subNo: "E", title: "Prosedur dan Program Kerja Pencegahan Terorisme",
    category: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", categoryNum: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Mei"], weeks: { 21: 1 }, actualWeeks: { 21: 1 }
  },
  {
    id: 22, iso45001: "", pp50: "", matlevKam: "", no: "4.2", subNo: "F", title: "Sosialisasi Internal Pencegahan Terorisme kepada 100% Struktural (Undangan, Materi, Absensi, Dokumentasi), Kuisioner",
    category: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", categoryNum: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Mei"], weeks: { 22: 1 }, actualWeeks: { 22: 1 }
  },
  {
    id: 23, iso45001: "", pp50: "", matlevKam: "", no: "4.3", subNo: "G", title: "Dokumen Analisa Resiko Pengamanan",
    category: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", categoryNum: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Mar"], weeks: { 10: 1 }, actualWeeks: { 10: 1 }
  },
  {
    id: 24, iso45001: "", pp50: "", matlevKam: "", no: "4.3", subNo: "H", title: "Dokumen Objek Target Program",
    category: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", categoryNum: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Mar"], weeks: { 10: 1 }, actualWeeks: { 10: 1 }
  },
  {
    id: 25, iso45001: "", pp50: "", matlevKam: "", no: "4.4", subNo: "I", title: "Dokumen Rencana Kontijensi Pengamanan",
    category: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN", categoryNum: "4. IDENTIFIKASI TINGKAT KERAWANAN KEAMANAN, ANALISA RESIKO DAN KONTIJENSI KEAMANAN",
    pic: "PJ OP KAM", biaya: "-", target: 1, actual: 1, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Mar"], weeks: { 10: 1 }, actualWeeks: { 10: 1 }
  },

  // 5. KOMPETENSI DAN PELATIHAN
  {
    id: 26, iso45001: "", pp50: "", matlevKam: "", no: "5.1", subNo: "A", title: "Sertifikasi Gada Utama",
    category: "5. KOMPETENSI DAN PELATIHAN", categoryNum: "5. KOMPETENSI DAN PELATIHAN",
    pic: "PJ OP KAM", biaya: "-", target: 2, actual: 1, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Mar", "Sep"], weeks: { 10: 1, 36: 1 }, actualWeeks: { 10: 1 }
  },
  {
    id: 27, iso45001: "", pp50: "", matlevKam: "", no: "5.1", subNo: "B", title: "Pembinaan Teknis Gada Utama Kepada Satpam",
    category: "5. KOMPETENSI DAN PELATIHAN", categoryNum: "5. KOMPETENSI DAN PELATIHAN",
    pic: "PJ OP KAM", biaya: "-", target: 12, actual: 6, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    weeks: { 3: 1, 7: 1, 11: 1, 15: 1, 19: 1, 23: 1, 27: 1, 31: 1, 35: 1, 39: 1, 43: 1, 47: 1 },
    actualWeeks: { 3: 1, 7: 1, 11: 1, 15: 1, 19: 1, 23: 1 }
  },
  {
    id: 28, iso45001: "", pp50: "", matlevKam: "", no: "5.2", subNo: "C", title: "Sertifikasi Auditor SMP",
    category: "5. KOMPETENSI DAN PELATIHAN", categoryNum: "5. KOMPETENSI DAN PELATIHAN",
    pic: "PJ OP KAM", biaya: "-", target: 2, actual: 0, status: "Belum Mulai", prosedur: "-", folder: "-", link: "",
    months: ["Mei", "Nov"], weeks: { 21: 1, 45: 1 }, actualWeeks: {}
  },

  // 6. PELAPORAN
  {
    id: 29, iso45001: "", pp50: "", matlevKam: "", no: "6.1", subNo: "A", title: "Laporan Bulanan",
    category: "6. PELAPORAN", categoryNum: "6. PELAPORAN",
    pic: "PJ OP KAM", biaya: "-", target: 12, actual: 6, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
    weeks: { 4: 1, 8: 1, 12: 1, 16: 1, 20: 1, 24: 1, 28: 1, 32: 1, 36: 1, 40: 1, 44: 1, 48: 1 },
    actualWeeks: { 4: 1, 8: 1, 12: 1, 16: 1, 20: 1, 24: 1 }
  },
  {
    id: 30, iso45001: "", pp50: "", matlevKam: "", no: "6.1", subNo: "B", title: "Laporan Matlev",
    category: "6. PELAPORAN", categoryNum: "6. PELAPORAN",
    pic: "PJ OP KAM", biaya: "-", target: 4, actual: 2, status: "Dalam Proses", prosedur: "-", folder: "-", link: "",
    months: ["Apr", "Jun", "Sep", "Des"], weeks: { 16: 1, 25: 1, 38: 1, 50: 1 }, actualWeeks: { 16: 1, 25: 1 }
  },
  {
    id: 31, iso45001: "", pp50: "", matlevKam: "", no: "6.1", subNo: "C", title: "Self Assessment Pada Inspekta",
    category: "6. PELAPORAN", categoryNum: "6. PELAPORAN",
    pic: "PJ OP KAM", biaya: "-", target: 4, actual: 4, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Apr", "Jun", "Sep", "Des"], weeks: { 16: 1, 25: 1, 37: 1, 50: 1 }, actualWeeks: { 3: 2, 8: 1, 11: 1 }
  },

  // 7. PROGRAM PENDUKUNG
  {
    id: 32, iso45001: "", pp50: "", matlevKam: "", no: "7", subNo: "A", title: "Pelatihan Tanggap Darurat",
    category: "7. PROGRAM PENDUKUNG", categoryNum: "7. PROGRAM PENDUKUNG",
    pic: "PJ OP KAM", biaya: "-", target: 2, actual: 2, status: "Selesai", prosedur: "-", folder: "-", link: "",
    months: ["Mar", "Jul"], weeks: { 10: 1, 29: 1 }, actualWeeks: { 10: 1, 29: 1 }
  }
];

export const MONTH_TO_WEEKS = {
  'Jan': [1,2,3,4,5], 'Feb': [6,7,8,9], 'Mar': [10,11,12,13], 'Apr': [14,15,16,17],
  'Mei': [18,19,20,21,22], 'Jun': [23,24,25,26], 'Jul': [27,28,29,30], 'Agu': [31,32,33,34,35],
  'Sep': [36,37,38,39], 'Okt': [40,41,42,43], 'Nov': [44,45,46,47], 'Des': [48,49,50,51,52,53]
};

export const TAB_WEEK_MAPPING = {
  'Semua': Array.from({ length: 53 }, (_, i) => i + 1),
  'Januari': [1,2,3,4,5], 'Februari': [6,7,8,9], 'Maret': [10,11,12,13], 'April': [14,15,16,17],
  'Mei': [18,19,20,21,22], 'Juni': [23,24,25,26], 'Juli': [27,28,29,30], 'Agustus': [31,32,33,34,35],
  'September': [36,37,38,39], 'Oktober': [40,41,42,43], 'November': [44,45,46,47], 'Desember': [48,49,50,51,52,53]
};

export const WEEK_DATES = {
  1:"01/01-04/01",2:"05/01-11/01",3:"12/01-18/01",4:"19/01-25/01",5:"26/01-01/02",6:"02/02-08/02",7:"09/02-15/02",8:"16/02-22/02",9:"23/02-01/03",10:"02/03-08/03",
  11:"09/03-15/03",12:"16/03-22/03",13:"23/03-29/03",14:"30/03-05/04",15:"06/04-12/04",16:"13/04-19/04",17:"20/04-26/04",18:"27/04-03/05",19:"04/05-10/05",20:"11/05-17/05",
  21:"18/05-24/05",22:"25/05-31/05",23:"01/06-07/06",24:"08/06-14/06",25:"15/06-21/06",26:"22/06-28/06",27:"29/06-05/07",28:"06/07-12/07",29:"13/07-19/07",30:"20/07-26/07",
  31:"27/07-02/08",32:"03/08-09/08",33:"10/08-16/08",34:"17/08-23/08",35:"24/08-30/08",36:"31/08-06/09",37:"07/09-13/09",38:"14/09-20/09",39:"21/09-27/09",40:"28/09-04/10",
  41:"05/10-11/10",42:"12/10-18/10",43:"19/10-25/10",44:"26/10-01/11",45:"02/11-08/11",46:"09/11-15/11",47:"16/11-22/11",48:"23/11-29/11",49:"30/11-06/12",50:"07/12-13/12",
  51:"14/12-20/12",52:"21/12-27/12",53:"28/12-03/01"
};

export const PREDEFINED_ACTIVITIES = {
  '1': ["Dokumen RKAP", "Inspeksi Manager UP", "Pendokumentasian Lokasi penempatan Aset CCTV dan Portal", "Review Peta Zona Keamanan", "Integrasi pemantauan Pengamanan", "Penyusunan Renpam"],
  '2': ["Melakukan PKT dengan Polda Lampung", "Pengamanan Siaga Idul Fitri 2026", "Pengamanan Siaga Hari Besar Nasional", "Pengamanan Siaga Natal 2026 dan Tahun Baru 2026", "Sosialisasi internal Peningkatan Pemahaman Sistem Pengamanan"],
  '3': ["SK TIM Implementasi SMP", "Workplan implementasi SMP", "Audit Internal (Jadwal, Undangan dan LHA) dan Tindaklanjut", "RTM SMP (Jadwal, Undangan, Absensi, Dokumentasi, Notulen)", "Audit BUJP (Undangan, Absensi, Dokumentasi, BA, Monitoring Tindaklanjut)"],
  '4': ["Peta Kerawanan Internal", "Peta Kerawanan POLRI", "SOP Pengendalian Keamanan", "Tindaklanjut Kerawanan", "Prosedur dan Program Kerja Pencegahan Terorisme", "Sosialisasi Internal Pencegahan Terorisme kepada 100% Struktural (Undangan, Materi, Absensi, Dokumentasi), Kuisioner", "Dokumen Analisa Resiko Pengamanan", "Dokumen Objek Target Program", "Dokumen Rencana Kontijensi Pengamanan"],
  '5': ["Sertifikasi Gada Utama", "Pembinaan Teknis Gada Utama Kepada Satpam", "Sertifikasi Auditor SMP"],
  '6': ["Laporan Bulanan", "Laporan Matlev", "Self Assessment Pada Inspekta"],
  '7': ["Pelatihan Tanggap Darurat"]
};