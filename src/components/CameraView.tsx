import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraViewProps {
  onCapture: (imageData: string) => void;
  isProcessing: boolean;
}

const CameraView = ({ onCapture, isProcessing }: CameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [zoom, setZoom] = useState(1);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
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

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
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

    // Contrast boost + binarize for OCR
    const imageData = ctx.getImageData(0, 0, cropW, cropH);
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

    onCapture(canvas.toDataURL("image/png", 1.0));
  }, [zoom, onCapture]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="relative w-full">
      <div className="relative overflow-hidden rounded-3xl bg-foreground/5">
        {/* Video - NO mirror (scaleX removed), no transform for zoom on display */}
        <video
          ref={videoRef}
          className="w-full aspect-[3/4] object-cover"
          playsInline
          muted
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
          }}
        />

        {/* Viewfinder overlay */}
        {isStreaming && !isProcessing && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Subtle vignette */}
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at center, transparent 50%, hsl(210 30% 15% / 0.3) 100%)"
            }} />
            {/* Corner brackets */}
            <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-5rem)]" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 24 L0 8 Q0 0 8 0 L24 0" stroke="hsl(174 62% 40%)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M100% 24 L100% 8 Q100% 0 calc(100%-8) 0 L calc(100%-24) 0" stroke="hsl(174 62% 40%)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0 calc(100%-24) L0 calc(100%-8) Q0 100% 8 100% L24 100%" stroke="hsl(174 62% 40%)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M100% calc(100%-24) L100% calc(100%-8) Q100% 100% calc(100%-8) 100% L calc(100%-24) 100%" stroke="hsl(174 62% 40%)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            {/* Center crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/40" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/40" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-px bg-primary/40" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-px bg-primary/40" />
            </div>
          </div>
        )}

        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-background/40 flex items-center justify-center backdrop-blur-md">
            <div className="bg-card/95 px-8 py-5 rounded-2xl shadow-deep flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" style={{ borderWidth: '3px' }} />
              <span className="font-dyslexic text-sm text-card-foreground font-medium">Mendeteksi teks...</span>
              <span className="text-xs text-muted-foreground">Mohon tunggu sebentar</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls - floating pill */}
      <div className="mt-4 flex items-center justify-center gap-3">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-card rounded-full px-2 py-1.5 shadow-card border border-border">
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full text-foreground hover:text-primary hover:bg-accent"
            onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-dyslexic text-muted-foreground min-w-[3.5ch] text-center font-medium">
            {zoom.toFixed(1)}x
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full text-foreground hover:text-primary hover:bg-accent"
            onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Capture button */}
        <button
          className="relative h-[72px] w-[72px] rounded-full bg-gradient-primary flex items-center justify-center shadow-deep active:scale-95 transition-transform disabled:opacity-50"
          onClick={capture}
          disabled={!isStreaming || isProcessing}
        >
          <div className="absolute inset-1 rounded-full border-2 border-primary-foreground/30" />
          <Camera className="w-7 h-7 text-primary-foreground" />
        </button>

        {/* Flip camera */}
        <div className="bg-card rounded-full shadow-card border border-border">
          <Button
            size="icon"
            variant="ghost"
            className="h-11 w-11 rounded-full text-foreground hover:text-primary hover:bg-accent"
            onClick={toggleCamera}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;
