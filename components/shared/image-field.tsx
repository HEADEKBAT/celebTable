"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Celebrity } from "@/interfaces/types";
import { X } from "lucide-react";

const MAX_FILE_SIZE = 80 * 1024; // 80 KB

interface ImageFieldProps {
  field: keyof Celebrity;
  initialImageUrl: string | null;
  onImageChange: (field: keyof Celebrity, file: File | null) => void;
  onImageDelete: (field: keyof Celebrity) => void;
}

export const ImageField: React.FC<ImageFieldProps> = ({ field, initialImageUrl, onImageChange, onImageDelete }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert("Размер файла превышает 80 KB. Пожалуйста, выберите меньший файл.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onImageChange(field, file);
    }
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    onImageDelete(field);
  };

  return (
    <div className="relative w-32 h-32 rounded border overflow-hidden group bg-gray-100">
      {previewUrl ? (
        <>
          {/* Кнопка удаления (в углу) */}
          <button
            type="button"
            onClick={handleDelete}
            className="absolute top-1 right-1 z-20 text-white text-sm bg-red-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700"
            title="Удалить"
          >
            <X />
          </button>

          {/* Картинка (уменьшенная и смещённая вниз) */}
          <img src={previewUrl} alt={String(field)} className="absolute bottom-0 object-cover z-10 w-full" />

          {/* Кнопка "изменить" — занимает всё пространство */}
          <label
            htmlFor={`upload-${field}`}
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 z-10 cursor-pointer flex items-center justify-center text-white text-xs font-medium transition-opacity"
          >
            Изменить
          </label>

          <Input id={`upload-${field}`} type="file" className="hidden" onChange={handleFileChange} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <label htmlFor={`upload-${field}`} className="text-sm text-blue-600 hover:underline cursor-pointer">
            Добавить
          </label>
          <Input id={`upload-${field}`} type="file" className="hidden" onChange={handleFileChange} />
        </div>
      )}
    </div>
  );
};
