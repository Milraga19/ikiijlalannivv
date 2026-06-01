import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhotoMemory } from "../types";
import { Sparkles, Calendar, BookOpen, Quote, X, ChevronLeft, ChevronRight, Eye, Heart } from "lucide-react";

interface MemoryGalleryProps {
  memories: PhotoMemory[];
}

export default function MemoryGallery({ memories }: MemoryGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const activeMemory = selectedIdx !== null ? memories[selectedIdx] : null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx + 1) % memories.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx === null) return;
    setSelectedIdx((selectedIdx - 1 + memories.length) % memories.length);
  };

  const handleClose = () => {
    setSelectedIdx(null);
  };

  // Keyboard navigation inside modal
  React.useEffect(() => {
    if (selectedIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setSelectedIdx((prev) => (prev !== null ? (prev + 1) % memories.length : null));
      } else if (e.key === "ArrowLeft") {
        setSelectedIdx((prev) => (prev !== null ? (prev - 1 + memories.length) % memories.length : null));
      } else if (e.key === "Escape") {
        setSelectedIdx(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx, memories.length]);

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto z-10 relative">
      <div className="text-center mb-10">
        <h3 className="font-serif text-3xl text-rose-900 font-bold tracking-tight mb-2 flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-rose-500" />
          Galeri Kenangan Indah Kita
        </h3>
        <p className="text-rose-700/80 max-w-xl mx-auto text-sm sm:text-base">
          Kumpulan momen-momen manis, tawa riang, dan petualangan yang kita jalani bersama, membentuk kisah cinta terindah kita.
        </p>
        <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-rose-300 to-transparent mx-auto mt-4"></div>
      </div>

      {/* Modern Bento-style or balanced Grid with staggered motion */}
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
              staggerChildren: 0.12
            }
          }
        }}
      >
        {memories.map((memory, idx) => (
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
            {/* Image section with premium zoom effect and hover mask */}
            <div className="relative aspect-video sm:aspect-square overflow-hidden bg-rose-50/50">
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                <span className="bg-white/95 text-rose-900 px-4 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> Lihat Cerita
                </span>
              </div>
              
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
                <p className="mt-2 text-zinc-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                  {memory.story}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-50 flex items-center text-[10px] text-zinc-400 font-mono tracking-wider">
                <span>MEM-{(idx + 1).toString().padStart(2, "0")}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* FLOATING LIGHTBOX / MODAL */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            id="gallery-modal-overlay"
          >
            {/* Navigation buttons: Left Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white hover:scale-105 p-3 rounded-full transition-all cursor-pointer hidden sm:flex items-center justify-center"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Navigation buttons: Right Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white hover:scale-105 p-3 rounded-full transition-all cursor-pointer hidden sm:flex items-center justify-center"
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
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all shadow cursor-pointer z-10 hover:scale-105"
                aria-label="Tutup foto"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo Display */}
              <div className="relative aspect-[3/2] max-h-[380px] bg-neutral-900 flex items-center justify-center overflow-hidden">
                <img
                  src={activeMemory.imageUrl}
                  alt={activeMemory.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Mobile Navigation overlay taps (left half, right half) */}
                <div className="absolute inset-y-0 left-0 w-1/4 cursor-pointer sm:hidden flex items-center pl-2" onClick={handlePrev}>
                  <div className="bg-black/30 p-1.5 rounded-full text-white">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 w-1/4 cursor-pointer sm:hidden flex items-center justify-end pr-2" onClick={handleNext}>
                  <div className="bg-black/30 p-1.5 rounded-full text-white">
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
                  <h4 className="font-serif text-xl md:text-2xl text-rose-950 font-bold">
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
                  <span>Momen {selectedIdx! + 1} dari {memories.length}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
