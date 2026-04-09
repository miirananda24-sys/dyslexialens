import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Users, Award, Code2, FlaskConical, Mail, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

import helmiImg from "@/assets/team/helmi.jpg";
import putriImg from "@/assets/team/putri.jpeg";
import naylaImg from "@/assets/team/nayla.jpeg";
import nafisaImg from "@/assets/team/nafisa.jpeg";
import rosaImg from "@/assets/team/rosa.jpeg";
import oktarinaImg from "@/assets/team/oktarina.jpeg";

const members = [
  { name: "dr. Oktarina, M. Sc., Ph. D", role: "Researcher", photo: oktarinaImg, roleIcon: FlaskConical, accent: "border-secondary/30 bg-secondary/5" },
  { name: "Helmi Rafif Hernanda", role: "Developer", photo: helmiImg, roleIcon: Code2, accent: "border-primary/30 bg-primary/5" },
  { name: "Nafisa Anggraini", role: "Developer", photo: nafisaImg, roleIcon: Code2, accent: "border-primary/30 bg-primary/5" },
  { name: "Nayla Jihan Zaskiyah", role: "Developer", photo: naylaImg, roleIcon: Code2, accent: "border-primary/30 bg-primary/5" },
  { name: "Puteri Elmira Nafizhah Kusumasari", role: "Developer", photo: putriImg, roleIcon: Code2, accent: "border-primary/30 bg-primary/5" },
  { name: "Rosa Fina Mawaddah", role: "Developer", photo: rosaImg, roleIcon: Code2, accent: "border-primary/30 bg-primary/5" },
];

const FEEDBACK_EMAIL = "miirananda24@gmail.com";

const Team = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState<"bug" | "feedback">("feedback");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    const subject = encodeURIComponent(
      feedbackType === "bug"
        ? `[Bug Report] Dyslexia Lens - dari ${name || "Anonim"}`
        : `[Feedback] Dyslexia Lens - dari ${name || "Anonim"}`
    );
    const body = encodeURIComponent(
      `Nama: ${name || "Anonim"}\nTipe: ${feedbackType === "bug" ? "Bug Report" : "Feedback"}\n\n${message}`
    );
    window.open(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName("");
      setMessage("");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

      <header className="sticky top-0 z-50 bg-glass border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-sm font-bold text-foreground">Tim Pengembang</h1>
          </div>
          <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5 relative z-10">
        {/* Hero */}
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto flex items-center justify-center mb-3 shadow-glow">
            <Award className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">Meet the Team</h2>
          <p className="text-sm text-muted-foreground">Orang-orang hebat di balik Dyslexia Lens</p>
        </div>

        {/* Members */}
        <div className="space-y-2.5 stagger-children">
          {members.map((m) => (
            <div
              key={m.name}
              className={`animate-fade-in-up flex items-center gap-4 p-4 rounded-2xl bg-card border shadow-card hover:shadow-deep transition-all duration-300 hover:-translate-y-0.5 ${m.accent}`}
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-2 ring-border/50 shadow-card">
                <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-card-foreground leading-tight">{m.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <m.roleIcon className="w-3 h-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Form */}
        <div className="animate-fade-in-up rounded-2xl bg-card border border-border/50 shadow-card p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-card-foreground">Feedback & Bug Report</h3>
              <p className="text-xs text-muted-foreground">Bantu kami jadi lebih baik</p>
            </div>
          </div>

          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setFeedbackType("feedback")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                feedbackType === "feedback"
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              💬 Feedback
            </button>
            <button
              onClick={() => setFeedbackType("bug")}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                feedbackType === "bug"
                  ? "bg-destructive text-destructive-foreground shadow-card"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              🐛 Bug Report
            </button>
          </div>

          <input
            type="text"
            placeholder="Nama kamu (opsional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />

          <textarea
            placeholder="Tulis pesan, saran, atau laporkan bug..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
          />

          <button
            onClick={handleSend}
            disabled={!message.trim() || sent}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.98] ${
              sent
                ? "bg-primary/20 text-primary"
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {sent ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Terkirim! Cek email app kamu
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Kirim Feedback
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Team;