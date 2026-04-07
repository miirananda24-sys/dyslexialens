import { useState, useCallback } from "react";
import { createWorker } from "tesseract.js";
import { Eye, Sparkles, Trash2 } from "lucide-react";
import CameraView from "@/components/CameraView";
import TextResultPanel from "@/components/TextResultPanel";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ScanResult {
  id: number;
  text: string;
  timestamp: Date;
}

const Index = () => {
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

      const newResult: ScanResult = { id: Date.now(), text, timestamp: new Date() };
      setScanResults((prev) => {
        // Avoid duplicates
        if (prev.length > 0 && prev[0].text === text) return prev;
        return [newResult, ...prev].slice(0, 20);
      });
      if (!selectedResult) setSelectedResult(newResult);
    } catch (err) {
      console.error("OCR error:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedResult]);

  const clearResults = () => {
    setScanResults([]);
    setSelectedResult(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Eye className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-dyslexic text-sm font-bold text-foreground leading-tight">Dyslexia Lens</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">Baca teks lebih mudah</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/50 border border-border/40">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-medium text-accent-foreground">Live Scan</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
        {/* Camera - always visible */}
        <CameraView onCapture={handleCapture} isProcessing={isProcessing} autoScanInterval={3500} />

        {/* Selected result panel */}
        {selectedResult && (
          <TextResultPanel detectedText={selectedResult.text} />
        )}

        {/* Scan history */}
        {scanResults.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Riwayat Scan ({scanResults.length})</h2>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground gap-1" onClick={clearResults}>
                <Trash2 className="w-3 h-3" /> Hapus
              </Button>
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {scanResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => setSelectedResult(result)}
                  className={`w-full text-left p-3 rounded-lg border transition-all text-sm font-dyslexic ${
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

      <footer className="py-2 text-center border-t border-border/30">
        <p className="text-[10px] text-muted-foreground/50 font-dyslexic">Dibuat untuk membantu pembaca disleksia 💙</p>
      </footer>
    </div>
  );
};

export default Index;
