import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Type, ALargeSmall, MoveHorizontal, MoveVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { settings, update } = useAccessibility();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-dyslexic text-sm font-bold text-foreground">Aksesibilitas</h1>
          </div>
          <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
        {/* Dark Mode */}
        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                {theme === "dark" ? <Moon className="w-5 h-5 text-accent-foreground" /> : <Sun className="w-5 h-5 text-accent-foreground" />}
              </div>
              <div>
                <h3 className="font-dyslexic text-sm font-bold text-card-foreground">Mode Gelap</h3>
                <p className="text-xs text-muted-foreground">Nyaman di mata saat gelap</p>
              </div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
          </div>
        </div>

        {/* Font Dyslexic */}
        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                <Type className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-dyslexic text-sm font-bold text-card-foreground">Font Disleksia</h3>
                <p className="text-xs text-muted-foreground">Gunakan OpenDyslexic</p>
              </div>
            </div>
            <Switch checked={settings.useDyslexicFont} onCheckedChange={(v) => update({ useDyslexicFont: v })} />
          </div>
        </div>

        {/* Font Size */}
        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <ALargeSmall className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-dyslexic text-sm font-bold text-card-foreground">Ukuran Font</h3>
              <p className="text-xs text-muted-foreground">{settings.fontSize}px</p>
            </div>
          </div>
          <Slider value={[settings.fontSize]} onValueChange={([v]) => update({ fontSize: v })} min={12} max={36} step={1} />
        </div>

        {/* Letter Spacing */}
        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <MoveHorizontal className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-dyslexic text-sm font-bold text-card-foreground">Jarak Huruf</h3>
              <p className="text-xs text-muted-foreground">{settings.letterSpacing}px</p>
            </div>
          </div>
          <Slider value={[settings.letterSpacing]} onValueChange={([v]) => update({ letterSpacing: v })} min={0} max={8} step={0.5} />
        </div>

        {/* Line Height */}
        <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <MoveVertical className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-dyslexic text-sm font-bold text-card-foreground">Jarak Baris</h3>
              <p className="text-xs text-muted-foreground">{settings.lineHeight.toFixed(1)}x</p>
            </div>
          </div>
          <Slider value={[settings.lineHeight]} onValueChange={([v]) => update({ lineHeight: v })} min={1.2} max={3} step={0.1} />
        </div>

        {/* Preview */}
        <div className="p-4 rounded-2xl bg-accent/30 border border-border/50">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Preview</p>
          <p
            className={`text-card-foreground whitespace-pre-wrap ${settings.useDyslexicFont ? "font-dyslexic" : ""}`}
            style={{
              fontSize: `${settings.fontSize}px`,
              letterSpacing: `${settings.letterSpacing}px`,
              lineHeight: settings.lineHeight,
            }}
          >
            Dyslexia Lens membantu kamu membaca teks dengan lebih nyaman menggunakan font khusus disleksia.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
