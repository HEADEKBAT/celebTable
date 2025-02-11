"use client";

import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCelebritiesStore } from "@/lib/store";

export default function OwnerFilter() {
  // Подписываемся отдельно на каждое поле
  const distinctOwners = useCelebritiesStore((state) => state.distinctOwners);
  const ownerFilter = useCelebritiesStore((state) => state.ownerFilter);
  const setOwnerFilter = useCelebritiesStore((state) => state.setOwnerFilter);

  // Обработчик выбора нового значения
  const handleSelectChange = useCallback((value: string) => {
    setOwnerFilter(value);
  }, [setOwnerFilter]);

  // Обработчик сброса фильтра
  const handleClear = useCallback(() => {
    setOwnerFilter("");
  }, [setOwnerFilter]);

  return (
    <div className="flex items-center gap-2">
      <Select value={ownerFilter} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Пользователь" />
        </SelectTrigger>
        <SelectContent>
          {distinctOwners.map((owner) => (
            <SelectItem key={owner} value={owner}>
              {owner}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {ownerFilter && (
        <Button variant="outline" onClick={handleClear}>
          Отмена
        </Button>
      )}
    </div>
  );
}
