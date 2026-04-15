import { useRef } from "react";
import { PhoneModel, PHONE_MODELS } from "@/data/phoneModels";

interface OptionsPanelProps {
  selectedModel: PhoneModel | null;
  hasUploadedImage: boolean;
  onModelChange: (model: PhoneModel) => void;
  onImageUpload: (imageData: string) => void;
  onDownloadPreview: () => Promise<void>;
  isDownloading?: boolean;
}

export function OptionsPanel({
  selectedModel,
  hasUploadedImage,
  onModelChange,
  onImageUpload,
  onDownloadPreview,
  isDownloading = false,
}: OptionsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const modelId = e.target.value;
    const model = PHONE_MODELS.find((m) => m.id === modelId);
    if (model) {
      onModelChange(model);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        onImageUpload(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-5 bg-white rounded-3xl border-4 border-black p-8 shadow-lg w-full md:w-auto">
      {/* Model Dropdown */}
      <div className="w-full max-w-xs">
        <label className="block text-gray-700 font-medium text-sm mb-2">
          Modelo
        </label>
        <select
          value={selectedModel?.id || ""}
          onChange={handleModelChange}
          className="w-full px-4 py-3 border-4 border-black rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            backgroundSize: "20px",
            paddingRight: "40px",
          }}
        >
          <option value="">Qual o celular?</option>
          {PHONE_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <button
        onClick={handleUploadClick}
        disabled={!selectedModel}
        className={`w-full max-w-xs px-6 py-3 border-4 border-black rounded-xl font-medium text-lg transition-all ${
          selectedModel
            ? "bg-white text-black hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
        }`}
      >
        Faça upload aqui
      </button>

      {/* Download Button */}
      <button
        onClick={onDownloadPreview}
        disabled={!hasUploadedImage || isDownloading}
        className={`w-full max-w-xs px-6 py-3 border-4 border-black rounded-xl font-medium text-lg transition-all ${
          hasUploadedImage && !isDownloading
            ? "bg-white text-black hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
        }`}
      >
        {isDownloading ? "Baixando..." : "Baixar Preview"}
      </button>
    </div>
  );
}
