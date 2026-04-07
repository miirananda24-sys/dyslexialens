import { useState } from "react";
import { Volume2, VolumeX, Languages, Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface TextResultPanelProps {
  detectedText: string;
  onReset: () => void;
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

const TextResultPanel = ({ detectedText, onReset }: TextResultPanelProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [targetLang, setTargetLang] = useState("id");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const speak = (text: string, lang?: string) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || targetLang;
    utterance.rate = 0.85; // Slower for dyslexia
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
        toast.error("Terjemahan gagal, coba lagi");
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

  const displayText = translatedText || detectedText;

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* Detected text card */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Teks Terdeteksi
          </h2>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => speak(detectedText, "auto")}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={copyText}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <p className="font-dyslexic text-lg leading-relaxed tracking-wide text-card-foreground whitespace-pre-wrap">
          {detectedText}
        </p>
      </div>

      {/* Translation controls */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border space-y-4">
        <div className="flex items-center gap-3">
          <Languages className="w-5 h-5 text-primary shrink-0" />
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Pilih bahasa" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={translate}
            disabled={isTranslating}
            className="bg-gradient-primary text-primary-foreground"
          >
            {isTranslating ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              "Terjemahkan"
            )}
          </Button>
        </div>

        {translatedText && (
          <div className="bg-accent/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Hasil Terjemahan</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-primary"
                onClick={() => speak(translatedText, targetLang)}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <p className="font-dyslexic text-lg leading-relaxed tracking-wide text-accent-foreground whitespace-pre-wrap">
              {translatedText}
            </p>
          </div>
        )}
      </div>

      {/* Reset button */}
      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={onReset}
      >
        <RefreshCw className="w-4 h-4" />
        Scan Ulang
      </Button>
    </div>
  );
};

export default TextResultPanel;
