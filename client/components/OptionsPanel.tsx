import { useRef } from 'react';
import { PhoneModel } from '@shared/api';

interface OptionsPanelProps {
  models: PhoneModel[];
  selectedModel: PhoneModel | null;
  hasUploadedImage: boolean;
  onModelChange: (model: PhoneModel) => void;
  onImageUpload: (imageData: string) => void;
  onDownloadPreview: () => Promise<void>;
  isDownloading?: boolean;
}

export function OptionsPanel({
  models,
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
    const model = models.find((m) => m.id === modelId);
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
    <div className='flex flex-col items-center gap-5 bg-white rounded-3xl border-4 border-black p-8 shadow-lg w-full md:w-auto'>
      <div className='w-full max-w-xs'>
        <label className='block text-gray-700 font-medium text-sm mb-2'>
          Modelo
        </label>
        <select
          value={selectedModel?.id || ''}
          onChange={handleModelChange}
          className='w-full px-4 py-3 border-4 border-black rounded-lg bg-white text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-black appearance-none cursor-pointer'
          style={{
            backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'black\' stroke-width=\'2\'%3e%3cpath d=\'M6 9l6 6 6-6\'/%3e%3c/svg%3e")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '20px',
            paddingRight: '40px',
          }}
        >
          <option value=''>Qual o celular?</option>
          {models.map((model) => (
            <option key={model.id} value={model.id} disabled={!model.isAvailable}>
              {model.name}{!model.isAvailable ? ' (Indisponível no momento)' : ''}
            </option>
          ))}
        </select>
      </div>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileSelect}
        className='hidden'
      />

      <button
        onClick={handleUploadClick}
        disabled={!selectedModel || !selectedModel.isAvailable}
        className={w-full max-w-xs px-6 py-3 border-4 border-black rounded-xl font-medium text-lg transition-all }
      >
        Faça upload aqui
      </button>

      <button
        onClick={onDownloadPreview}
        disabled={!hasUploadedImage || isDownloading}
        className={w-full max-w-xs px-6 py-3 border-4 border-black rounded-xl font-medium text-lg transition-all }
      >
        {isDownloading ? 'Baixando...' : 'Baixar Preview'}
      </button>
    </div>
  );
}
