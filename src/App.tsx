import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Calendar, 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Settings, 
  MessageCircle, 
  Send,
  Camera,
  Layers,
  HeartHandshake
} from "lucide-react";

import { AnniversarySettings, WishItem } from "./types";
import { DEFAULT_SETTINGS } from "./defaultData";
import FloatingHearts from "./components/FloatingHearts";
import LoveLetter from "./components/LoveLetter";
import MemoryGallery from "./components/MemoryGallery";
import AnniversarySettingsDrawer from "./components/AnniversarySettingsDrawer";

export default function App() {
  // Load settings from localStorage or fallback to default
  const [settings, setSettings] = useState<AnniversarySettings>(() => {
    const saved = localStorage.getItem("anniversary_settings_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clean missing fields if any
        return { ...DEFAULT_SETTINGS, ...parsed };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const [newWishName, setNewWishName] = useState("");
  const [newWishMessage, setNewWishMessage] = useState("");
  const [isLetterOpened, setIsLetterOpened] = useState(false);

  // Time elapsed state
  const [timeElapsed, setTimeElapsed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Calculate duration since anniversary date
  const updateCountdown = () => {
    const start = new Date(settings.anniversaryDate);
    const now = new Date();
    
    if (isNaN(start.getTime())) return;

    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    let days = now.getDate() - start.getDate();

    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    let hours = now.getHours() - start.getHours();
    let minutes = now.getMinutes() - start.getMinutes();
    let seconds = now.getSeconds() - start.getSeconds();

    if (seconds < 0) {
      seconds += 60;
      minutes--;
    }
    if (minutes < 0) {
      minutes += 60;
      hours--;
    }
    if (hours < 0) {
      hours += 24;
      days--;
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
        if (months < 0) {
          months += 12;
          years--;
        }
      }
    }

    const totalDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    setTimeElapsed({ years, months, days, hours, minutes, seconds, totalDays });
  };

  // Run on start and update every second
  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings.anniversaryDate]);

  // Audio loading & control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(settings.audioUrl);
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;
    audioRef.current = audio;

    if (isMusicPlaying) {
      audio.play().catch((err) => {
        console.log("Autoplay blocked or audio load error. Waiting for user interaction.");
        setIsMusicPlaying(false);
      });
    }

    return () => {
      audio.pause();
    };
  }, [settings.audioUrl]);

  // Update volume & muting
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch((e) => {
        console.warn("Audio playback was interrupted or blocked by the browser. Interaction required first.", e);
        setIsMusicPlaying(false);
      });
    }
  };

  const handleGlobalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid triggering bursts on forms, sliders, settings panel
    const target = e.target as HTMLElement;
    if (
      target.closest("button") || 
      target.closest("input") || 
      target.closest("textarea") || 
      target.closest("select") || 
      target.closest("#love-letter-modal-paper") ||
      target.closest("#gallery-modal-container")
    ) {
      return;
    }
    setBurstTrigger({
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    });
  };

  const handleSaveSettings = (newSettings: AnniversarySettings) => {
    setSettings(newSettings);
    localStorage.setItem("anniversary_settings_v1", JSON.stringify(newSettings));
    
    // Play sound from new URL if playing
    if (isMusicPlaying && audioRef.current) {
      audioRef.current.pause();
      const audio = new Audio(newSettings.audioUrl);
      audio.loop = true;
      audio.volume = isMuted ? 0 : volume;
      audioRef.current = audio;
      audio.play().catch(() => setIsMusicPlaying(false));
    }
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishMessage.trim()) return;

    const newWish: WishItem = {
      id: "wish-" + Date.now(),
      sender: newWishName.trim(),
      message: newWishMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedWishes = [newWish, ...settings.wishes];
    const updatedSettings = { ...settings, wishes: updatedWishes };

    setSettings(updatedSettings);
    localStorage.setItem("anniversary_settings_v1", JSON.stringify(updatedSettings));
    setNewWishName("");
    setNewWishMessage("");

    // Trigger romantic hearts storm burst!
    setBurstTrigger({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      time: Date.now()
    });
  };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col justify-between overflow-x-hidden"
      onClick={handleGlobalClick}
    >
      {/* Background Floating Hearts */}
      <FloatingHearts burstTrigger={burstTrigger} />

      {/* Hero Header Decoration Top */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-rose-100/50 via-rose-50/20 to-transparent pointer-events-none -z-10"></div>

      {/* TOP FLOATING / FIXED HERO ACTION CONTROLS */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-rose-50/60 transition-all font-sans">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600 animate-pulse" />
            <span className="font-serif font-bold text-rose-900 tracking-wide text-base md:text-lg">
              {settings.coupleName1} ♥ {settings.coupleName2}
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-rose-950 font-medium font-sans">
            <button onClick={() => scrollToSection("hero")} className="hover:text-rose-600 transition-colors cursor-pointer">Timer</button>
            <button onClick={() => scrollToSection("letter")} className="hover:text-rose-600 transition-colors cursor-pointer">Surat Cinta</button>
            <button onClick={() => scrollToSection("gallery")} className="hover:text-rose-600 transition-colors cursor-pointer">Galeri Kenangan</button>
            <button onClick={() => scrollToSection("wishes")} className="hover:text-rose-600 transition-colors cursor-pointer">Harapan Kita</button>
          </nav>

          <div className="flex items-center gap-2">
            {/* Quick Play Control with Wave visualizer */}
            <button
              onClick={toggleMusic}
              className={`flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold shadow-sm transition-all border cursor-pointer ${
                isMusicPlaying 
                  ? "bg-rose-50 border-rose-200 text-rose-800" 
                  : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
              }`}
              title={isMusicPlaying ? "Pause musik" : "Play musik latar"}
            >
              <div className="flex h-3 items-center gap-[2px]">
                <span className={`block w-[2px] bg-rose-600 rounded-full ${isMusicPlaying ? "h-3 animate-bounce" : "h-1.5"}`} style={{ animationDelay: "0.1s" }}></span>
                <span className={`block w-[2px] bg-rose-600 rounded-full ${isMusicPlaying ? "h-2.5 animate-bounce" : "h-1.5"}`} style={{ animationDelay: "0.3s" }}></span>
                <span className={`block w-[2px] bg-rose-600 rounded-full ${isMusicPlaying ? "h-3 animate-bounce" : "h-1.5"}`} style={{ animationDelay: "0.5s" }}></span>
              </div>
              <span className="hidden sm:inline-block">Musik Latar</span>
            </button>

            {/* Customization Cog */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer hover:rotate-45"
              title="Atur Halaman"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 relative z-10 flex flex-col gap-16 pb-20">

        {/* HERO SECTION */}
        <section id="hero" className="min-h-[85vh] flex flex-col justify-center items-center text-center pt-8 md:pt-12">
          {/* Aesthetic Intro Emblem */}
          <motion.div 
            className="mb-4 inline-flex items-center justify-center p-3 rounded-full bg-rose-50 border border-rose-100 shadow-inner"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
          </motion.div>

          <motion.h1 
            className="font-cursive text-5xl sm:text-7xl text-rose-600 tracking-wide select-none"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {settings.coupleName1} & {settings.coupleName2}
          </motion.h1>

          <motion.h2 
            className="font-serif text-2xl sm:text-4xl lg:text-5xl text-rose-950 font-bold tracking-tight mt-3 mb-1 font-semibold"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {settings.greetingTitle}
          </motion.h2>

          {/* Special date badge */}
          <motion.div
            className="mt-4 px-4 py-1.5 bg-rose-50/80 backdrop-blur-xs rounded-full border border-rose-100/60 shadow-xs flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Calendar className="w-4 h-4 text-rose-500" />
            Mulai Sejak : {new Date(settings.anniversaryDate).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </motion.div>

          {/* TIMER COMPONENT */}
          <motion.div 
            className="mt-10 w-full max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, delay: 0.5 }}
          >
            <h3 className="text-xs font-bold text-rose-700/80 uppercase tracking-widest mb-4 font-sans">
              Waktu yang Telah Kita Lalui Bersama:
            </h3>

            {/* Countdown / Count-up Display Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {[
                { label: "Tahun", val: timeElapsed.years },
                { label: "Bulan", val: timeElapsed.months },
                { label: "Hari", val: timeElapsed.days },
                { label: "Jam", val: timeElapsed.hours },
                { label: "Menit", val: timeElapsed.minutes },
                { label: "Detik", val: timeElapsed.seconds },
              ].map((item, index) => (
                <div 
                  key={item.label}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-5 border border-rose-100/50 shadow-md hover:shadow-xl hover:border-rose-200/50 transition-all flex flex-col justify-center items-center"
                >
                  <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rose-900 tracking-tight leading-none animate-none">
                    {item.val}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-rose-600/80 mt-1 sm:mt-2 tracking-wider">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Days summary */}
            <p className="mt-6 text-xs sm:text-sm text-rose-800/80 font-medium">
              Atau setara dengan <span className="font-bold underline text-rose-900">{timeElapsed.totalDays.toLocaleString("id-ID")} hari</span> yang dipenuhi canda, tawa, dan kebahagiaan bersamamu. ♥
            </p>
          </motion.div>

          {/* Play CTA if music and is paused */}
          {!isMusicPlaying && (
            <motion.div
              className="mt-8 flex flex-col items-center justify-center p-4 bg-white/60 backdrop-blur-xs border border-rose-100/50 rounded-2xl shadow-inner max-w-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <button
                onClick={toggleMusic}
                className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-full shadow-md animate-pulse cursor-pointer hover:scale-105 transition-all flex items-center justify-center"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
              <span className="mt-2 text-xs font-semibold text-rose-900">Putar lagu romantis pendamping kisah kita</span>
            </motion.div>
          )}

          {/* Scroll Down Visual Hint */}
          <div className="absolute bottom-6 left-1/2 -track-x-1/2 flex flex-col items-center gap-1 opacity-70 animate-bounce cursor-pointer" onClick={() => scrollToSection("letter")}>
            <span className="text-[10px] text-rose-800 font-mono tracking-wider">GULIR KE BAWAH</span>
            <div className="w-1 h-3 bg-rose-500 rounded-full"></div>
          </div>
        </section>

        {/* LOVE LETTER SECTION */}
        <section id="letter" className="scroll-mt-14 py-8 border-t border-rose-100/40 relative">
          {/* Decorative side shape */}
          <div className="absolute left-0 top-1/2 w-48 h-48 bg-rose-100/20 blur-3xl rounded-full -z-10"></div>
          <div className="absolute right-0 top-1/3 w-48 h-48 bg-amber-100/20 blur-3xl rounded-full -z-10"></div>

          <LoveLetter 
            text={settings.loveLetterText} 
            signature={settings.loveLetterSign}
            onOpenStateChange={setIsLetterOpened}
          />
        </section>

        {/* MEMORY GALLERY SECTION */}
        <section id="gallery" className="scroll-mt-14 py-8 border-t border-rose-100/40">
          <MemoryGallery memories={settings.memories} />
        </section>

        {/* WISHES & FUTURE HOPE SECTION */}
        <section id="wishes" className="scroll-mt-14 py-12 border-t border-rose-100/40 w-full max-w-3xl mx-auto text-center">
          <div className="mb-10">
            <h3 className="font-serif text-3xl text-rose-900 font-bold tracking-tight mb-2 flex items-center justify-center gap-2">
              <HeartHandshake className="w-6 h-6 text-rose-500" />
              Harapan Masa Depan Kita
            </h3>
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mt-4"></div>
          </div>

          {/* Centered Future Wishes visual card */}
          <div className="bg-gradient-to-tr from-rose-900 to-rose-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[260px] text-center max-w-2xl mx-auto">
            {/* Aesthetic glass effects */}
            <div className="absolute -top-[50px] -right-[50px] w-64 h-64 bg-rose-600/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-[50px] -left-[50px] w-64 h-64 bg-rose-500/10 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <Heart className="w-12 h-12 text-rose-300 fill-rose-400 mb-6 animate-pulse" />
              <p className="text-rose-100/95 text-base sm:text-lg lg:text-xl leading-relaxed font-serif italic max-w-xl">
                "{settings.futureWishesText}"
              </p>
            </div>

            <div className="mt-8 border-t border-rose-800/50 pt-4 relative z-10 flex justify-between items-center text-xs text-rose-300">
              <span>Selamanya Bersama</span>
              <span className="font-mono">♥ {settings.coupleName1} & {settings.coupleName2}</span>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-rose-950 font-sans text-rose-200 py-10 px-4 text-center mt-auto border-t border-rose-900 relative z-10">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-1.5">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
            <span className="font-serif font-bold text-lg tracking-wider text-rose-50">
              {settings.coupleName1} & {settings.coupleName2}
            </span>
          </div>
          <p className="text-xs text-rose-200/60 max-w-md mx-auto leading-relaxed">
            Dibuat khusus sebagai pengingat abadi bahwa cinta sejati selalu menguatkan dan tumbuh seiring berjalannya setiap detik waktu.
          </p>
          <div className="pt-3 border-t border-rose-900 text-[10px] text-rose-300/40 flex justify-between items-center max-w-sm mx-auto">
            <span>© 2026 Anniversary Page</span>
            <span>Made with Love ♥</span>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BOTTOM LEFT - MUSIC STATS */}
      {isMusicPlaying && (
        <div className="fixed bottom-4 left-4 z-40 bg-white/80 backdrop-blur-md py-1.5 px-3 rounded-full shadow-lg border border-rose-100/50 flex items-center gap-2 max-w-[200px] pointer-events-auto">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="text-rose-600 hover:text-rose-800 p-1 rounded-full hover:bg-rose-50 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div className="hidden sm:flex flex-col text-[10px] pr-1 overflow-hidden">
            <span className="font-semibold text-rose-950 truncate max-w-[100px]">Sedang diputar</span>
            <span className="text-zinc-400 truncate max-w-[100px] font-mono text-[9px]">Romantic Melody.mp3</span>
          </div>
        </div>
      )}

      {/* ATUR DRAWER SETTINGS PANEL */}
      <AnniversarySettingsDrawer
        settings={settings}
        onSave={handleSaveSettings}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
