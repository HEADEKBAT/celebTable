"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loading } from "./loading";
import { TableDialog } from "./table-dialog";
import { TableHeaderComponent } from "./TableHeaderComponent";

import { useCelebritiesStore } from "@/lib/store";
import SearchInput from "./search-input";

const CelebritiesTable = () => {
  const { filteredCelebrities, loading, page, setPage, fetchCelebrities } = useCelebritiesStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCelebrity, setSelectedCelebrity] = useState(null);

  useEffect(() => {
    fetchCelebrities();
  }, []);

  // Обработчик клика по строке таблицы
  const handleRowClick = (celebrity) => {
    setSelectedCelebrity(celebrity);
    setDialogOpen(true);
  };

  // Обработчик закрытия диалогового окна
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCelebrity(null);
  };

  // Создание новой записи через API
  const handleNewRecord = async () => {
    try {
      const response = await fetch("/api/celebrities/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании новой записи");
      }

      const newCelebrity = await response.json();
      setSelectedCelebrity(newCelebrity); // Устанавливаем новую запись в форме
      setDialogOpen(true); // Открываем диалог
    } catch (error) {
      console.error("Ошибка при создании новой записи:", error);
    }
  };

  const limit = 10;
  const totalPages = Math.ceil(filteredCelebrities.length / limit);
  const paginatedCelebrities = filteredCelebrities.slice(
    (page - 1) * limit,
    page * limit
  );

  if (loading) return <Loading />;

  return (
    <>
      <div className="mb-4 flex justify-between">
        <SearchInput /> {/* Подключаем компонент поиска */}
        <Button onClick={handleNewRecord}>Добавить новую запись</Button>
      </div>
      <Table>
        <TableHeader>
          <TableHeaderComponent
            columns={[
              { key: "id", label: "ID" },
              { key: "geo", label: "Гео" },
              { key: "name", label: "Имя" },
              { key: "category", label: "Категория" },
              { key: "subject", label: "Субъект" },
              { key: "about", label: "Инфа" },
            ]}
          />
        </TableHeader>
        <TableBody>
          {paginatedCelebrities.map((celebrity) => (
            <TableRow
              key={celebrity.id}
              onClick={() => handleRowClick(celebrity)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{celebrity.id}</TableCell>
              <TableCell>{celebrity.geo}</TableCell>
              <TableCell>{celebrity.name}</TableCell>
              <TableCell>{celebrity.category}</TableCell>
              <TableCell>{celebrity.subject}</TableCell>
              <TableCell>{celebrity.about}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between">
        <Button onClick={() => setPage(Math.max(page - 1, 1))} disabled={page === 1}>
          Назад
        </Button>
        <span>
          Страница {page} из {totalPages}
        </span>
        <Button onClick={() => setPage(Math.min(page + 1, totalPages))} disabled={page === totalPages}>
          Вперед
        </Button>
      </div>
      <TableDialog isOpen={dialogOpen} onClose={handleDialogClose} celebrity={selectedCelebrity} />
    </>
  );
};

export default CelebritiesTable;
