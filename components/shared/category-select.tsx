"use client";

import clsx from "clsx";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}

const categoryOptions = ["doctor", "celebrity"];

export const CategorySelect = ({ value, onChange, hasError }: CategorySelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        "w-full border rounded px-3 py-2",
        hasError && "border-red-500"
      )}
    >
      <option value="" disabled>
        Категория
      </option>
      {categoryOptions.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};
