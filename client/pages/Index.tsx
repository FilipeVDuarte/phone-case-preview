import { useRef, useState, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { PhoneModel } from '@shared/api';
import { PhonePreview } from '@/components/PhonePreview';
import { OptionsPanel } from '@/components/OptionsPanel';

interface ImageState {
  position: { x: number; y: number };
  scale: number;
}

export default function Index() {
  const [models, setModels] = useState<PhoneModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [history, setHistory] = useState<ImageState[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadModels() {
      try {
        const response = await fetch('/api/models');
        const data = await response.json();
        setModels(data);
      } catch (error) {
        console.error('Error loading models:', error);
      }
    }
    loadModels();
  }, []);

  const saveToHistory = useCallback((position: { x: number; y: number }, scale: number) => {
    setHistory((prev) => {
      const newHistory = [...prev, { position, scale }];
      return newHistory.slice(-10);
    });
  }, []);

  const handleModelChange = (model: PhoneModel) => {
    setSelectedModel(model);
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
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = \mobifans-preview-\-\.png\;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading preview:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white font-plus-jakarta-sans'>
      <div className='container mx-auto px-4 py-6 md:py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
          <div className='order-1 lg:order-1'>
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
          <div className='order-2 lg:order-2 flex flex-col justify-start'>
            <OptionsPanel
              models={models}
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
