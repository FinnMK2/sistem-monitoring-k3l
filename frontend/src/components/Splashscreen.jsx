import React from 'react';

// Pemetaan gambar latar belakang dinamis sekuensial yang pudar & putih bersih
const BG_IMAGES = {
  1: "url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200')", // #1 : Panel Surya (Energi Terbarukan Baru)
  2: "url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1200')", // Energy : Kincir Angin (EBT)
  3: "url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200')", // Solutions : Jaringan Transmisi Listrik
  4: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1200')", // Company : Kelestarian Lingkungan / Hutan Hijau
  5: "none" // PLN Logo : Putih bersih polos
};

export default function Splashscreen({ splashStep }) {
  const currentBg = BG_IMAGES[splashStep] || "none";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-slate-800 transition-colors duration-1000 select-none relative overflow-hidden">
      
      {/* Gambar Latar Belakang - Desaturasi tinggi & keterangan tinggi (Tampilan Faded Putih Premium) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-[600ms] ease-in-out"
        style={{
          backgroundImage: currentBg,
          filter: 'saturate(15%) brightness(1.65) contrast(85%)',
          opacity: splashStep >= 1 && splashStep <= 4 ? 0.16 : 0 // Memudar halus ke 0 saat logo PLN muncul
        }}
      ></div>
      
      {/* Lapisan overlay putih transparan dengan efek blur halus */}
      <div className="absolute inset-0 bg-white/45 backdrop-blur-[1px]"></div>

      {/* Konten Teks Sekuensial Gelap Abu-abu Tua */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {/* Tahap 1: Teks "#1" */}
        <div className={`absolute transition-all duration-500 transform ${splashStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <span className="text-[120px] md:text-[180px] font-black tracking-tight text-[#444444] font-sans">#1</span>
        </div>

        {/* Tahap 2: Teks "Energy" */}
        <div className={`absolute transition-all duration-500 transform ${splashStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <span className="text-[70px] md:text-[120px] font-black tracking-tight text-[#444444] font-sans">Energy</span>
        </div>

        {/* Tahap 3: Teks "Solutions" */}
        <div className={`absolute transition-all duration-500 transform ${splashStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <span className="text-[70px] md:text-[120px] font-black tracking-tight text-[#444444] font-sans">Solutions</span>
        </div>

        {/* Tahap 4: Teks "Company" */}
        <div className={`absolute transition-all duration-500 transform ${splashStep === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <span className="text-[70px] md:text-[120px] font-black tracking-tight text-[#444444] font-sans">Company</span>
        </div>

        {/* Tahap 5: Logo PLN (Latar Belakang Putih Polos) */}
        <div className={`absolute transition-all duration-[800ms] transform ${splashStep === 5 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_PLN.svg" alt="PLN Logo" className="h-28 md:h-36 object-contain" />
        </div>
      </div>

    </div>
  );
}