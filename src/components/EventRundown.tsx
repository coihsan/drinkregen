import React, { useState, useCallback } from 'react';
import { Clock, Sparkles, MapPin, ArrowRight, Zap } from 'lucide-react';
import { FormattedText } from './FormattedText';

// Tipe data untuk setiap item agenda
interface AgendaItem {
  id: string;
  day: 1 | 2;
  time: string;
  duration: string;
  title: string;
  description?: string;
  type: 'main' | 'break' | 'activity' | 'party';
}

// Data rundown diambil dari gambar referensi
const scheduleData: AgendaItem[] = [
  // HARI 1
  {
    id: 'd1-1', day: 1, time: '09.00 - 09.30', duration: "30'",
    title: 'Arrival & Registration',
    description: 'Registrasi ulang peserta, pembagian **Welcome Kit**',
    type: 'activity'
  },
  {
    id: 'd1-2', day: 1, time: '09.30 - 10.00', duration: "30'",
    title: 'Opening & Keynote Speech',
    description: 'Sambutan dari Manajemen (Visi Misi 2026) & pengenalan Board',
    type: 'main'
  },
  {
    id: 'd1-3', day: 1, time: '10.00 - 10.30', duration: "30'",
    title: 'Product Knowledge & Quiz',
    description: 'Pengenalan produk **REGEN** dan **New Design**',
    type: 'main'
  },
  {
    id: 'd1-4', 
    day: 1, 
    time: '10.30 - 11.30', 
    duration: "60'",
    title: 'Marketing Bussiness Plan',
    description: 'Pemaparan strategi **marketing global**, **macroeconomy looks**, support promosi untuk distributor, dan peluncuran new campaign.',
    type: 'main'
  },
  {
    id: 'd1-5', day: 1, time: '11.30 - 13.00', duration: "90'",
    title: 'Lunch & Networking',
    type: 'break'
  },
  {
    id: 'd1-6', day: 1, time: '13.00 - 14.00', duration: "60'",
    title: 'Guest Speaker Session',
    type: 'main'
  },
  {
    id: 'd1-7', day: 1, time: '14.00 - 14.30', duration: "30'",
    title: 'Coffee Break & Networking',
    description: 'Istirahat sore, product sampling booth',
    type: 'break'
  },
  {
    id: 'd1-8', day: 1, time: '14.30 - 16.30', duration: "120'",
    title: 'Business Plan Review & Target Q3-Q4',
    description: 'Sesi paralel/breakout room: Distributor memaparkan rencana 3 bulan ke depan & komitmen target 2026 kepada tim regional. (Dijadikan kompetisi)',
    type: 'activity'
  },
  {
    id: 'd1-9', day: 1, time: '16.30 - 17.30', duration: "60'",
    title: 'Rest & Preparation',
    description: 'Istirahat dan persiapan baju untuk Gala Dinner',
    type: 'break'
  },
  {
    id: 'd1-10', day: 1, time: '17.30 - 19.00', duration: "90'",
    title: 'Gala Dinner & Photo Session',
    description: 'Makan malam resmi, pemberian sertifikat, sesi foto memakai jaket **REGEN**',
    type: 'party'
  },

  // HARI 2
  {
    id: 'd2-1', day: 2, time: '07.00 - 10.00', duration: "180'",
    title: 'Regen Energy Activation',
    description: 'Fun Padel + Regen Sampling',
    type: 'activity'
  },
  {
    id: 'd2-2', day: 2, 
    time: '10.00 - 11.00', 
    duration: "90'",
    title: 'Brunch & Feedback Forum',
    description: 'Makan pagi di restoran Rimbun Sunda. Sesi santai (dua arah): Manajemen mendengarkan masukan, kendala di lapangan, dan apa yang butuh dibantu dari pusat.',
    type: 'main'
  },
  {
    id: 'd2-3', day: 2, time: '11.30 - 13.00', duration: "90'",
    title: 'Check-out & Farewell',
    description: 'Pengembalian kunci kamar',
    type: 'break'
  }
];

// Helper warna untuk gaya Neo-Brutalism (Gen-Z style)
const getTypeColor = (type: AgendaItem['type']) => {
  switch (type) {
    case 'main':
      return 'bg-[var(--regen-coral-soft)]'; // Pink
    case 'break':
      return 'bg-[var(--regen-gold)]'; // Orange
    case 'activity':
      return 'bg-[var(--regen-electric)]'; // Lime
    case 'party':
      return 'bg-[var(--regen-green)]'; // Green
    default:
      return 'bg-white';
  }
};

