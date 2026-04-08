import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Type, ALargeSmall, MoveHorizontal, MoveVertical, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { settings, update } = useAccessibility();

  const settingsGroups = [
    {
      title: "Tampilan",
      items: [
        {
          icon: theme === "dark" ? Moon : Sun,
          label: "Mode Gelap",
          desc: "Nyaman di mata saat gelap",
          type: "toggle" as const,
          value: theme === "dark",
          onChange: toggleTheme,
          iconClass: "bg-secondary/15 text-secondary",
        },
        {
          icon: Type,
          label: "Font Disleksia",
          desc: "Gunakan OpenDyslexic",
          type: "toggle" as const,
          value: settings.useDyslexicFont,
          onChange: () => update({ useDyslexicFont: !settings.useDyslexicFont }),
          iconClass: "bg-primary/10 text-primary",
        },
      ],
    },
    {
      title: "Ukuran & Jarak",
      items: [
        {
          icon: ALargeSmall,
          label: "Ukuran Font",
          desc: `${settings.fontSize}px`,
          type: "slider" as const,
          value: settings.fontSize,
          onChange: (v: number) => update({ fontSize: v }),
          min: 12, max: 36, step: 1,
          iconClass: "bg-primary/10 text-primary",
        },
        {
          icon: MoveHorizontal,
          label: "Jarak Huruf",
          desc: `${settings.letterSpacing}px`,
          type: "slider" as const,
          value: settings.letterSpacing,
          onChange: (v: number) => update({ letterSpacing: v }),
          min: 0, max: 8, step: 0.5,
          iconClass: "bg-secondary/15 text-secondary",
        },
        {
          icon: MoveVertical,
          label: "Jarak Baris",
          desc: `${settings.lineHeight.toFixed(1)}x`,
          type: "slider" as const,
          value: settings.lineHeight,
          onChange: (v: number) => update({ lineHeight: v }),
          min: 1.2, max: 3, step: 0.1,
          iconClass: "bg-primary/10 text-primary",
        },
      ],
    },
  ];

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
        {settingsGroups.map((group) => (
          <div key={group.title} className="space-y-2 animate-fade-in-up">
            <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">{group.title}</h2>
            <div className="bg-card rounded-2xl border border-border/50 shadow-card divide-y divide-border/40 overflow-hidden">
              {group.items.map((item) => (
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
                    {item.type === "toggle" && (
                      <Switch checked={item.value as boolean} onCheckedChange={item.onChange as () => void} />
                    )}
                  </div>
                  {item.type === "slider" && (
                    <div className="mt-3 pl-[52px]">
                      <Slider
                        value={[item.value as number]}
                        onValueChange={([v]) => (item.onChange as (v: number) => void)(v)}
                        min={item.min}
                        max={item.max}
                        step={item.step}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Preview */}
        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">Preview</h2>
          <div className="p-5 rounded-2xl bg-card border border-border/50 shadow-card">
            <p
              className={`text-card-foreground whitespace-pre-wrap leading-relaxed ${settings.useDyslexicFont ? "font-dyslexic" : ""}`}
              style={{
                fontSize: `${settings.fontSize}px`,
                letterSpacing: `${settings.letterSpacing}px`,
                lineHeight: settings.lineHeight,
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