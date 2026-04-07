import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, RotateCcw, ZoomIn, ZoomOut, Focus } from "lucide-react";
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

    // Apply zoom by cropping center
    const cropW = video.videoWidth / zoom;
    const cropH = video.videoHeight / zoom;
    const sx = (video.videoWidth - cropW) / 2;
    const sy = (video.videoHeight - cropH) / 2;

    canvas.width = cropW;
    canvas.height = cropH;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sharpen: draw at native resolution
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(video, sx, sy, cropW, cropH, 0, 0, cropW, cropH);

    // Apply sharpening filter for better OCR
    const imageData = ctx.getImageData(0, 0, cropW, cropH);
    const data = imageData.data;

    // Increase contrast for better text detection
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const factor = 1.5; // contrast boost
      const adjusted = Math.min(255, Math.max(0, ((gray - 128) * factor + 128)));
      // Binarize for cleaner OCR
      const val = adjusted > 140 ? 255 : 0;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
    ctx.putImageData(imageData, 0, 0);

    const dataUrl = canvas.toDataURL("image/png", 1.0);
    onCapture(dataUrl);
  }, [zoom, onCapture]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="relative overflow-hidden rounded-2xl shadow-deep border-2 border-primary/20">
        <video
          ref={videoRef}
          className="w-full aspect-[3/4] object-cover"
          playsInline
          muted
          style={{ transform: `scale(${zoom})` }}
        />

        {/* Scan overlay */}
        {isStreaming && !isProcessing && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner guides */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-3 border-l-3 border-primary rounded-tl-lg" style={{ borderWidth: '3px' }} />
            <div className="absolute top-6 right-6 w-12 h-12 border-t-3 border-r-3 border-primary rounded-tr-lg" style={{ borderWidth: '3px' }} />
            <div className="absolute bottom-20 left-6 w-12 h-12 border-b-3 border-l-3 border-primary rounded-bl-lg" style={{ borderWidth: '3px' }} />
            <div className="absolute bottom-20 right-6 w-12 h-12 border-b-3 border-r-3 border-primary rounded-br-lg" style={{ borderWidth: '3px' }} />
            {/* Center focus indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Focus className="w-10 h-10 text-primary/50" />
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-card px-6 py-4 rounded-xl shadow-card flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="font-dyslexic text-sm text-card-foreground">Mendeteksi teks...</span>
            </div>
          </div>
        )}

        {/* Controls bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/20 h-10 w-10"
                onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <span className="text-primary-foreground text-sm font-dyslexic self-center min-w-[3ch] text-center">
                {zoom.toFixed(1)}x
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/20 h-10 w-10"
                onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
            </div>

            <Button
              size="lg"
              className="bg-gradient-primary text-primary-foreground rounded-full h-16 w-16 animate-pulse-glow"
              onClick={capture}
              disabled={!isStreaming || isProcessing}
            >
              <Camera className="w-7 h-7" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="text-primary-foreground hover:bg-primary-foreground/20 h-10 w-10"
              onClick={toggleCamera}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraView;
