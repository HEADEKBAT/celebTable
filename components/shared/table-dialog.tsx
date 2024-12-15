import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { useCelebritiesStore } from "@/lib/store";
import { Celebrity } from "../../interfaces/types";
import { ImageUploader } from "./image-uploader";

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  celebrity?: Celebrity | null;
}

export const TableDialog = ({ isOpen, onClose, celebrity }: TableDialogProps) => {
  const { saveCelebrity } = useCelebritiesStore();
  const [formData, setFormData] = useState<Celebrity>({
    id: undefined,
    geo: "",
    name: "",
    category: "",
    subject: "",
    about: "",
    cimg1: null,
    cimg2: null,
    cimg3: null,
    cimg4: null,
    cimg5: null,
  });

  useEffect(() => {
    // Устанавливаем данные формы из выбранной записи или сбрасываем для новой
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
        cimg1: null,
        cimg2: null,
        cimg3: null,
        cimg4: null,
        cimg5: null,
      });
    }
  }, [celebrity]);

  const handleInputChange = (field: keyof Celebrity, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await saveCelebrity(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formData.id ? "Редактировать запись" : "Добавить запись"}</DialogTitle>
          <DialogDescription>
            {formData.id ? "Измените информацию и сохраните изменения." : "Заполните данные для новой записи."}
          </DialogDescription>
        </DialogHeader>
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
            <ImageUploader
              key={field}
              field={field as keyof Celebrity}
              formData={formData}
              setFormData={setFormData}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit}>
            {formData.id ? "Сохранить изменения" : "Создать запись"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
