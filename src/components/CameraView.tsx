import { useRef, useState, useCallback, useEffect } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Upload, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  isProcessing: boolean;
  autoScanInterval?: number;
}

const CameraView = ({ onCapture, isProcessing, autoScanInterval = 3000 }: CameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [zoom, setZoom] = useState(1);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [scanCount, setScanCount] = useState(0);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startCamera]);

  const processImage = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const adjusted = Math.min(255, Math.max(0, (gray - 128) * 1.5 + 128));
      const val = adjusted > 140 ? 255 : 0;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png", 1.0);
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const cropW = video.videoWidth / zoom;
    const cropH = video.videoHeight / zoom;
    const sx = (video.videoWidth - cropW) / 2;
    const sy = (video.videoHeight - cropH) / 2;

    canvas.width = cropW;
    canvas.height = cropH;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(video, sx, sy, cropW, cropH, 0, 0, cropW, cropH);

    const result = processImage(canvas);
    if (result) {
      setScanCount((c) => c + 1);
      onCapture(result);
    }
  }, [zoom, onCapture, isProcessing, processImage]);

  // Auto-scan interval
  useEffect(() => {
    if (isStreaming && !isProcessing) {
      intervalRef.current = setInterval(() => {
        capture();
      }, autoScanInterval);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStreaming, isProcessing, capture, autoScanInterval]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const result = processImage(canvas);
        if (result) {
          setScanCount((c) => c + 1);
          onCapture(result);
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-2xl bg-foreground/5 border border-border/50 shadow-card">
        <video
          ref={videoRef}
          className="w-full aspect-[4/3] object-cover"
          playsInline
          muted
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
        />

        {/* Scanning indicator */}
        {isStreaming && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at center, transparent 60%, hsl(210 30% 15% / 0.25) 100%)"
            }} />
            {/* Scan line animation */}
            <div className="absolute left-4 right-4 h-0.5 bg-primary/60 animate-scan rounded-full" style={{ boxShadow: '0 0 12px 2px hsl(174 62% 40% / 0.4)' }} />
            {/* Corner markers */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/70 rounded-tl-md" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/70 rounded-tr-md" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/70 rounded-bl-md" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/70 rounded-br-md" />
            {/* Status pill */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-medium text-foreground">Scanning</span>
            </div>
          </div>
        )}

        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-background/30 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-card/95 px-6 py-4 rounded-xl shadow-deep flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="font-dyslexic text-sm text-card-foreground font-medium">Memproses...</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-between">
        {/* Zoom */}
        <div className="flex items-center gap-1 bg-card rounded-full px-2 py-1.5 shadow-sm border border-border/50">
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => setZoom((z) => Math.max(1, z - 0.5))}>
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs font-dyslexic text-muted-foreground min-w-[3ch] text-center">{zoom.toFixed(1)}x</span>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => setZoom((z) => Math.min(4, z + 0.5))}>
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Scan count */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/60 border border-border/50">
          <ScanLine className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-accent-foreground">{scanCount} scan</span>
        </div>

        {/* Upload + Flip */}
        <div className="flex items-center gap-1.5">
          <Button size="icon" variant="outline" className="h-9 w-9 rounded-full" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="outline" className="h-9 w-9 rounded-full" onClick={toggleCamera}>
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;
