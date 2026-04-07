import { useState, useCallback } from "react";
import { createWorker } from "tesseract.js";
import { Eye } from "lucide-react";
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
            // Could show progress here
          }
        },
      });

      // Set high-accuracy parameters
      await worker.setParameters({
        tessedit_pageseg_mode: "6" as any, // Assume uniform block of text
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-dyslexic text-lg font-bold text-foreground leading-tight">
              Dyslexia Lens
            </h1>
            <p className="text-xs text-muted-foreground">
              Scan teks • Font ramah disleksia • TTS
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {mode === "camera" ? (
          <>
            <div className="text-center space-y-2">
              <p className="font-dyslexic text-muted-foreground text-sm">
                Arahkan kamera ke teks yang ingin dibaca
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                Zoom untuk fokus lebih jelas
              </div>
            </div>
            <CameraView onCapture={handleCapture} isProcessing={isProcessing} />
          </>
        ) : (
          <TextResultPanel detectedText={detectedText} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-muted-foreground">
        <p className="font-dyslexic">Dibuat untuk membantu pembaca disleksia 💙</p>
      </footer>
    </div>
  );
};

export default Index;
