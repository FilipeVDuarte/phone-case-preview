import { useRef, useEffect, useCallback, useState } from "react";
import { PhoneModel } from "@/data/phoneModels";
import { ToolBar } from "./ToolBar";
import { MobiLogo } from "./MobiLogo";

interface PhonePreviewProps {
  model: PhoneModel | null;
  uploadedImage: string | null;
  imagePosition: { x: number; y: number };
  imageScale: number;
  historyLength: number;
  onImagePositionChange: (position: { x: number; y: number }) => void;
  onImageScaleChange: (scale: number) => void;
  onUndo: () => void;
  onReset: () => void;
  downloadableRef: React.RefObject<HTMLDivElement>;
}

export function PhonePreview({
  model,
  uploadedImage,
  imagePosition,
  imageScale,
  historyLength,
  onImagePositionChange,
  onImageScaleChange,
  onUndo,
  onReset,
  downloadableRef,
}: PhonePreviewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const screenAreaRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!uploadedImage) return;
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    },
    [imagePosition, uploadedImage]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      onImagePositionChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart, onImagePositionChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!uploadedImage) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.max(0.3, Math.min(3, imageScale + delta));
      onImageScaleChange(newScale);
    },
    [imageScale, uploadedImage, onImageScaleChange]
  );

  const handleZoomIn = useCallback(() => {
    onImageScaleChange(Math.min(3, imageScale + 0.1));
  }, [imageScale, onImageScaleChange]);

  const handleZoomOut = useCallback(() => {
    onImageScaleChange(Math.max(0.3, imageScale - 0.1));
  }, [imageScale, onImageScaleChange]);

  const handleReset = useCallback(() => {
    onImagePositionChange({ x: 0, y: 0 });
    onImageScaleChange(1);
    onReset();
  }, [onImagePositionChange, onImageScaleChange, onReset]);

  const handleRotateReset = useCallback(() => {
    // Reset to default state
    onImagePositionChange({ x: 0, y: 0 });
    onImageScaleChange(1);
  }, [onImagePositionChange, onImageScaleChange]);

  // Touch support for mobile
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!uploadedImage || e.touches.length !== 1) return;
      setIsDragging(true);
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX - imagePosition.x,
        y: touch.clientY - imagePosition.y,
      };
    },
    [uploadedImage, imagePosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !touchStartRef.current || e.touches.length !== 1)
        return;
      const touch = e.touches[0];
      onImagePositionChange({
        x: touch.clientX - touchStartRef.current.x,
        y: touch.clientY - touchStartRef.current.y,
      });
    },
    [isDragging, onImagePositionChange]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    touchStartRef.current = null;
  }, []);

  if (!model) {
    return (
      <div className="flex items-center justify-center w-full bg-gray-100 rounded-3xl border-4 border-black text-center p-8 h-auto md:h-96">
        <p className="text-gray-600 text-lg">Selecione um modelo para começar</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 bg-gray-100 rounded-3xl border-4 border-black p-8 shadow-lg">
      {/* Logo */}
      <div className="flex justify-center">
        <MobiLogo />
      </div>

      {/* Preview Area */}
      <div className="flex items-end gap-3 bg-white rounded-3xl border-4 border-black p-6 relative w-full">
        {/* Downloadable Area (for html2canvas) */}
        <div
          ref={downloadableRef}
          className="flex items-center justify-center bg-white rounded-3xl p-4"
          style={{ width: "500px", maxWidth: "100%", aspectRatio: "auto" }}
        >
          {/* Phone Mockup */}
          <div className="relative flex-shrink-0">
            <img
              src={model.mockupImageUrl}
              alt={model.name}
              style={{
                width: `${model.frameWidth}px`,
                height: `${model.frameHeight}px`,
              }}
              className="rounded-2xl"
            />

            {/* Screen Area with Clipped Image */}
            {uploadedImage && (
              <div
                ref={screenAreaRef}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  left: `${model.screenOffsetX}px`,
                  top: `${model.screenOffsetY}px`,
                  width: `${model.screenWidth}px`,
                  height: `${model.screenHeight}px`,
                  overflow: "hidden",
                  borderRadius: "16px",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <svg
                  width={model.screenWidth}
                  height={model.screenHeight}
                  style={{ position: "absolute", top: 0, left: 0 }}
                >
                  <defs>
                    <clipPath id="phone-mask">
                      <path d={model.screenMaskPath} />
                    </clipPath>
                  </defs>
                </svg>

                <img
                  src={uploadedImage}
                  alt="User uploaded"
                  style={{
                    position: "absolute",
                    left: `${imagePosition.x}px`,
                    top: `${imagePosition.y}px`,
                    transform: `scale(${imageScale})`,
                    transformOrigin: "0 0",
                    width: "100%",
                    height: "auto",
                    minHeight: "100%",
                    clipPath: "url(#phone-mask)",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Toolbar */}
        {uploadedImage && (
          <div className="flex flex-col items-center">
            <ToolBar
              onUndo={onUndo}
              onReset={handleReset}
              onRotateReset={handleRotateReset}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              canUndo={historyLength > 0}
            />
          </div>
        )}
      </div>

      {/* Instruction Text */}
      <div className="w-full bg-white border-4 border-black rounded-3xl py-4 px-6 text-center">
        <p className="text-black font-medium text-lg">
          Clique e arraste para ajustar
        </p>
      </div>
    </div>
  );
}
