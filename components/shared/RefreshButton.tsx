"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCelebritiesStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function RefreshButton() {
  const fetchCelebrities = useCelebritiesStore((state) => state.fetchCelebrities);
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = async () => {
    setIsRotating(true);
    try {
      await fetchCelebrities();
    } finally {
      setTimeout(() => setIsRotating(false), 1000); // чтобы успела завершиться анимация
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="icon"
      className="relative"
      title="Обновить данные"
    >
      <RefreshCw
        className={cn(
          "h-5 w-5 transition-transform duration-700",
          isRotating && "animate-spin"
        )}
      />
    </Button>
  );
}
