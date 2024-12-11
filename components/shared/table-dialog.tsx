import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { ImageCompTableDialog } from "./image-comp-table-dialog";
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
    cimg1: "",
    cimg2: "",
    cimg3: "",
    cimg4: "",
    cimg5: "",
  });

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

  const handleSubmit = async () => {
    if (!formData.id) {
      console.error("ID не задан");
      return;
    }
    await saveCelebrity(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formData.id ? "Редактировать запись" : "Добавить запись"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Гео" value={formData.geo} onChange={(e) => handleInputChange("geo", e.target.value)} />
          <Input placeholder="Имя" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
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
          {/* Добавляем загрузчики изображений */}
          {["cimg1", "cimg2", "cimg3", "cimg4", "cimg5"].map((field) => (
            <ImageUploader key={field} field={field as keyof Celebrity} formData={formData} setFormData={setFormData} />
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
