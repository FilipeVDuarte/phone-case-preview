import { useRef, useState, useCallback } from "react";
import html2canvas from "html2canvas";
import { PhoneModel, PHONE_MODELS } from "@/data/phoneModels";
import { PhonePreview } from "@/components/PhonePreview";
import { OptionsPanel } from "@/components/OptionsPanel";

interface ImageState {
  position: { x: number; y: number };
  scale: number;
}

export default function Index() {
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [history, setHistory] = useState<ImageState[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadableRef = useRef<HTMLDivElement>(null);

  // Save state to history when image position or scale changes
  const saveToHistory = useCallback((position: { x: number; y: number }, scale: number) => {
    setHistory((prev) => {
      const newHistory = [...prev, { position, scale }];
      // Keep only last 10 states
      return newHistory.slice(-10);
    });
  }, []);

  const handleModelChange = (model: PhoneModel) => {
    setSelectedModel(model);
    // Reset image state when changing models
    setUploadedImage(null);
    setImagePosition({ x: 0, y: 0 });
    setImageScale(1);
    setHistory([]);
  };

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData);
    setImagePosition({ x: 0, y: 0 });
    setImageScale(1);
    setHistory([]);
  };

  const handleImagePositionChange = (position: { x: number; y: number }) => {
    setImagePosition(position);
  };

  const handleImageScaleChange = (scale: number) => {
    setImageScale(scale);
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const newHistory = [...history];
    const previousState = newHistory.pop();

    if (previousState) {
      setImagePosition(previousState.position);
      setImageScale(previousState.scale);
      setHistory(newHistory);
    }
  };

  const handleReset = () => {
    setImagePosition({ x: 0, y: 0 });
    setImageScale(1);
    setHistory([]);
  };

  const handleDownloadPreview = async () => {
    if (!downloadableRef.current || !uploadedImage) return;

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(downloadableRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `mobifans-preview-${selectedModel?.id || "phone"}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading preview:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-plus-jakarta-sans">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Desktop/Tablet Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Preview Panel */}
          <div className="order-1 lg:order-1">
            <PhonePreview
              model={selectedModel}
              uploadedImage={uploadedImage}
              imagePosition={imagePosition}
              imageScale={imageScale}
              historyLength={history.length}
              onImagePositionChange={(position) => {
                handleImagePositionChange(position);
                saveToHistory(position, imageScale);
              }}
              onImageScaleChange={(scale) => {
                handleImageScaleChange(scale);
                saveToHistory(imagePosition, scale);
              }}
              onUndo={handleUndo}
              onReset={handleReset}
              downloadableRef={downloadableRef}
            />
          </div>

          {/* Options Panel */}
          <div className="order-2 lg:order-2 flex flex-col justify-start">
            <OptionsPanel
              selectedModel={selectedModel}
              hasUploadedImage={uploadedImage !== null}
              onModelChange={handleModelChange}
              onImageUpload={handleImageUpload}
              onDownloadPreview={handleDownloadPreview}
              isDownloading={isDownloading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
