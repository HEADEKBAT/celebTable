import React from "react";
import { Input } from "@/components/ui/input";
import { useCelebritiesStore } from "@/lib/store";

const SearchInput = () => {
  const { setFilter } = useCelebritiesStore();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setFilter(query); // Передаем строку в Zustand Store
  };

  return (
    <Input
      placeholder="Поиск..."
      onChange={handleSearch}
      className="w-full"
    />
  );
};

export default SearchInput;
