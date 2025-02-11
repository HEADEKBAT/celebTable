"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Celebrity } from "../../interfaces/types";
import { useCelebritiesStore } from "@/lib/store";
import { ImageField } from "./image-field";
import { useAuthStore } from "@/lib/auth-store";

const BASE_IMAGE_URL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  celebrity?: Celebrity | null;
}

export const TableDialog = ({ isOpen, onClose, celebrity }: TableDialogProps) => {
  const { triggerRefresh } = useCelebritiesStore();
  const { user: authUser } = useAuthStore();

  const [formData, setFormData] = useState<Celebrity>({
    id: undefined,
    geo: "",
    name: "",
    category: "",
    subject: "",
    about: "",
    owner: null, // При создании новой записи owner изначально null
    cimg1: "",
    cimg2: "",
    cimg3: "",
    cimg4: "",
    cimg5: "",
    access: "[]",
  });

  const [localImages, setLocalImages] = useState<{ [key in keyof Celebrity]?: File | null }>({});

  // При изменении celebrity заполняем форму, либо сбрасываем её для новой записи
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
        owner: null,
        cimg1: "",
        cimg2: "",
        cimg3: "",
        cimg4: "",
        cimg5: "",
        access: "[]",
      });
    }
  }, [celebrity]);

  // Если авторизованный пользователь найден, заполняем поле owner
  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({ ...prev, owner: authUser.name }));
    }
  }, [authUser]);

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

  // Функция для сохранения изменений (если редактируется запись) или создания новой записи
  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Для поля owner, если значение null, отправляем пустую строку
        if (key === "owner" && value === null) {
          formDataToSend.append(key, "");
        } else if (value) {
          formDataToSend.append(key, value as string);
        }
      });
      Object.entries(localImages).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        }
      });
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        body: formDataToSend,
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

  // Функция для создания дублированной записи
  const handleDuplicate = async () => {
    try {
      // Если записи для дублирования нет, выходим с ошибкой
      if (!formData.id) {
        throw new Error("Нет записи для дублирования");
      }
      // Сохраняем оригинальный id, который понадобится для дублирования
      const originalId = formData.id;
      // Создаем копию данных и удаляем поле id, чтобы API создало новую запись
      const duplicateData = { ...formData };
      delete duplicateData.id;
      // Устанавливаем owner согласно авторизованному пользователю (если есть)
      if (authUser) {
        duplicateData.owner = authUser.name;
      }
  
      const formDataToSend = new FormData();
      // Добавляем параметр action и оригинальный id
      formDataToSend.append("action", "duplicate");
      formDataToSend.append("id", originalId.toString());
  
      // Добавляем остальные текстовые поля
      Object.entries(duplicateData).forEach(([key, value]) => {
        if (key === "owner" && value === null) {
          formDataToSend.append(key, "");
        } else if (value) {
          formDataToSend.append(key, value as string);
        }
      });
      // Добавляем изображения: если новое изображение выбрано, отправляем его;
      // иначе, отправляем текущее значение поля
      Object.entries(localImages).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        } else if (duplicateData[key as keyof Celebrity]) {
          formDataToSend.append(key, duplicateData[key as keyof Celebrity] as string);
        }
      });
  
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error("Ошибка при создании дублированной записи");
      }
      const result = await response.json();
      console.log("Дублированная запись создана:", result);
      triggerRefresh();
      onClose();
    } catch (error) {
      console.error("Ошибка при создании дублированной записи:", error);
    }
  };
  
  // Функция для удаления записи
  const handleDelete = async () => {
    if (!formData.id) return;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("action", "delete");
      formDataToSend.append("id", formData.id.toString());
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error("Ошибка при удалении записи");
      }
      const result = await response.json();
      console.log("Запись удалена:", result);
      triggerRefresh();
      onClose();
    } catch (error) {
      console.error("Ошибка при удалении записи:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>
          {formData.id ? "Редактировать запись" : "Добавить запись"}
        </DialogTitle>
        <DialogDescription>
          {formData.id
            ? "Измените информацию и сохраните изменения."
            : "Заполните данные для новой записи."}
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
          {["cimg1", "cimg2", "cimg3", "cimg4", "cimg5"].map((field) => (
            <ImageField
              key={field}
              field={field as keyof Celebrity}
              initialImageUrl={
                formData[field as keyof Celebrity]
                  ? `${BASE_IMAGE_URL}/${formData.id}/${formData[field as keyof Celebrity]}`
                  : null
              }
              onImageChange={handleImageChange}
              onImageDelete={handleImageDelete}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          {formData.id ? (
            <>
              <Button variant="outline" onClick={handleDuplicate}>
                Сделать дубль
              </Button>
              <Button onClick={handleSubmit}>Редактировать</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Удалить
              </Button>
            </>
          ) : (
            <Button onClick={handleSubmit}>Создать</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
