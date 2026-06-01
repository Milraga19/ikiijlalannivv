import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnniversarySettings, PhotoMemory, WishItem } from "../types";
import { Settings, X, Heart, Save, Calendar, Plus, Trash2, Sliders, FileText, Music, Info } from "lucide-react";

interface SettingsDrawerProps {
  settings: AnniversarySettings;
  onSave: (newSettings: AnniversarySettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AnniversarySettingsDrawer({ settings, onSave, isOpen, onClose }: SettingsDrawerProps) {
  const [activeTab, setActiveTab] = useState<"general" | "letter" | "gallery" | "extra">("general");
  const [localSettings, setLocalSettings] = useState<AnniversarySettings>({ ...settings });

  // Update local settings if props change
  React.useEffect(() => {
    setLocalSettings({ ...settings });
  }, [settings]);

  const handleChange = (field: keyof AnniversarySettings, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMemoryChange = (id: string, field: keyof PhotoMemory, value: string) => {
    const updatedMemories = localSettings.memories.map((m) => {
      if (m.id === id) {
        return { ...m, [field]: value };
      }
      return m;
    });
    handleChange("memories", updatedMemories);
  };

  const handleDeleteMemory = (id: string) => {
    const updatedMemories = localSettings.memories.filter((m) => m.id !== id);
    handleChange("memories", updatedMemories);
  };

  const handleAddMemory = () => {
    const newMem: PhotoMemory = {
      id: "mem-" + Date.now(),
      title: "Momen Baru Kita",
      date: new Date().toISOString().split("T")[0],
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80",
      story: "Tuliskan cerita romantis tentang momen indah ini di sini..."
    };
    handleChange("memories", [...localSettings.memories, newMem]);
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  // Music Presets
  const MUSIC_PRESETS = [
    { name: "Soft Piano Waltz (Default)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { name: "Ambient Forest Melody", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { name: "Romantic Guitar Mood", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { name: "Sweet Acoustic Instrumental", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white border-l border-rose-100 shadow-2xl z-50 flex flex-col justify-between"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
          >
            {/* Header */}
            <div className="p-5 border-b border-rose-50 bg-gradient-to-r from-rose-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-rose-600 animate-spin" style={{ animationDuration: "10s" }} />
                <h4 className="font-serif text-lg font-bold text-rose-950">Atur Halaman Anniversary</h4>
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-600 p-1.5 rounded-full hover:bg-rose-50 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Tabs Navigation */}
            <div className="flex border-b border-rose-50 text-xs sm:text-sm bg-neutral-50 px-2">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex-1 py-3 text-center border-b-2 font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "general"
                    ? "border-rose-600 text-rose-600 font-semibold"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                <Sliders className="w-4 h-4" />
                Umum
              </button>
              <button
                onClick={() => setActiveTab("letter")}
                className={`flex-1 py-3 text-center border-b-2 font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "letter"
                    ? "border-rose-600 text-rose-600 font-semibold"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                <FileText className="w-4 h-4" />
                Surat Cinta
              </button>
              <button
                onClick={() => setActiveTab("gallery")}
                className={`flex-1 py-3 text-center border-b-2 font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "gallery"
                    ? "border-rose-600 text-rose-600 font-semibold"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                <Heart className="w-4 h-4" />
                Galeri ({localSettings.memories.length})
              </button>
              <button
                onClick={() => setActiveTab("extra")}
                className={`flex-1 py-3 text-center border-b-2 font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "extra"
                    ? "border-rose-600 text-rose-600 font-semibold"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}
              >
                <Music className="w-4 h-4" />
                Lainnya
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/40 text-xs text-rose-800 leading-relaxed flex items-start gap-2.5">
                    <Info className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                    <p>
                      Atur nama pasangan, tanggal jadi, dan judul ucapan. Data ini disimpan khusus di browser kamu menggunakan <strong>LocalStorage</strong>, sehingga aman dan langsung terpasang saat halaman dibuka kembali.
                    </p>
                  </div>

                  {/* Couple name 1 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Nama Kamu</label>
                      <input
                        type="text"
                        value={localSettings.coupleName1}
                        onChange={(e) => handleChange("coupleName1", e.target.value)}
                        className="w-full border border-stone-200 rounded-lg p-2 text-sm focus:outline-none focus:border-rose-400 bg-stone-50"
                        placeholder="Nama kamu"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Nama Pasangan</label>
                      <input
                        type="text"
                        value={localSettings.coupleName2}
                        onChange={(e) => handleChange("coupleName2", e.target.value)}
                        className="w-full border border-stone-200 rounded-lg p-2 text-sm focus:outline-none focus:border-rose-400 bg-stone-50"
                        placeholder="Nama pasangan"
                      />
                    </div>
                  </div>

                  {/* Anniversary date & type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" /> Tanggal Spesial
                      </label>
                      <input
                        type="date"
                        value={localSettings.anniversaryDate}
                        onChange={(e) => handleChange("anniversaryDate", e.target.value)}
                        className="w-full border border-stone-200 rounded-lg p-2 text-sm focus:outline-none focus:border-rose-400 bg-stone-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Hubungan</label>
                      <select
                        value={localSettings.anniversaryType}
                        onChange={(e) => handleChange("anniversaryType", e.target.value as "dating" | "wedding")}
                        className="w-full border border-stone-200 rounded-lg p-2 text-sm focus:outline-none focus:border-rose-400 bg-stone-50"
                      >
                        <option value="dating">Pacaran / Jadian</option>
                        <option value="wedding">Pernikahan / Wedding</option>
                      </select>
                    </div>
                  </div>

                  {/* Greeting Title */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Judul Ucapan Hero</label>
                    <input
                      type="text"
                      value={localSettings.greetingTitle}
                      onChange={(e) => handleChange("greetingTitle", e.target.value)}
                      className="w-full border border-stone-200 rounded-lg p-2 text-sm focus:outline-none focus:border-rose-400 bg-stone-50"
                      placeholder="Contoh: Happy Anniversary, Sayang!"
                    />
                  </div>
                </div>
              )}

              {activeTab === "letter" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Isi Surat Cinta (Love Letter)</label>
                    <textarea
                      value={localSettings.loveLetterText}
                      onChange={(e) => handleChange("loveLetterText", e.target.value)}
                      rows={12}
                      className="w-full border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:border-rose-400 bg-stone-50 font-serif leading-relaxed"
                      placeholder="Tulis surat cinta yang tulus dan menghanyutkan..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Tanda Tangan</label>
                    <input
                      type="text"
                      value={localSettings.loveLetterSign}
                      onChange={(e) => handleChange("loveLetterSign", e.target.value)}
                      className="w-full border border-stone-200 rounded-lg p-2 text-sm focus:outline-none focus:border-rose-400 bg-stone-50"
                      placeholder="Contoh: Selamanya milikmu, Andi"
                    />
                  </div>
                </div>
              )}

              {activeTab === "gallery" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Daftar Foto Kenangan Anda</span>
                    <button
                      onClick={handleAddMemory}
                      className="bg-rose-50 text-rose-800 hover:bg-rose-100 text-xs py-1.5 px-3 rounded-full border border-rose-200 transition-all font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Momen
                    </button>
                  </div>

                  {localSettings.memories.length === 0 ? (
                    <div className="text-center py-10 bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 text-xs">
                      Belum ada foto kenangan. Tambah momen pertamamu!
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {localSettings.memories.map((memory, index) => (
                        <div key={memory.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl relative space-y-3 shadow-inner">
                          {/* Card delete button */}
                          <button
                            onClick={() => handleDeleteMemory(memory.id)}
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-all cursor-pointer"
                            title="Hapus Momen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="flex gap-2 items-center">
                            <span className="text-xs font-bold bg-rose-200 text-rose-800 h-5 w-5 rounded-full flex items-center justify-center">
                              {index + 1}
                            </span>
                            <span className="text-xs font-semibold text-stone-600">ID: {memory.id}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase">Judul Momen</label>
                              <input
                                type="text"
                                value={memory.title}
                                onChange={(e) => handleMemoryChange(memory.id, "title", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded p-1.5 text-xs focus:outline-none focus:border-rose-400"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-500 uppercase">Tanggal Momen</label>
                              <input
                                type="date"
                                value={memory.date}
                                onChange={(e) => handleMemoryChange(memory.id, "date", e.target.value)}
                                className="w-full bg-white border border-stone-200 rounded p-1.5 text-xs focus:outline-none focus:border-rose-400"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase">URL Tautan Foto (Unsplash/Direct Link)</label>
                            <input
                              type="text"
                              value={memory.imageUrl}
                              onChange={(e) => handleMemoryChange(memory.id, "imageUrl", e.target.value)}
                              className="w-full bg-white border border-stone-200 rounded p-1.5 text-xs font-mono focus:outline-none focus:border-rose-400"
                            />
                            <p className="text-[9px] text-zinc-400 mt-0.5">Copy link gambar dari Unsplash atau host foto eksternal.</p>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-stone-500 uppercase">Cerita Momen</label>
                            <textarea
                              value={memory.story}
                              onChange={(e) => handleMemoryChange(memory.id, "story", e.target.value)}
                              rows={2}
                              className="w-full bg-white border border-stone-200 rounded p-1.5 text-xs focus:outline-none focus:border-rose-400"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "extra" && (
                <div className="space-y-4">
                  {/* Background Music Option */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Music className="w-3.5 h-3.5 text-rose-500" /> Tautan Musik Latar (Audio URL)
                    </label>

                    {/* Presets Grid */}
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      {MUSIC_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleChange("audioUrl", preset.url)}
                          className={`text-left p-2 rounded border text-xs leading-tight transition-all cursor-pointer ${
                            localSettings.audioUrl === preset.url
                              ? "bg-rose-50 border-rose-300 text-rose-800 font-semibold shadow-sm"
                              : "bg-white border-stone-100 text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={localSettings.audioUrl}
                      onChange={(e) => handleChange("audioUrl", e.target.value)}
                      className="w-full border border-stone-200 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-rose-400 bg-stone-50"
                      placeholder="Ganti dengan tautan audiomp3 eksternal..."
                    />
                  </div>

                  {/* Future Wishes text */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Pesan Harapan Masa Depan</label>
                    <textarea
                      value={localSettings.futureWishesText}
                      onChange={(e) => handleChange("futureWishesText", e.target.value)}
                      rows={5}
                      className="w-full border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:border-rose-400 bg-stone-50"
                      placeholder="Tuliskan komitmen atau harapan bersama di masa depan..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Safe Bar */}
            <div className="p-4 border-t border-rose-50 bg-neutral-50 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-stone-500 hover:text-stone-700 font-medium text-sm rounded-lg hover:bg-stone-100 transition-all cursor-pointer"
              >
                Batalkan
              </button>
              <button
                onClick={handleSave}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-900/10 active:scale-95"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