const getTypeLabel = (type: AgendaItem['type']) => {
  switch (type) {
    case 'main': return 'Main Event';
    case 'break': return 'Break';
    case 'activity': return 'Activity';
    case 'party': return 'Party';
    default: return 'Event';
  }
};

export default function EventRundown() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  // Fungsi untuk membunyikan suara 'pop' bergaya UI modern tanpa menggunakan file eksternal/base64
  const playClickSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Setting frekuensi untuk suara "pop" yang ceria
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
      
      // Setting volume (fade out cepat)
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.log("Audio not supported or interaction required first.");
    }
  }, []);

  const handleTabClick = (day: 1 | 2) => {
    playClickSound();
    setActiveDay(day);
  };

  const activeSchedule = scheduleData.filter((item) => item.day === activeDay);

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans overflow-hidden relative">
      
      <div className="w-full mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 text-center pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-black text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
            <Sparkles className="w-5 h-5 text-[var(--regen-gold)]" fill="var(--regen-gold)" />
            <span>Official Rundown</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none uppercase">
            THE <span className="bg-[var(--regen-electric)] px-2 py-1 border-4 border-black inline-block shadow-[6px_6px_0px_rgba(0,0,0,1)] transform rotate-2">AGENDA</span>
          </h2>
          <p className="text-gray-700 font-medium max-w-xl mx-auto text-lg border-b-2 border-dashed border-gray-400 pb-6">
            Jadwal kegiatan lengkap <span className="uppercase font-bold">regenation 2026</span>. Siapkan energimu dan mari ciptakan pengalaman tak terlupakan bersama-sama! ⚡️
          </p>
        </div>

        {/* Day Selector (Tabs) - Neo Brutalism Style */}
        <div className="flex justify-center gap-4 md:gap-6 mb-16">
          <button
            onClick={() => handleTabClick(1)}
            className={`relative px-8 py-3 rounded-xl font-black text-lg transition-all duration-200 border-4 border-black flex items-center gap-2 ${
              activeDay === 1
                ? 'bg-[var(--regen-coral-soft)] translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-gray-100 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]'
            }`}
          >
            DAY 1
            {activeDay === 1 && <Zap className="w-5 h-5" fill="black" />}
          </button>
          
          <button
            onClick={() => handleTabClick(2)}
            className={`relative px-8 py-3 rounded-xl font-black text-lg transition-all duration-200 border-4 border-black flex items-center gap-2 ${
              activeDay === 2
                ? 'bg-[var(--regen-green)] translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-gray-100 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)]'
            }`}
          >
            DAY 2
            {activeDay === 2 && <Zap className="w-5 h-5" fill="black" />}
          </button>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-4 border-black ml-4 md:ml-8 space-y-10 pb-20">
          {activeSchedule.map((item, index) => (
            <div 
              key={item.id} 
              className="relative pl-8 md:pl-12 group"
              style={{
                animation: 'fade-in-up 0.5s ease-out forwards',
                animationDelay: `${index * 100}ms`,
                opacity: 0, // Will be overridden by animation if added to global css, otherwise acts as a fallback structure
              }}
            >
              {/* Timeline Dot (Brutalist style) */}
              <div className="absolute left-[-14px] top-4 w-6 h-6 rounded-full bg-white border-4 border-black group-hover:bg-[var(--regen-electric)] group-hover:scale-125 transition-all duration-300 z-10 shadow-[2px_2px_0px_rgba(0,0,0,1)]"></div>
              
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
                
                {/* Time Column */}
                <div className="flex-shrink-0 w-32 pt-3">
                  <div className="font-mono text-2xl font-black text-black tracking-tighter bg-white border-2 border-black px-2 py-1 rounded-md inline-block shadow-[2px_2px_0px_rgba(0,0,0,1)] transform -rotate-1">
                    {item.time.split(' - ')[0]}
                  </div>
                  <div className="text-sm font-bold text-gray-600 mt-3 flex items-center gap-1.5 ml-1">
                    <Clock className="w-4 h-4" strokeWidth={3} />
                    <span>{item.duration}</span>
                  </div>
                </div>

                {/* Content Card (Neo Brutalism) */}
                <div 
                  className="flex-grow w-full bg-white border-4 border-black rounded-2xl p-6 transition-all duration-200 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] cursor-crosshair"
                  onClick={playClickSound}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <h3 className="text-xl md:text-2xl font-black text-black leading-tight max-w-[70%]">
                      {item.title}
                    </h3>
                    
                    {/* Tag label with specific color based on type */}
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black border-2 border-black uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)] ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-gray-700 text-sm md:text-base font-medium leading-relaxed border-l-4 border-[var(--regen-gold)] pl-3">
                      <FormattedText text={item.description} />
                    </p>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Inline styles for keyframe animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}