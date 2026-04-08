import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const credits = [
  {
    name: "Levenshtein Distance",
    desc: "Algoritma untuk mengukur kemiripan kata dan koreksi OCR otomatis",
    author: "Vladimir Levenshtein",
    url: "https://en.wikipedia.org/wiki/Levenshtein_distance",
  },
  {
    name: "Tesseract.js",
    desc: "OCR engine untuk deteksi teks dari gambar",
    author: "naptha / Tesseract OCR",
    url: "https://github.com/naptha/tesseract.js",
  },
  {
    name: "OpenDyslexic",
    desc: "Font open-source yang dirancang untuk pembaca disleksia",
    author: "Abbie Gonzalez",
    url: "https://opendyslexic.org",
  },
  {
    name: "MyMemory Translation API",
    desc: "API terjemahan gratis untuk berbagai bahasa",
    author: "Translated.net",
    url: "https://mymemory.translated.net",
  },
  {
    name: "Web Speech API",
    desc: "API browser native untuk text-to-speech",
    author: "W3C / Browser vendors",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API",
  },
  {
    name: "React",
    desc: "Library JavaScript untuk membangun antarmuka pengguna",
    author: "Meta (Facebook)",
    url: "https://react.dev",
  },
  {
    name: "Tailwind CSS",
    desc: "Framework CSS utility-first untuk desain modern",
    author: "Tailwind Labs",
    url: "https://tailwindcss.com",
  },
  {
    name: "shadcn/ui",
    desc: "Komponen UI berkualitas tinggi berbasis Radix",
    author: "shadcn",
    url: "https://ui.shadcn.com",
  },
  {
    name: "Lucide Icons",
    desc: "Library ikon open-source yang bersih dan konsisten",
    author: "Lucide Contributors",
    url: "https://lucide.dev",
  },
  {
    name: "Vite",
    desc: "Build tool cepat untuk development modern",
    author: "Evan You / Vite Team",
    url: "https://vitejs.dev",
  },
];

const Credits = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-dyslexic text-sm font-bold text-foreground">Kredit & Teknologi</h1>
          </div>
          <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-3">
        {credits.map((c) => (
          <a
            key={c.name}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-card transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0 text-xs font-bold text-accent-foreground font-dyslexic">
              {c.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-dyslexic text-sm font-bold text-card-foreground">{c.name}</h3>
                <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
              <p className="text-[11px] text-primary mt-1">oleh {c.author}</p>
            </div>
          </a>
        ))}
      </main>
    </div>
  );
};

export default Credits;
