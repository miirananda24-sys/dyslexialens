import { useState } from "react";
import { Volume2, VolumeX, Languages, Copy, Check, Settings2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface TextResultPanelProps {
  detectedText: string;
}

const LANGUAGES = [
  { code: "id", name: "Indonesia" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "nl", name: "Nederlands" },
  { code: "ru", name: "Русский" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "th", name: "ไทย" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "tr", name: "Türkçe" },
  { code: "pl", name: "Polski" },
  { code: "sv", name: "Svenska" },
  { code: "ms", name: "Melayu" },
];

const TextResultPanel = ({ detectedText }: TextResultPanelProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [targetLang, setTargetLang] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [letterSpacing, setLetterSpacing] = useState(2);
  const [lineHeight, setLineHeight] = useState(1.8);

  const speak = (text: string, lang?: string) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || targetLang;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };

  const translate = async () => {
    if (!detectedText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(detectedText)}&langpair=auto|${targetLang}`
      );
      const data = await res.json();
      if (data.responseData?.translatedText) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        toast.error("Terjemahan gagal");
      }
    } catch {
      toast.error("Error saat menerjemahkan");
    } finally {
      setIsTranslating(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(translatedText || detectedText);
    setCopied(true);
    toast.success("Teks disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const textStyle = {
    fontSize: `${fontSize}px`,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: lineHeight,
  };

  return (
    <div className="w-full space-y-3">
      {/* Detected text card */}
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Teks Terdeteksi</h3>
          <div className="flex gap-0.5">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setShowSettings(!showSettings)}>
              <Settings2 className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => speak(detectedText, "auto")}>
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={copyText}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>

        {/* Font settings */}
        {showSettings && (
          <div className="mb-3 p-3 rounded-lg bg-accent/30 border border-border/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Ukuran Font</span>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setFontSize((s) => Math.max(12, s - 2))}>
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="text-xs font-medium w-8 text-center">{fontSize}px</span>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setFontSize((s) => Math.min(36, s + 2))}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Jarak Huruf</span>
              <Slider value={[letterSpacing]} onValueChange={([v]) => setLetterSpacing(v)} min={0} max={8} step={0.5} className="mt-1" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Jarak Baris</span>
              <Slider value={[lineHeight]} onValueChange={([v]) => setLineHeight(v)} min={1.2} max={3} step={0.1} className="mt-1" />
            </div>
          </div>
        )}

        <p className="font-dyslexic text-card-foreground whitespace-pre-wrap" style={textStyle}>
          {detectedText}
        </p>
      </div>

      {/* Translation */}
      <div className="bg-card rounded-xl p-4 shadow-sm border border-border/50 space-y-3">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-primary shrink-0" />
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="flex-1 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={translate} disabled={isTranslating} className="bg-gradient-primary text-primary-foreground h-9 px-4">
            {isTranslating ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : "Terjemahkan"}
          </Button>
        </div>

        {translatedText && (
          <div className="bg-accent/40 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Hasil Terjemahan</span>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => speak(translatedText, targetLang)}>
                <Volume2 className="w-3 h-3" />
              </Button>
            </div>
            <p className="font-dyslexic text-accent-foreground whitespace-pre-wrap" style={textStyle}>
              {translatedText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextResultPanel;
