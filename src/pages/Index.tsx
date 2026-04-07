import { useState, useCallback } from "react";
import { createWorker } from "tesseract.js";
import { Eye, Sparkles } from "lucide-react";
import CameraView from "@/components/CameraView";
import TextResultPanel from "@/components/TextResultPanel";
import { toast } from "sonner";

const Index = () => {
  const [detectedText, setDetectedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<"camera" | "result">("camera");

  const handleCapture = useCallback(async (imageData: string) => {
    setIsProcessing(true);
    try {
      const worker = await createWorker("eng+ind", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            // progress
          }
        },
      });

      await worker.setParameters({
        tessedit_pageseg_mode: "6" as any,
        preserve_interword_spaces: "1" as any,
      });

      const { data } = await worker.recognize(imageData);
      await worker.terminate();

      const text = data.text.trim();
      if (!text) {
        toast.error("Tidak ada teks terdeteksi. Coba dekatkan kamera ke teks.");
        setIsProcessing(false);
        return;
      }

      setDetectedText(text);
      setMode("result");
    } catch (err) {
      console.error("OCR error:", err);
      toast.error("Gagal mendeteksi teks. Coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleReset = () => {
    setDetectedText("");
    setMode("camera");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-lg mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-card">
              <Eye className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-dyslexic text-base font-bold text-foreground leading-tight tracking-tight">
                Dyslexia Lens
              </h1>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                Baca teks lebih mudah
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/60 border border-border/50">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-medium text-accent-foreground">OCR Ready</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-5">
        {mode === "camera" ? (
          <div className="space-y-5">
            {/* Instruction pill */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-border/50">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground font-dyslexic">
                  Arahkan kamera ke teks, zoom untuk fokus
                </span>
              </div>
            </div>
            <CameraView onCapture={handleCapture} isProcessing={isProcessing} />
          </div>
        ) : (
          <TextResultPanel detectedText={detectedText} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-3 text-center border-t border-border/30">
        <p className="text-[10px] text-muted-foreground/60 font-dyslexic">
          Dibuat untuk membantu pembaca disleksia 💙
        </p>
      </footer>
    </div>
  );
};

export default Index;
