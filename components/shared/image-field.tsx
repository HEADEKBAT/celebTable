// ImageField Component
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Celebrity } from "@/interfaces/types";

interface ImageFieldProps {
  field: keyof Celebrity; // Поле в объекте Celebrity
  initialImageUrl: string | null; // Начальный URL изображения
  onImageChange: (field: keyof Celebrity, file: File | null) => void; // Обработчик изменения изображения
  onImageDelete: (field: keyof Celebrity) => void; // Обработчик удаления изображения
}

export const ImageField: React.FC<ImageFieldProps> = ({
  field,
  initialImageUrl,
  onImageChange,
  onImageDelete,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const objectUrl = URL.createObjectURL(file); // Создаем временный URL для предварительного просмотра
      setPreviewUrl(objectUrl);
      onImageChange(field, file);
    }
  };

  const handleDelete = () => {
    setPreviewUrl(null); // Удаляем превью
    onImageDelete(field);
  };

  return (
    <div className="space-y-2">
      {previewUrl ? (
        <div className="flex items-center space-x-4">
          <img
            src={previewUrl}
            alt={String(field)}
            className="h-20 w-20 object-cover rounded border"
          />
          <div className="flex space-x-2">
            <label htmlFor={`upload-${field}`} className="btn btn-primary cursor-pointer">
              Изменить
            </label>
            <Button variant="destructive" onClick={handleDelete}>
              Удалить
            </Button>
            <Input
              id={`upload-${field}`}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <label htmlFor={`upload-${field}`} className="btn btn-success cursor-pointer">
            Добавить
          </label>
          <Input
            id={`upload-${field}`}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};
