"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface OwnerSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export const OwnerSelect = ({ value, onChange, options }: OwnerSelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Label>Владелец</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите владельца" />
        </SelectTrigger>
        <SelectContent>
          {options.map((owner) => (
            <SelectItem key={owner} value={owner}>
              {owner}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
