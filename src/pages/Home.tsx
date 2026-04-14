import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ScanLine, Settings, Moon, Sun, ChevronRight, Sparkles, Zap, Eye, BookOpen,
  Mail, Send, CheckCircle, Users, Code2, ExternalLink, ImagePlus, X,
  FlaskConical, Award
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";

import helmiImg from "@/assets/team/helmi.jpg";
import putriImg from "@/assets/team/putri.jpeg";
import naylaImg from "@/assets/team/nayla.jpeg";
import nafisaImg from "@/assets/team/nafisa.jpeg";
import rosaImg from "@/assets/team/rosa.jpeg";
import oktarinaImg from "@/assets/team/oktarina.jpeg";

const FEEDBACK_EMAIL = "miirananda24@gmail.com";

const members = [
  { name: "dr. Oktarina, M. Sc., Ph. D", role: "Researcher", photo: oktarinaImg, roleIcon: FlaskConical },
  { name: "Helmi Rafif Hernanda", role: "Developer", photo: helmiImg, roleIcon: Code2 },
  { name: "Nafisa Anggraini", role: "Developer", photo: nafisaImg, roleIcon: Code2 },
  { name: "Nayla Jihan Zaskiyah", role: "Developer", photo: naylaImg, roleIcon: Code2 },
  { name: "Puteri Elmira Nafizhah Kusumasari", role: "Developer", photo: putriImg, roleIcon: Code2 },
  { name: "Rosa Fina Mawaddah", role: "Developer", photo: rosaImg, roleIcon: Code2 },
];

