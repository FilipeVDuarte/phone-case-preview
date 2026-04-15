interface ToolBarProps {
  onUndo: () => void;
  onReset: () => void;
  onRotateReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  canUndo?: boolean;
}

export function ToolBar({
  onUndo,
  onReset,
  onRotateReset,
  onZoomIn,
  onZoomOut,
  canUndo = false,
}: ToolBarProps) {
  const buttonClass =
    "w-12 h-12 rounded-full border-2 border-black bg-white hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center";

  return (
    <div className="flex flex-col gap-3 bg-white rounded-full p-5 shadow-lg border-2 border-black">
      {/* Undo Button */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={buttonClass}
        title="Undo"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3.99961 9.5H26.9961C32.9961 9.5 32.9961 1.5 26.9961 1.5H21.9961M24.9971 6C24.7075 5.71036 21.9539 3.48096 20.4562 2.27272C19.9618 1.87383 19.9597 1.12147 20.4514 0.719164L24.9971 -3"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            opacity={!canUndo ? 0.5 : 1}
          />
        </svg>
      </button>

      {/* Fit/Reset Transform Button */}
      <button onClick={onReset} className={buttonClass} title="Fit to Screen">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M14.5 3L21 9.5M14.5 3v6.5h6.5M9.5 21L3 14.5M9.5 21v-6.5H3"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Rotate Reset Button */}
      <button
        onClick={onRotateReset}
        className={buttonClass}
        title="Reset Rotation"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 2C19.5 3.5 21 6 21 9C21 14.5228 16.5228 19 11 19C5.47715 19 1 14.5228 1 9C1 4.47715 4.47715 1 9 1M17 2L15 4.5M17 2L19.5 4"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Zoom In Button */}
      <button onClick={onZoomIn} className={buttonClass} title="Zoom In">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect
            x="5"
            y="9"
            width="14"
            height="2"
            rx="1"
            fill="black"
          />
          <rect
            x="11"
            y="3"
            width="2"
            height="14"
            rx="1"
            fill="black"
          />
        </svg>
      </button>

      {/* Zoom Out Button */}
      <button onClick={onZoomOut} className={buttonClass} title="Zoom Out">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="9" width="14" height="2" rx="1" fill="black" />
        </svg>
      </button>
    </div>
  );
}
