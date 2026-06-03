import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhotoMemory } from "../types";
import { Sparkles, Calendar, BookOpen, Quote, X, ChevronLeft, ChevronRight, Eye, Heart, Play, Film, Image as ImageIcon } from "lucide-react";

interface MemoryGalleryProps {
  memories: PhotoMemory[];
}

// Media source detector helpers
const isYouTubeUrl = (url: string) => {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
  } else if (url.includes("youtube.com/watch")) {
    try {
      const parts = url.split("?");
      if (parts.length > 1) {
        const searchParams = new URLSearchParams(parts[1]);
        videoId = searchParams.get("v") || "";
      }
    } catch (e) {
      console.error(e);
    }
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1]?.split("?")[0]?.split("&")[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0` : url;
};

const isGoogleDriveUrl = (url: string) => {
  if (!url) return false;
  return url.includes("drive.google.com");
};

const getGoogleDriveEmbedUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("/view")) {
    return url.replace("/view", "/preview");
  }
  return url;
};

export default function MemoryGallery({ memories }: MemoryGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");

  const filteredMemories = memories.filter((m) => {
    if (filter === "all") return true;
    if (filter === "photo") return m.type !== "video";
    if (filter === "video") return m.type === "video";
    return true;
  });

  const activeMemory = selectedIdx !== null ? filteredMemories[selectedIdx] : null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx + 1) % filteredMemories.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx - 1 + filteredMemories.length) % filteredMemories.length);
  };

  const handleClose = () => {
    setSelectedIdx(null);
  };

  // Keyboard navigation inside modal
  React.useEffect(() => {
    if (selectedIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % filteredMemories.length : null));
      } else if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) => (prev !== null ? (prev - 1 + filteredMemories.length) % filteredMemories.length : null));
      } else if (e.key === "Escape") {
        setSelectedIdx(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, filteredMemories.length]);

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto z-10 relative">
      <div className="text-center mb-6">
        <h3 className="font-serif text-3xl text-rose-900 font-bold tracking-tight mb-2 flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-rose-500" />
          Galeri Kenangan Indah Kita
        </h3>
        <p className="text-rose-700/80 max-w-xl mx-auto text-sm sm:text-base">
          Kumpulan momen-momen manis, tawa riang, dan petualangan yang kita jalani bersama, membentuk kisah cinta terindah kita.
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mt-4"></div>
      </div>

      {/* Category/Media Filter tabs with counts */}
      <div className="flex justify-center items-center gap-2 mb-10 bg-white/80 backdrop-blur-sm p-1 rounded-2xl border border-rose-100 shadow-sm max-w-xs sm:max-w-md mx-auto relative z-10">
        <button
          onClick={() => { setFilter("all"); setSelectedIdx(null); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold font-serif transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            filter === "all"
              ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200"
              : "text-rose-800 hover:bg-rose-50/50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Semua ({memories.length})
        </button>
        <button
          onClick={() => { setFilter("photo"); setSelectedIdx(null); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold font-serif transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            filter === "photo"
              ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200"
              : "text-rose-800 hover:bg-rose-50/50"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Foto ({memories.filter(m => m.type !== "video").length})
        </button>
        <button
          onClick={() => { setFilter("video"); setSelectedIdx(null); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold font-serif transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            filter === "video"
              ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-md shadow-rose-200"
              : "text-rose-800 hover:bg-rose-50/50"
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          Video ({memories.filter(m => m.type === "video").length})
        </button>
      </div>

      {/* Modern Bento-style or balanced Grid with staggered motion */}
      {filteredMemories.length === 0 ? (
        <motion.div 
          className="text-center py-16 bg-white/50 backdrop-blur-sm border border-rose-100 rounded-3xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-stone-500 text-sm font-sans mb-2">Belum ada media di kategori ini.</p>
          <p className="text-xs text-rose-500/80">Silakan tambahkan momen baru di menu Pengaturan!</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredMemories.map((memory, idx) => (
            <motion.div
              key={memory.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-rose-100/50 flex flex-col cursor-pointer transition-all relative"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              onClick={() => setSelectedIdx(idx)}
              id={`memory-card-${idx}`}
            >
              {/* Image/Media section with premium effects */}
              <div className="relative aspect-video sm:aspect-square overflow-hidden bg-rose-50/50">
                <img
                  src={memory.imageUrl || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1000&auto=format&fit=crop&q=80"}
                  alt={memory.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Play overlay for Video memory */}
                {memory.type === "video" ? (
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center transition-all duration-300 group-hover:bg-black/35">
                    <div className="p-4 rounded-full bg-white/95 text-rose-600 shadow-xl border border-rose-100 flex items-center justify-center transform transition-transform group-hover:scale-110 duration-300">
                      <Play className="w-6 h-6 fill-rose-600 ml-0.5 animate-pulse" />
                    </div>
                    {/* Floating Video tag */}
                    <div className="absolute top-3 right-3 bg-rose-600/90 text-white font-bold text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm font-sans">
                      <Film className="w-2.5 h-2.5" /> VIDEO
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <span className="bg-white/95 text-rose-900 px-4 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Lihat Cerita
                    </span>
                  </div>
                )}
                
                {/* Floating Date badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-rose-800 text-[11px] font-semibold border border-rose-100 flex items-center gap-1 shadow-sm">
                  <Calendar className="w-3 h-3 text-rose-500" />
                  {new Date(memory.date).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              {/* Title & Short Story intro */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-rose-50/10">
                <div>
                  <h4 className="font-serif text-lg text-rose-950 font-bold group-hover:text-rose-700 transition-colors duration-200">
                    {memory.title}
                  </h4>
                  <p className="mt-2 text-zinc-600 text-xs sm:text-sm line-clamp-2 leading-relaxed h-[40px] overflow-hidden">
                    {memory.story}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-50 flex items-center text-[10px] text-zinc-400 font-mono tracking-wider">
                  <span>{memory.type === "video" ? "🎥 VIDEO" : "📸 FOTO"} - {(idx + 1).toString().padStart(2, "0")}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* FLOATING LIGHTBOX / MODAL */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            id="gallery-modal-overlay"
          >
            {/* Navigation buttons: Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white hover:scale-105 p-3 rounded-full transition-all cursor-pointer hidden sm:flex items-center justify-center border border-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Navigation buttons: Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white hover:scale-105 p-3 rounded-full transition-all cursor-pointer hidden sm:flex items-center justify-center border border-white/10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              className="bg-white max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl relative flex flex-col border border-rose-100"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 90 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when modal card clicked
              id="gallery-modal-container"
            >
              {/* Close Button top-right */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-neutral-900/85 hover:bg-neutral-950 text-white p-2 rounded-full transition-all shadow cursor-pointer z-20 hover:scale-105 border border-white/10"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo or Video Display Frame */}
              <div className="relative aspect-[3/2] max-h-[420px] bg-neutral-950 flex items-center justify-center overflow-hidden">
                {activeMemory.type === "video" ? (
                  isYouTubeUrl(activeMemory.videoUrl || "") ? (
                    <iframe
                      src={getYouTubeEmbedUrl(activeMemory.videoUrl || "")}
                      title={activeMemory.title}
                      className="w-full h-full aspect-[3/2] min-h-[300px] sm:min-h-[380px] border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : isGoogleDriveUrl(activeMemory.videoUrl || "") ? (
                    <iframe
                      src={getGoogleDriveEmbedUrl(activeMemory.videoUrl || "")}
                      title={activeMemory.title}
                      className="w-full h-full aspect-[3/2] min-h-[300px] sm:min-h-[380px] border-0"
                      allow="autoplay"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video
                      src={activeMemory.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full min-h-[300px] sm:min-h-[380px] object-contain bg-black"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <img
                    src={activeMemory.imageUrl || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1000&auto=format&fit=crop&q=80"}
                    alt={activeMemory.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                {/* Mobile Navigation overlay taps (left half, right half) */}
                <div className="absolute inset-y-0 left-0 w-1/4 cursor-pointer sm:hidden flex items-center pl-2" onClick={handlePrev}>
                  <div className="bg-black/45 p-2 rounded-full text-white">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 w-1/4 cursor-pointer sm:hidden flex items-center justify-end pr-2" onClick={handleNext}>
                  <div className="bg-black/45 p-2 rounded-full text-white">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Memory Details Section */}
              <div className="p-6 md:p-8 bg-gradient-to-b from-white to-rose-50/5 relative">
                {/* Bottom background flower detail */}
                <div className="absolute right-0 bottom-0 p-4 text-rose-500/5 select-none pointer-events-none">
                  <Heart className="w-24 h-24 stroke-current fill-current" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h4 className="font-serif text-xl md:text-2xl text-rose-950 font-bold flex items-center gap-2">
                    {activeMemory.type === "video" ? (
                      <Film className="w-5 h-5 text-rose-500 shrink-0" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    {activeMemory.title}
                  </h4>
                  <span className="bg-rose-50 text-rose-800 text-xs px-3.5 py-1 rounded-full font-semibold border border-rose-100 flex items-center gap-1 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    {new Date(activeMemory.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Main Story Content */}
                <div className="mt-4 text-zinc-700 leading-relaxed text-sm md:text-base border-l-4 border-rose-200 pl-4 py-1 italic relative flex items-start gap-2 bg-rose-50/20 rounded p-3">
                  <Quote className="w-8 h-8 text-rose-300 opacity-60 shrink-0 -mt-1" />
                  <p className="flex-1 font-serif text-stone-800 select-text">
                    {activeMemory.story}
                  </p>
                </div>

                {/* Index Indicator */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-rose-100/60 text-xs text-zinc-400">
                  <span className="font-semibold text-rose-700/60">♥ Kisah Indah Kita</span>
                  <span>Momen {selectedIdx! + 1} dari {filteredMemories.length} ({activeMemory.type === "video" ? "Video" : "Foto"})</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
