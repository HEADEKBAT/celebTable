"use client";
import { TableRow, TableHead } from "@/components/ui/table";
// import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useCelebritiesStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const TableHeaderComponent = ({ columns }: { columns: { key: string; label: string }[] }) => {
  const { sortBy, sortOrder, setSort } = useCelebritiesStore();

  const handleSortChange = (key: string) => {
    const newSortOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    setSort(key, newSortOrder);
  };

  // Добавляем функцию для формирования класса по ключу колонки
  const getSortClassName = (key: string) => {
    return cn(
      "flex justify-end w-full items-center flex-row-reverse p-2 transition-all duration-300 ease-in",
      {
        // Если сортировка по возрастанию для данного столбца
        " bg-gradient-to-b from-gray-100 via-gray-100 border-b-2 border-blue-800  to-blue-800/50": sortBy === key && sortOrder === "asc",
        // Если сортировка по убыванию для данного столбца
        " bg-gradient-to-t from-gray-100 via-gray-100 to-blue-800/50 border-t-2 border-blue-600": sortBy === key && sortOrder === "desc",
        // Если столбец не выбран для сортировки, используем базовый фон
        "bg-gray-100": sortBy !== key,
      }
    );
  };

  return (
    <TableRow className="bg-gray-100">
      {columns.map((column) => (
        <TableHead key={column.key} onClick={() => handleSortChange(column.key)} className="p-0">
          <div className={getSortClassName(column.key)}>
            <span className="font-medium">{column.label}</span>{" "}
            {/* {sortBy === column.key && (sortOrder === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />)} */}
          </div>
        </TableHead>
      ))}
    </TableRow>
  );
};
