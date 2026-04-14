import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Type, ALargeSmall, MoveHorizontal, MoveVertical, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const fontOptions = [
  { id: "OpenDyslexic", label: "OpenDyslexic", desc: "Disarankan untuk disleksia", recommended: true, family: "'OpenDyslexic', sans-serif" },
  { id: "Inter", label: "Inter", desc: "Clean & modern", recommended: false, family: "'Inter', system-ui, sans-serif" },
  { id: "Comic Sans MS", label: "Comic Sans", desc: "Familiar & mudah dibaca", recommended: false, family: "'Comic Sans MS', cursive" },
  { id: "Georgia", label: "Georgia", desc: "Serif klasik, nyaman", recommended: false, family: "Georgia, serif" },
  { id: "Verdana", label: "Verdana", desc: "Huruf lebar & jelas", recommended: false, family: "Verdana, sans-serif" },
];

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { settings, update } = useAccessibility();

  const currentFont = settings.fontFamily || "OpenDyslexic";

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />

      <header className="sticky top-0 z-50 bg-glass border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-xl bg-gradient-secondary flex items-center justify-center">
              <Palette className="w-4 h-4 text-secondary-foreground" />
            </div>
            <h1 className="text-sm font-bold text-foreground">Aksesibilitas</h1>
          </div>
          <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5 relative z-10">
        {/* Tampilan */}
        <div className="space-y-2 animate-fade-in-up">
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Tampilan</h2>
          <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-secondary/15 text-secondary">
                  {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-card-foreground">Mode Gelap</h3>
                  <p className="text-xs text-muted-foreground">Nyaman di mata saat gelap</p>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </div>
        </div>

        {/* Pilih Font */}
        <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Jenis Font</h2>
          <div className="bg-card rounded-2xl border border-border/50 shadow-card divide-y divide-border/40 overflow-hidden">
            {fontOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => update({ fontFamily: f.id, useDyslexicFont: f.id === "OpenDyslexic" })}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${currentFont === f.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  style={{ fontFamily: f.family }}>
                  Aa
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-card-foreground">{f.label}</h3>
                    {f.recommended && (
                      <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-bold uppercase">Disarankan</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
                {currentFont === f.id && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Ukuran & Jarak */}
        <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "160ms" }}>
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">Ukuran & Jarak</h2>
          <div className="bg-card rounded-2xl border border-border/50 shadow-card divide-y divide-border/40 overflow-hidden">
            {[
              { icon: ALargeSmall, label: "Ukuran Font", desc: `${settings.fontSize}px`, value: settings.fontSize, onChange: (v: number) => update({ fontSize: v }), min: 12, max: 36, step: 1, iconClass: "bg-primary/10 text-primary" },
              { icon: MoveHorizontal, label: "Jarak Huruf", desc: `${settings.letterSpacing}px`, value: settings.letterSpacing, onChange: (v: number) => update({ letterSpacing: v }), min: 0, max: 8, step: 0.5, iconClass: "bg-secondary/15 text-secondary" },
              { icon: MoveVertical, label: "Jarak Baris", desc: `${settings.lineHeight.toFixed(1)}x`, value: settings.lineHeight, onChange: (v: number) => update({ lineHeight: v }), min: 1.2, max: 3, step: 0.1, iconClass: "bg-primary/10 text-primary" },
            ].map((item) => (
              <div key={item.label} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconClass}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-card-foreground">{item.label}</h3>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pl-[52px]">
                  <Slider value={[item.value]} onValueChange={([v]) => item.onChange(v)} min={item.min} max={item.max} step={item.step} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="animate-fade-in-up" style={{ animationDelay: "240ms" }}>
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Preview</h2>
          <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-card">
            <p
              className="text-card-foreground whitespace-pre-wrap leading-relaxed"
              style={{
                fontSize: `${settings.fontSize}px`,
                letterSpacing: `${settings.letterSpacing}px`,
                lineHeight: settings.lineHeight,
                fontFamily: fontOptions.find((f) => f.id === currentFont)?.family || "'OpenDyslexic', sans-serif",
              }}
            >
              Dyslexia Lens membantu kamu membaca teks dengan lebih nyaman menggunakan font khusus disleksia.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
