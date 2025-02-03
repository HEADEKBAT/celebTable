"use client";

import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loading } from "./loading";
import { TableDialog } from "./table-dialog";
import { useCelebritiesStore } from "@/lib/store";
import SearchInput from "./search-input";
import { Celebrity } from "@/interfaces/types";
import { TableHeaderComponent } from "./TableHeaderComponent";

const CelebritiesTable = () => {
  const {
    paginatedCelebrities,
    loading,
    page,
    totalPages,
    refreshTrigger,
    setPage,
    fetchCelebrities,

  } = useCelebritiesStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);

  useEffect(() => {
    fetchCelebrities();
  }, [refreshTrigger]);

  const handleRowClick = (celebrity: Celebrity) => {
    setSelectedCelebrity(celebrity);
    setDialogOpen(true);
  };

  const handleNewRecord = async () => {
    try {
      // const newCelebrity = await saveNewCelebrity("");
      // setSelectedCelebrity(newCelebrity);
      setDialogOpen(true);
    } catch (error) {
      console.error("Ошибка при создании новой записи:", error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCelebrity(null);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="mb-4 flex justify-between">
        <SearchInput />
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
              { key: "userName", label: "Пользователь" },
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
              <TableCell>{celebrity.userName || "Неизвестно"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between items-center">
        <Button onClick={() => setPage(1)} disabled={page === 1}>
          Первая
        </Button>
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Назад
        </Button>
        <span>
          Страница {page} из {totalPages}
        </span>
        <Button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Вперёд
        </Button>
        <Button onClick={() => setPage(totalPages)} disabled={page === totalPages}>
          Последняя
        </Button>
      </div>
      <TableDialog isOpen={dialogOpen} onClose={handleDialogClose} celebrity={selectedCelebrity} />
    </>
  );
};

export default CelebritiesTable;
