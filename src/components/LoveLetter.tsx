import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Mail, MailOpen, Compass, Sparkles, RefreshCw, Eye } from "lucide-react";

interface LoveLetterProps {
  text: string;
  signature: string;
  onOpenStateChange?: (isOpen: boolean) => void;
}

export default function LoveLetter({ text, signature, onOpenStateChange }: LoveLetterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullLetter, setShowFullLetter] = useState(false);

  useEffect(() => {
    if (onOpenStateChange) {
      onOpenStateChange(isOpen);
    }
  }, [isOpen, onOpenStateChange]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowFullLetter(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 select-none relative z-10 w-full max-w-lg mx-auto">
      <h3 className="font-serif text-2xl text-rose-800 text-center mb-6 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
        Surat Cinta Untukmu
        <Sparkles className="w-5 h-5 text-rose-500 animate-pulse" />
      </h3>

      {/* Envelope Container */}
      <div className="relative w-full h-[320px] flex items-center justify-center perspective-[1000px] cursor-pointer">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* CLOSED ENVELOPE */
            <motion.div
              key="closed-envelope"
              className="relative w-full max-w-[360px] h-[220px] bg-rose-50 rounded-lg shadow-2xl border-2 border-rose-100 flex flex-col justify-between overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleOpen}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              id="anniversary-closed-envelope"
            >
              {/* Back flap lines */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(253,244,245,0.8)_25%,transparent_25%,transparent_50%,rgba(253,244,245,0.8)_50%,rgba(253,244,245,0.8)_75%,transparent_75%,transparent)] bg-[length:40px_40px] opacity-30"></div>

              {/* Top opening flap simulation */}
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-rose-100/60 to-rose-50/20 border-b border-rose-200/50 clip-path-flap rounded-t-lg"></div>

              {/* Envelope Lines decorative */}
              <div className="absolute bottom-0 inset-x-0 h-[60%] bg-gradient-to-t from-rose-100/50 to-transparent"></div>

              {/* Center Stamp / Seal */}
              <div className="m-auto flex flex-col items-center justify-center z-10">
                <motion.div
                  className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center shadow-lg border-4 border-rose-50 text-white relative"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Heart className="w-8 h-8 fill-rose-50 text-rose-600" />
                  <span className="absolute -inset-1 rounded-full border-2 border-dashed border-rose-400 animate-spin" style={{ animationDuration: "12s" }}></span>
                </motion.div>
                <p className="mt-3 text-rose-800 text-xs font-semibold tracking-wider font-mono">Buka Surat Cintaku</p>
              </div>

              {/* Wax Seal aesthetic border sides */}
              <div className="absolute bottom-0 left-0 w-full p-3 font-serif italic text-[11px] text-rose-500/80 flex justify-between z-10">
                <span>Khusus Untukmu ♥</span>
                <span>Klik untuk Membuka</span>
              </div>
            </motion.div>
          ) : (
            /* OPENED ENVELOPE & POPPED OUT LETTER SNEAK PEEK */
            <motion.div
              key="opened-envelope"
              className="relative w-full max-w-[360px] h-[220px] bg-rose-100 rounded-lg shadow-inner border border-rose-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              id="anniversary-opened-envelope"
            >
              {/* Back Flap Opened */}
              <div className="absolute -top-[100px] left-0 w-full h-[100px] bg-rose-50 border-t-2 border-x-2 border-rose-200 rounded-t-xl origin-bottom transform rotate-x-180 flex items-center justify-center shadow-sm z-0">
                <span className="text-rose-300 font-serif text-[10px]">Terbuka dengan cinta ♥</span>
              </div>

              {/* Inside letter page floating-up pre-view */}
              <motion.div
                className="absolute inset-x-4 bg-amber-50/95 rounded shadow-xl border border-amber-100 p-4 h-[240px] z-10 flex flex-col cursor-pointer hover:shadow-2xl"
                initial={{ y: 20, scale: 0.95 }}
                animate={{ y: -60, scale: 1 }}
                whileHover={{ y: -72 }}
                onClick={() => setShowFullLetter(true)}
                transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
              >
                {/* Paper Lines background */}
                <div className="absolute inset-0 bg-paper-lines opacity-10"></div>

                <div className="flex-1 overflow-hidden pointer-events-none relative">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mb-1 text-rose-600">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                  <p className="font-serif text-xs text-rose-950 font-bold mb-1">Teruntuk Sayangku,</p>
                  <p className="font-serif text-[11px] text-zinc-700 leading-relaxed text-justify line-clamp-5 whitespace-pre-line">
                    {text}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-rose-100 text-right">
                  <span className="font-serif italic text-rose-700 text-[10px] block font-semibold">{signature}</span>
                </div>
              </motion.div>

              {/* Envelope Foreground covering sides */}
              <div className="absolute bottom-0 inset-x-0 h-[120px] bg-gradient-to-t from-rose-200 to-rose-100 rounded-b-lg border-t border-rose-200/40 shadow-md z-20 flex items-end justify-between p-3 pointer-events-none">
                <span className="text-[10px] text-rose-700/60 font-mono">Buka lembaran di atas</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                  className="pointer-events-auto bg-white/80 hover:bg-white text-rose-800 text-xs py-1 px-3 rounded-full shadow border border-rose-200 transition-all font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Tutup
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FULL SCREEN / LARGE DETAILED LETTER OVERLAY */}
      <AnimatePresence>
        {(isOpen && showFullLetter) && (
          <motion.div
            className="fixed inset-0 bg-neutral-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="love-letter-modal-overlay"
          >
            <motion.div
              className="bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-50 via-warm-gray-50 to-amber-50/95 w-full max-w-xl h-[85vh] max-h-[660px] rounded-2xl shadow-2xl border-4 border-rose-200 p-6 md:p-8 flex flex-col justify-between overflow-hidden relative"
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              id="love-letter-modal-paper"
            >
              {/* Paper lines and beautiful flower frame elements */}
              <div className="absolute inset-0 bg-[radial-gradient(#f43f5e08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
              <div className="absolute top-0 right-0 p-8 text-rose-100 pointer-events-none opacity-20">
                <Heart className="w-48 h-48 fill-rose-50" />
              </div>

              {/* Close Button top-right */}
              <button
                onClick={() => setShowFullLetter(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100/60 p-2 rounded-full transition-all cursor-pointer z-20"
                aria-label="Tutup surat"
              >
                ✕
              </button>

              {/* Header Letter */}
              <div className="flex justify-between items-center pb-4 mb-3 border-b border-rose-100 relative z-10">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span className="font-serif font-bold text-rose-900 text-lg">My Secret Letter</span>
                </div>
              </div>

              {/* Main Text Content (Scrollable) */}
              <div className="flex-1 overflow-y-auto pr-2 relative z-10 font-serif text-stone-800 leading-relaxed md:text-lg focus:outline-none scrollbar-thin scrollbar-thumb-rose-200">
                <p className="font-bold text-rose-900 mb-4 text-xl">Sayangku,</p>
                <div className="whitespace-pre-wrap font-serif text-[15px] sm:text-[17px] tracking-wide text-stone-700">
                  {text}
                </div>
              </div>

              {/* Signature section */}
              <div className="mt-6 pt-4 border-t border-rose-100 flex justify-between items-end relative z-10">
                <div className="text-[11px] text-zinc-400">
                  <span>Dibaca dengan seluruh kehangatan di hati</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-rose-500 font-serif italic mb-1">Mencintaimu selalu,</p>
                  <p className="font-serif text-lg font-bold text-rose-800 tracking-wide">{signature}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
