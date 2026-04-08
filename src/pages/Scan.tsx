import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createWorker } from "tesseract.js";
import { ArrowLeft, Eye, Moon, Sun, Sparkles, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { correctOCRText } from "@/lib/ocr-correction";
import CameraView from "@/components/CameraView";
import TextResultPanel from "@/components/TextResultPanel";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";

interface CorrectionInfo {
  original: string;
  suggested: string;
  similarity: number;
  wasChanged: boolean;
}

interface ScanResult {
  id: number;
  text: string;
  correctedText: string;
  corrections: CorrectionInfo[];
  timestamp: Date;
}

const Scan = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useAccessibility();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null);

  const handleCapture = useCallback(async (imageData: string) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker("eng+ind", 1);
      await worker.setParameters({
        tessedit_pageseg_mode: "6" as any,
        preserve_interword_spaces: "1" as any,
      });
      const { data } = await worker.recognize(imageData);
      await worker.terminate();

      const text = data.text.trim();
      if (!text || text.length < 3) {
        setIsProcessing(false);
        return;
      }

      // Post-processing with Levenshtein Distance
      const correctionResult = correctOCRText(text);

      const newResult: ScanResult = {
        id: Date.now(),
        text,
        correctedText: correctionResult.corrected,
        corrections: correctionResult.corrections,
        timestamp: new Date(),
      };
      setScanResults((prev) => {
        if (prev.length > 0 && prev[0].text === text) return prev;
        return [newResult, ...prev].slice(0, 20);
      });
      setSelectedResult((prev) => prev ?? newResult);
    } catch (err) {
      console.error("OCR error:", err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearResults = () => {
    setScanResults([]);
    setSelectedResult(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Eye className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="font-dyslexic text-sm font-bold text-foreground">Live Scan</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/50 border border-border/40">
              <Sparkles className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-medium text-accent-foreground">OCR Ready</span>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
        <CameraView onCapture={handleCapture} isProcessing={isProcessing} autoScanInterval={3500} />

        {selectedResult && (
          <div className="space-y-3">
            <TextResultPanel detectedText={selectedResult.correctedText} accessibilitySettings={settings} />

            {/* Correction details */}
            {selectedResult.corrections.length > 0 && (
              <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  Koreksi OCR ({selectedResult.corrections.length} kata)
                </h3>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedResult.corrections.map((c, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg ${
                      c.wasChanged ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                    }`}>
                      {c.wasChanged ? (
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                      )}
                      <span className="line-through opacity-60">{c.original}</span>
                      <span>→</span>
                      <span className="font-medium">{c.suggested}</span>
                      <span className="ml-auto text-[10px] opacity-60">{c.similarity.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {scanResults.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Riwayat Scan ({scanResults.length})
              </h2>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground gap-1" onClick={clearResults}>
                <Trash2 className="w-3 h-3" /> Hapus
              </Button>
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {scanResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => setSelectedResult(result)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${
                    settings.useDyslexicFont ? "font-dyslexic" : ""
                  } ${
                    selectedResult?.id === result.id
                      ? "bg-primary/10 border-primary/30 text-foreground"
                      : "bg-card border-border/40 text-muted-foreground hover:bg-accent/30"
                  }`}
                >
                  <p className="line-clamp-2 leading-relaxed">{result.text}</p>
                  <span className="text-[10px] text-muted-foreground/60 mt-1 block">
                    {result.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Scan;
