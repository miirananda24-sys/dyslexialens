import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

const members = [
  { name: "Helmi Rafif Hernanda", role: "Developer" },
  { name: "Nafisa Anggraini", role: "Developer" },
  { name: "Nayla Jihan Zaskiyah", role: "Developer" },
  { name: "Puteri Elmira Nafizhah Kusumasari", role: "Developer" },
  { name: "Rosa Fina Mawaddah", role: "Developer" },
];

const getInitials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const colors = [
  "from-primary to-primary/70",
  "from-secondary to-secondary/70",
  "from-accent-foreground to-primary",
  "from-primary/80 to-accent-foreground",
  "from-secondary/80 to-primary/60",
];

const Team = () => {
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
            <h1 className="font-dyslexic text-sm font-bold text-foreground">Tim Pengembang</h1>
          </div>
          <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-accent mx-auto flex items-center justify-center mb-3">
            <Users className="w-8 h-8 text-accent-foreground" />
          </div>
          <h2 className="font-dyslexic text-lg font-bold text-foreground mb-1">Meet the Team</h2>
          <p className="text-sm text-muted-foreground">Orang-orang hebat di balik Dyslexia Lens</p>
        </div>

        <div className="space-y-3">
          {members.map((m, i) => (
            <div
              key={m.name}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-card transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[i]} flex items-center justify-center shrink-0`}>
                <span className="text-sm font-bold text-primary-foreground">{getInitials(m.name)}</span>
              </div>
              <div>
                <h3 className="font-dyslexic text-sm font-bold text-card-foreground">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Team;