const credits = [
  { name: "Tesseract.js", desc: "OCR engine untuk deteksi teks dari gambar", url: "https://github.com/naptha/tesseract.js" },
  { name: "OpenDyslexic", desc: "Font open-source untuk pembaca disleksia", url: "https://opendyslexic.org" },
  { name: "MyMemory API", desc: "API terjemahan gratis", url: "https://mymemory.translated.net" },
  { name: "Web Speech API", desc: "Text-to-speech native browser", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API" },
  { name: "Levenshtein Distance", desc: "Algoritma koreksi OCR otomatis", url: "https://en.wikipedia.org/wiki/Levenshtein_distance" },
  { name: "React + Vite", desc: "Framework & build tool modern", url: "https://react.dev" },
  { name: "Tailwind CSS", desc: "Utility-first CSS framework", url: "https://tailwindcss.com" },
  { name: "shadcn/ui", desc: "Komponen UI berbasis Radix", url: "https://ui.shadcn.com" },
];

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"bug" | "feedback">("feedback");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const [showTeam, setShowTeam] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...images, ...files].slice(0, 3);
    setImages(newImages);
    setImagePreviews(newImages.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i: number) => {
    const next = images.filter((_, idx) => idx !== i);
    setImages(next);
    setImagePreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("_subject", feedbackType === "bug"
        ? `[Bug Report] Dyslexia Lens - dari ${name || "Anonim"}`
        : `[Feedback] Dyslexia Lens - dari ${name || "Anonim"}`);
      formData.append("Nama", name || "Anonim");
      formData.append("Tipe", feedbackType === "bug" ? "Bug Report" : "Feedback");
      formData.append("Pesan", message);
      images.forEach((img, i) => formData.append(`attachment${i + 1}`, img));

      const res = await fetch(`https://formsubmit.co/ajax/${FEEDBACK_EMAIL}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (res.ok) {
        setSent(true);
        setTimeout(() => {
          setSent(false);
          setName("");
          setMessage("");
          setImages([]);
          setImagePreviews([]);
        }, 3000);
      }
    } catch (e) {
      console.error("Failed to send feedback:", e);
    } finally {
      setSending(false);
    }
  };

  const stats = [
    { icon: Eye, label: "OCR Engine", value: "Tesseract" },
    { icon: BookOpen, label: "Font Khusus", value: "OpenDyslexic" },
    { icon: Zap, label: "Koreksi AI", value: "Levenshtein" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

      <header className="sticky top-0 z-50 bg-glass border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-deep ring-2 ring-primary/20">
              <img src={logoImg} alt="Dyslexia Lens" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-dyslexic text-base font-bold text-foreground leading-tight">Dyslexia Lens</h1>
              <p className="text-[10px] text-muted-foreground tracking-wide">Assistive Reading Tool</p>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full hover:bg-accent" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5 relative z-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-6 pb-8 text-primary-foreground shadow-xl-custom animate-fade-in-up">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-xl" />
          <div className="absolute top-1/2 right-8 w-20 h-20 rounded-full bg-white/5 blur-lg animate-float" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-medium mb-4 border border-white/10">
              <Sparkles className="w-3 h-3" />
              OCR + Dyslexic Font + AI Correction
            </div>
            <h2 className="font-dyslexic text-2xl sm:text-3xl font-extrabold leading-tight mb-3 tracking-tight">
              Bantu Membaca<br /><span className="opacity-90">Dengan Lebih Nyaman</span>
            </h2>
            <p className="text-sm opacity-75 leading-relaxed max-w-sm mb-5">
              Pindai teks apapun dan ubah ke font yang ramah disleksia. Dilengkapi terjemahan, text-to-speech, dan koreksi otomatis.
            </p>
            <button
              onClick={() => navigate("/scan")}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-sm font-semibold transition-all duration-300 border border-white/20 hover:shadow-glow active:scale-95"
            >
              <ScanLine className="w-4 h-4" />
              Mulai Scan Sekarang
              <ChevronRight className="w-4 h-4 -mr-1" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border/50 shadow-card">
              <s.icon className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-semibold text-foreground">{s.value}</span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2.5 stagger-children">
          {[
            { icon: ScanLine, title: "Mulai Scan", desc: "Pindai teks dengan kamera atau upload gambar", path: "/scan", iconBg: "bg-gradient-primary text-primary-foreground" },
            { icon: Settings, title: "Aksesibilitas", desc: "Atur font, ukuran, dan kenyamanan baca", path: "/settings", iconBg: "bg-secondary/15 text-secondary" },
          ].map((f) => (
            <button
              key={f.path}
              onClick={() => navigate(f.path)}
              className="group w-full animate-fade-in-up flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-card text-left transition-all duration-300 hover:shadow-deep hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${f.iconBg} transition-transform group-hover:scale-110`}>
                <f.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-card-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0 transition-all group-hover:translate-x-1 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

          {/* Feedback & Bug Report Card */}
          <div className="rounded-2xl bg-card border border-border/50 shadow-card p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-card-foreground">Feedback & Bug Report</h3>
                <p className="text-xs text-muted-foreground">Bantu kami jadi lebih baik</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setFeedbackType("feedback")}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${feedbackType === "feedback" ? "bg-primary text-primary-foreground shadow-card" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                💬 Feedback
              </button>
              <button onClick={() => setFeedbackType("bug")}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${feedbackType === "bug" ? "bg-destructive text-destructive-foreground shadow-card" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                🐛 Bug Report
              </button>
            </div>

            <input type="text" placeholder="Nama kamu (opsional)" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />

            <textarea placeholder="Tulis pesan, saran, atau laporkan bug..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none" />

            {/* Image Upload */}
            <div className="space-y-2">
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-border/50 group">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <X className="w-4 h-4 text-background" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length < 3 && (
                <button onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <ImagePlus className="w-4 h-4" />
                  Lampirkan gambar (maks 3)
                </button>
              )}
            </div>

            <button onClick={handleSend} disabled={!message.trim() || sent || sending}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.98] ${sent ? "bg-primary/20 text-primary" : "bg-primary text-primary-foreground hover:opacity-90 shadow-card disabled:opacity-50 disabled:cursor-not-allowed"}`}>
              {sent ? (<><CheckCircle className="w-4 h-4" />Terkirim!</>) : sending ? (<><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Mengirim...</>) : (<><Send className="w-4 h-4" />Kirim</>)}
            </button>
          </div>

          {/* About Us */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">About Us</h3>

            {/* Team */}
            <div className="rounded-2xl bg-card border border-border/50 shadow-card overflow-hidden">
              <button onClick={() => setShowTeam(!showTeam)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-card-foreground">Tim Pengembang</h4>
                    <p className="text-xs text-muted-foreground">Orang-orang di balik Dyslexia Lens</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${showTeam ? "rotate-90" : ""}`} />
              </button>
              {showTeam && (
                <div className="px-4 pb-4 space-y-2 animate-fade-in-up">
                  {members.map((m) => (
                    <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent/20 transition-colors">
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 ring-1 ring-border/50">
                        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-semibold text-card-foreground leading-tight truncate">{m.name}</h5>
                        <div className="flex items-center gap-1 mt-0.5">
                          <m.roleIcon className="w-2.5 h-2.5 text-muted-foreground" />
                          <p className="text-[10px] text-muted-foreground">{m.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Credits */}
            <div className="rounded-2xl bg-card border border-border/50 shadow-card overflow-hidden">
              <button onClick={() => setShowCredits(!showCredits)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-secondary flex items-center justify-center">
                    <Award className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-card-foreground">Kredit & Teknologi</h4>
                    <p className="text-xs text-muted-foreground">Open-source tools & libraries</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${showCredits ? "rotate-90" : ""}`} />
              </button>
              {showCredits && (
                <div className="px-4 pb-4 space-y-1.5 animate-fade-in-up">
                  {credits.map((c) => (
                    <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-accent/20 transition-colors group">
                      <div className="min-w-0">
                        <h5 className="text-xs font-semibold text-card-foreground">{c.name}</h5>
                        <p className="text-[10px] text-muted-foreground truncate">{c.desc}</p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary shrink-0 ml-2 transition-colors" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-[11px] text-muted-foreground/50 pt-2">
            Dibuat dengan 💙 untuk pembaca disleksia
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
