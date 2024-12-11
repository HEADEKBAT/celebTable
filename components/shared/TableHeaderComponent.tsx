"use client";
import {  TableRow, TableHead } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useCelebritiesStore } from "@/lib/store";

export const TableHeaderComponent = ({ columns }: { columns: { key: string; label: string }[] }) => {
  const { sortBy, sortOrder, setSort } = useCelebritiesStore();

  const handleSortChange = (key: string) => {
    const newSortOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    setSort(key, newSortOrder);
  };

  return (

      <TableRow>
        {columns.map((column) => (
          <TableHead key={column.key} onClick={() => handleSortChange(column.key)}>
            <div className="flex justify-center items-center flex-row-reverse">
              <span>{column.label}</span>{" "}
              {sortBy === column.key && (sortOrder === "asc" ? <ArrowUpIcon /> : <ArrowDownIcon />)}
            </div>
          </TableHead>
        ))}
      </TableRow>
   
  );
};
