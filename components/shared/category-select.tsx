"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clsx from "clsx";

const catrgoryOptions = ["doctor", "celebrity"];

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

export const CategorySelect = ({ value, onChange, hasError }: CategorySelectProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={clsx({ "border-red-500": hasError })}>
        <SelectValue placeholder="Категория" />
      </SelectTrigger>
      <SelectContent>
        {catrgoryOptions.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
