import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Celebrity } from "../../interfaces/types";

import { useCelebritiesStore } from "@/lib/store";
import { ImageField } from "./image-field";

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  celebrity?: Celebrity | null;
}

export const TableDialog = ({ isOpen, onClose, celebrity }: TableDialogProps) => {
  const [formData, setFormData] = useState<Celebrity>({
    id: undefined,
    geo: "",
    name: "",
    category: "",
    subject: "",
    about: "",
    userName: "",
    cimg1: "",
    cimg2: "",
    cimg3: "",
    cimg4: "",
    cimg5: "",
  });

  const [localImages, setLocalImages] = useState<{ [key in keyof Celebrity]?: File | null }>({});
  const { triggerRefresh } = useCelebritiesStore();

  useEffect(() => {
    if (celebrity) {
      setFormData(celebrity);
    } else {
      setFormData({
        id: undefined,
        geo: "",
        name: "",
        category: "",
        subject: "",
        about: "",
        userName: "",
        cimg1: "",
        cimg2: "",
        cimg3: "",
        cimg4: "",
        cimg5: "",
      });
    }
  }, [celebrity]);

  const handleInputChange = (field: keyof Celebrity, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (field: keyof Celebrity, file: File | null) => {
    const timestamp = Date.now();
    const randomName = file ? `${timestamp}-${field}.jpg` : "";

    setLocalImages((prev) => ({ ...prev, [field]: file }));
    setFormData((prev) => ({ ...prev, [field]: randomName }));
  };

  const handleImageDelete = (field: keyof Celebrity) => {
    setLocalImages((prev) => ({ ...prev, [field]: null }));
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();

      // Добавляем текстовые данные
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(key, value as string);
        }
      });

      // Добавляем изображения
      Object.entries(localImages).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        }
      });

      const response = await fetch(`${API_URL}`, {
        method: "POST",
        body: formDataToSend, // Используем FormData для отправки
      });

      if (!response.ok) {
        throw new Error("Ошибка при сохранении данных");
      }

      const result = await response.json();
      console.log("Результат:", result);

      triggerRefresh();
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении записи:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{formData.id ? "Редактировать запись" : "Добавить запись"}</DialogTitle>
        <DialogDescription>
          {formData.id ? "Измените информацию и сохраните изменения." : "Заполните данные для новой записи."}
        </DialogDescription>
        <div className="space-y-4">
          <Input
            placeholder="Гео"
            value={formData.geo}
            onChange={(e) => handleInputChange("geo", e.target.value)}
          />
          <Input
            placeholder="Имя"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
          <Input
            placeholder="Категория"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
          />
          <Input
            placeholder="Субъект"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
          />
          <Textarea
            placeholder="Описание"
            value={formData.about}
            onChange={(e) => handleInputChange("about", e.target.value)}
          />
          {[
            "cimg1",
            "cimg2",
            "cimg3",
            "cimg4",
            "cimg5",
          ].map((field) => (
            <ImageField
              key={field}
              field={field as keyof Celebrity}
              initialImageUrl={formData[field as keyof Celebrity] ? `${BASE_IMAGE_URL}/${formData.id}/${formData[field as keyof Celebrity]}` : null}
              onImageChange={handleImageChange}
              onImageDelete={handleImageDelete}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>{formData.id ? "Сохранить изменения" : "Создать запись"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
