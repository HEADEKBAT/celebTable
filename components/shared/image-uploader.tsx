import React, { useState } from "react";
import { BASE_IMAGE_URL } from "@/config";
import { Celebrity } from "@/interfaces/types";

interface ImageUploaderProps {
  field: keyof Celebrity; // Поле в объекте formData
  formData: Celebrity; // Данные формы
  setFormData: React.Dispatch<React.SetStateAction<Celebrity>>; // Обновление данных формы
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  field,
  formData,
  setFormData,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // URL для нового изображения

  // Генерация URL для изображения
  const getImageUrl = () => {
    if (previewUrl) return previewUrl; // Показываем новое изображение, если оно есть
    if (formData.id && formData[field]) {
      return `${BASE_IMAGE_URL}/${formData.id}/${formData[field]}`;
    }
    return null;
  };

  // Загрузка изображения
  const handleImageAddOrUpdate = async (file: File) => {
    if (!formData.id) return;

    const randomFileName = `${Date.now()}-${file.name}`;
    const reader = new FileReader();

    reader.onload = async () => {
      const base64String = reader.result?.toString().split(",")[1];

      const formDataToSend = {
        id: formData.id,
        imageName: randomFileName,
        imageData: base64String,
      };

      try {
        setUploading(true);
        setPreviewUrl(URL.createObjectURL(file)); // Устанавливаем локальный preview
        const response = await fetch("/api/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataToSend),
        });

        if (response.ok) {
          setFormData((prev: Celebrity) => ({ ...prev, [field]: randomFileName }));
          setPreviewUrl(null); // Очищаем локальный preview после загрузки
        } else {
          console.error("Ошибка при загрузке изображения");
        }
      } catch (error) {
        console.error("Ошибка при загрузке изображения:", error);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  // Удаление изображения
  const handleImageDelete = async () => {
    if (!formData.id || !formData[field]) return;

    try {
      setUploading(true);
      const response = await fetch("/api/delete-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formData.id,
          imageName: formData[field],
        }),
      });

      if (response.ok) {
        setFormData((prev: Celebrity) => ({ ...prev, [field]: "" }));
        setPreviewUrl(null);
      } else {
        console.error("Ошибка при удалении изображения");
      }
    } catch (error) {
      console.error("Ошибка при удалении изображения:", error);
    } finally {
      setUploading(false);
    }
  };

  // Обработка выбора файла
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageAddOrUpdate(file);
    }
  };

  const imageUrl = getImageUrl();

  return (
    <div className="space-y-2">
      {imageUrl ? (
        <div className="flex items-center space-x-4">
          <img src={imageUrl} alt={String(field)} className="h-16 w-16 rounded border object-cover" />
          <div className="flex space-x-2">
            <label
              htmlFor={`upload-${String(field)}`}
              className="btn btn-primary cursor-pointer"
            >
              Изменить
            </label>
            <button
              onClick={handleImageDelete}
              disabled={uploading}
              className="btn btn-danger"
            >
              Удалить
            </button>
            <input
              id={`upload-${String(field)}`}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        <div className="h-16 w-16 flex items-center justify-center border rounded bg-gray-100">
          <label
            htmlFor={`upload-${String(field)}`}
            className="btn btn-success cursor-pointer"
          >
            Добавить
          </label>
          <input
            id={`upload-${String(field)}`}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
