import React, { useState } from "react";
import { BASE_IMAGE_URL } from "@/config";
import { Celebrity } from "@/interfaces/types";

interface Props {
  formData: {
    id?: number;
    cimg1?: string;
    cimg2?: string;
    cimg3?: string;
    cimg4?: string;
    cimg5?: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<Celebrity>>;
}

export const ImageCompTableDialog: React.FC<Props> = ({ formData, setFormData }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageDelete = async (field: keyof typeof formData) => {
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
      } else {
        console.error("Ошибка при удалении изображения");
      }
    } catch (error) {
      console.error("Ошибка при удалении изображения:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageAddOrUpdate = async (field: keyof typeof formData, file: File) => {
    if (!formData.id) return;

    const randomFileName = `${Date.now()}-${file.name}`;
    const formDataToSend = {
      id: formData.id,
      imageName: randomFileName,
    };

    try {
      setUploading(true);
      const response = await fetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        setFormData((prev: Celebrity) => ({ ...prev, [field]: randomFileName }));
      } else {
        console.error("Ошибка при загрузке изображения");
      }
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
    } finally {
      setUploading(false);
    }
  };

  const getImageUrl = (field: keyof typeof formData) => {
    if (formData.id && formData[field]) {
      return `${BASE_IMAGE_URL}/${formData.id}/${formData[field]}`;
    }
    return ""; // Пустая строка, если `id` или имя картинки не задано
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageAddOrUpdate(field, file);
    }
  };

  const imageFields = ["cimg1", "cimg2", "cimg3", "cimg4", "cimg5"] as const;

  return (
    <div className="space-y-4">
      {imageFields.map((field) => (
        <div key={field} className="flex items-center space-x-4">
          {formData.id && formData[field] ? (
            <>
              <img src={getImageUrl(field)} alt={field} className="h-16 w-16 rounded border" />
              <div className="flex space-x-2">
                <label htmlFor={`upload-${field}`} className="btn btn-primary cursor-pointer">
                  Изменить
                </label>
                <button
                  onClick={() => handleImageDelete(field)}
                  disabled={uploading}
                  className="btn btn-danger"
                >
                  Удалить
                </button>
                <input
                  id={`upload-${field}`}
                  type="file"
                  onChange={(e) => handleFileChange(e, field)}
                  className="hidden"
                />
              </div>
            </>
          ) : (
            <div className="h-16 w-16 flex items-center justify-center border rounded bg-gray-100">
              <label htmlFor={`upload-${field}`} className="btn btn-success cursor-pointer">
                Добавить
              </label>
              <input
                id={`upload-${field}`}
                type="file"
                onChange={(e) => handleFileChange(e, field)}
                className="hidden"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
