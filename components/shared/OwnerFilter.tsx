"use client";

import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCelebritiesStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";

export default function OwnerFilter() {
  const distinctOwners = useCelebritiesStore((state) => state.uniqueOwners);
  const ownerFilter = useCelebritiesStore((state) => state.ownerFilter);
  const ownerFilterMode = useCelebritiesStore((state) => state.ownerFilterMode);
  const setOwnerFilter = useCelebritiesStore((state) => state.setOwnerFilter);
  const setOwnerFilterMode = useCelebritiesStore((state) => state.setOwnerFilterMode);
  const authUser = useAuthStore((state) => state.user);

  const handleModeChange = useCallback(
    (value: string) => {
      setOwnerFilterMode(value as "own" | "all");
    },
    [setOwnerFilterMode]
  );

  const handleOwnerChange = useCallback(
    (value: string) => {
      setOwnerFilter(value);
    },
    [setOwnerFilter]
  );

  const handleClear = useCallback(() => {
    setOwnerFilter(""); // Очистка фильтра по owner
  }, [setOwnerFilter]);

  if (!authUser) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* Режим фильтрации: свои / все */}
      <Select value={ownerFilterMode} onValueChange={handleModeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="own">Только мои</SelectItem>
          <SelectItem value="all">Все доступные</SelectItem>
        </SelectContent>
      </Select>

      {/* Дополнительный фильтр по owner */}
      {ownerFilterMode === "all" && distinctOwners.length > 0 && (
        <div className="flex items-center gap-2">
          <Select value={ownerFilter} onValueChange={handleOwnerChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Фильтр по владельцу" />
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
              ✕
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
