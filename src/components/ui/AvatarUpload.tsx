/**
 * AvatarUpload Component
 * Upload de imagem para avatar/logo com preview e compressão automática
 */

import { useState, useRef } from "react";
import { Upload, X, User, Building2, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  value?: string;
  onChange: (file: File | null) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  label?: string;
  error?: string;
  type?: "user" | "company";
  className?: string;
  id?: string;
  name?: string;
}

export const AvatarUpload = ({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  label,
  error,
  type = "user",
  className,
  id,
  name,
}: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadId =
    id || name || label?.toLowerCase().replace(/\s+/g, "-") || `avatar-upload-${type}`;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione uma imagem válida");
      return;
    }

    try {
      setIsCompressing(true);
      onUploadStart?.();

      // Opções de compressão
      const options = {
        maxSizeMB: 0.5, // Máximo 500KB
        maxWidthOrHeight: type === "user" ? 512 : 1024, // Avatar menor, logo maior
        useWebWorker: true,
        initialQuality: 0.9, // Qualidade inicial alta
        preserveExif: false, // Remover metadados para reduzir tamanho
      };

      // Comprimir imagem
      const compressedFile = await imageCompression(file, options);

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);

      onChange(compressedFile);
    } catch {
      alert("Erro ao processar a imagem. Tente novamente.");
    } finally {
      setIsCompressing(false);
      onUploadEnd?.();
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const Icon = type === "user" ? User : Building2;
  const placeholderText = type === "user" ? "Adicionar foto" : "Adicionar logo";

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={uploadId}
          className="block text-sm font-medium text-gray-900 dark:text-white mb-4 text-center"
        >
          {label}
        </label>
      )}

      <div className="flex flex-col items-center gap-4">
        {/* Preview/Placeholder - No topo */}
        <div
          onClick={handleClick}
          className={cn(
            "relative flex items-center justify-center overflow-hidden cursor-pointer",
            "bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600",
            "hover:border-medical-500 dark:hover:border-medical-400 transition-colors",
            type === "user" ? "w-28 h-28 rounded-full" : "w-28 h-28 rounded-lg",
            error && "border-critical-500"
          )}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Icon className="w-10 h-10 text-gray-400" />
          )}
        </div>

        {/* Actions - Embaixo */}
        <div className="w-full flex flex-col items-center gap-2">
          <input
            ref={inputRef}
            id={uploadId}
            name={name}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label={label || placeholderText}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              disabled={isCompressing}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer",
                "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white",
                "hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isCompressing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {preview ? "Alterar" : placeholderText}
                </>
              )}
            </button>

            {preview && (
              <button
                type="button"
                onClick={handleRemove}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer",
                  "bg-critical-50 dark:bg-critical-900/20 text-critical-600 dark:text-critical-400",
                  "hover:bg-critical-100 dark:hover:bg-critical-900/30 transition-colors"
                )}
              >
                <X className="w-4 h-4" />
                Remover
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            PNG, JPG ou GIF (máx. 5MB)
          </p>
        </div>
      </div>

      {error && (
        <div className="h-6 mt-1">
          <p className="text-sm text-critical-600 dark:text-critical-400 text-center">{error}</p>
        </div>
      )}
    </div>
  );
};
