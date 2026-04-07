import { useNavigate } from "react-router-dom";
import { Eye, ScanLine, Users, Info, Settings, Moon, Sun, ChevronRight, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

const Home = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: ScanLine,
      title: "Mulai Scan",
      desc: "Pindai teks dengan kamera atau upload gambar",
      path: "/scan",
      gradient: "from-primary to-primary/70",
      primary: true,
    },
    {
      icon: Settings,
      title: "Aksesibilitas",
      desc: "Atur font, ukuran, dan kenyamanan baca",
      path: "/settings",
      gradient: "from-secondary to-secondary/70",
    },
    {
      icon: Users,
      title: "Tim Pengembang",
      desc: "Kenali tim di balik Dyslexia Lens",
      path: "/team",
      gradient: "from-accent-foreground to-primary",
    },
    {
      icon: Info,
      title: "Kredit & Teknologi",
      desc: "Sistem dan library yang digunakan",
      path: "/credits",
      gradient: "from-muted-foreground to-foreground/70",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-card">
              <Eye className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-dyslexic text-base font-bold text-foreground leading-tight">Dyslexia Lens</h1>
              <p className="text-[11px] text-muted-foreground">Baca lebih mudah, pahami lebih cepat</p>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-deep">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-6 -translate-x-6" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-medium opacity-90 uppercase tracking-wider">OCR + Dyslexic Font</span>
            </div>
            <h2 className="font-dyslexic text-xl sm:text-2xl font-bold leading-snug mb-2">
              Bantu Membaca<br />Dengan Lebih Nyaman
            </h2>
            <p className="text-sm opacity-80 leading-relaxed max-w-sm">
              Pindai teks apapun dan ubah ke font yang ramah disleksia. Dilengkapi terjemahan dan text-to-speech.
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <button
              key={f.path}
              onClick={() => navigate(f.path)}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 p-5 text-left transition-all duration-300 hover:shadow-card hover:scale-[1.02] active:scale-[0.98] ${
                f.primary
                  ? "bg-gradient-primary text-primary-foreground col-span-1 sm:col-span-2"
                  : "bg-card text-card-foreground"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    f.primary ? "bg-primary-foreground/20" : "bg-accent"
                  }`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-dyslexic font-bold text-sm mb-0.5">{f.title}</h3>
                    <p className={`text-xs leading-relaxed ${f.primary ? "opacity-80" : "text-muted-foreground"}`}>{f.desc}</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 mt-1 shrink-0 transition-transform group-hover:translate-x-1 ${f.primary ? "opacity-60" : "text-muted-foreground"}`} />
              </div>
            </button>
          ))}
        </div>
      </main>

      <footer className="py-3 text-center border-t border-border/30">
        <p className="text-[10px] text-muted-foreground/50 font-dyslexic">Dibuat untuk membantu pembaca disleksia 💙</p>
      </footer>
    </div>
  );
};

export default Home;
