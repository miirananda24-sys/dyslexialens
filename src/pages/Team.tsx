import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

import helmiImg from "@/assets/team/helmi.jpg";
import putriImg from "@/assets/team/putri.jpeg";
import naylaImg from "@/assets/team/nayla.jpeg";
import nafisaImg from "@/assets/team/nafisa.jpeg";
import rosaImg from "@/assets/team/rosa.jpeg";
import oktarinaImg from "@/assets/team/oktarina.jpeg";

const members = [
  { name: "dr. Oktarina, M. Sc., Ph. D", role: "Researcher", photo: oktarinaImg },
  { name: "Helmi Rafif Hernanda", role: "Developer", photo: helmiImg },
  { name: "Nafisa Anggraini", role: "Developer", photo: nafisaImg },
  { name: "Nayla Jihan Zaskiyah", role: "Developer", photo: naylaImg },
  { name: "Puteri Elmira Nafizhah Kusumasari", role: "Developer", photo: putriImg },
  { name: "Rosa Fina Mawaddah", role: "Developer", photo: rosaImg },
];

const colors = [
  "from-primary to-primary/70",
  "from-secondary to-secondary/70",
  "from-accent-foreground to-primary",
  "from-primary/80 to-accent-foreground",
  "from-secondary/80 to-primary/60",
  "from-primary/60 to-secondary/80",
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
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center shrink-0 overflow-hidden`}>
                <img src={m.photo} alt={m.name} className="w-full h-full object-cover rounded-xl" />
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
