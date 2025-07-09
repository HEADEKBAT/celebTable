"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Celebrity } from "../../interfaces/types";
import { useCelebritiesStore } from "@/lib/store";
import { ImageField } from "./image-field";
import { useAuthStore } from "@/lib/auth-store";
import clsx from "clsx";

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

  const initialState: Celebrity = {
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
    cimg6: "",
    cimg7: "",
    cimg8: "",
    cimg9: "",
    cimg10: "",
  };

  const [formData, setFormData] = useState<Celebrity>(initialState);
  const [localImages, setLocalImages] = useState<Partial<Record<keyof Celebrity, File | null>>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFormData(celebrity ?? initialState);
  }, [celebrity]);

  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({ ...prev, owner: authUser.name }));
    }
  }, [authUser]);

  const handleInputChange = (field: keyof Celebrity, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
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

  const allFields = Array.from({ length: 10 }, (_, i) => `cimg${i + 1}` as keyof Celebrity);
  const visibleImageFields = (() => {
    const usedFields = allFields.filter((key) => formData[key]);
    const baseLength = Math.max(3, usedFields.length + 1);
    return allFields.slice(0, Math.min(baseLength, 10));
  })();

 const validate = () => {
  const requiredFields: (keyof Celebrity)[] = ["geo", "name", "category", "subject"];
  const newErrors: Record<string, boolean> = {};
  let isValid = true;

  requiredFields.forEach((field) => {
    const value = formData[field];
    if (!value || String(value).trim() === "") {
      newErrors[field] = true;
      isValid = false;
    }
  });

  setErrors(newErrors);
  return isValid;
};


  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
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
      if (!response.ok) throw new Error("Ошибка при сохранении данных");

      await response.json();
      triggerRefresh();
      onClose();
    } catch (error) {
      console.error("Ошибка при сохранении записи:", error);
    }
  };

  const handleDuplicate = async () => {
    try {
      if (!formData.id) throw new Error("Нет записи для дублирования");
      const originalId = formData.id;
      const duplicateData = { ...formData };
      delete duplicateData.id;
      if (authUser) {
        duplicateData.owner = authUser.name;
      }
      const formDataToSend = new FormData();
      formDataToSend.append("action", "duplicate");
      formDataToSend.append("id", originalId.toString());
      Object.entries(duplicateData).forEach(([key, value]) => {
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
      if (!response.ok) throw new Error("Ошибка при создании дублированной записи");
      await response.json();
      triggerRefresh();
      onClose();
    } catch (error) {
      console.error("Ошибка при создании дублированной записи:", error);
    }
  };

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
      if (!response.ok) throw new Error("Ошибка при удалении записи");
      await response.json();
      triggerRefresh();
      onClose();
    } catch (error) {
      console.error("Ошибка при удалении записи:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogTitle>{formData.id ? "Редактировать запись" : "Добавить запись"}</DialogTitle>
        <DialogDescription>
          {formData.id ? "Измените информацию и сохраните изменения." : "Заполните данные для новой записи."}
        </DialogDescription>
        <div className="space-y-4">
          <Input
            required
            placeholder="Гео"
            value={formData.geo}
            onChange={(e) => handleInputChange("geo", e.target.value)}
            className={clsx({ "border-red-500": errors.geo })}
          />
          <Input
            required
            placeholder="Имя"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={clsx({ "border-red-500": errors.name })}
          />
          <Input
            required
            placeholder="Категория"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className={clsx({ "border-red-500": errors.category })}
          />
          <Input
            required
            placeholder="Субъект"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            className={clsx({ "border-red-500": errors.subject })}
          />
          <Textarea            
            placeholder="Описание"
            value={formData.about}
            onChange={(e) => handleInputChange("about", e.target.value)}
            className={clsx({ "border-red-500": errors.about })}
          />
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(128px,_1fr))] gap-4">
            {visibleImageFields.map((field) => (
              <ImageField
                key={field}
                field={field}
                initialImageUrl={formData[field] ? `${BASE_IMAGE_URL}/${formData.id}/${formData[field]}` : null}
                onImageChange={handleImageChange}
                onImageDelete={handleImageDelete}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Отмена</Button>
          {formData.id ? (
            <>
              <Button variant="outline" onClick={handleDuplicate}>Сделать дубль</Button>
              <Button onClick={handleSubmit}>Редактировать</Button>
              <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
            </>
          ) : (
            <Button onClick={handleSubmit}>Создать</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
