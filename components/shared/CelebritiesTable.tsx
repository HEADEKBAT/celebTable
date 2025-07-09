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
import OwnerFilter from "./OwnerFilter";
import {  ImagesIcon } from "lucide-react";
import { RefreshButton } from "./RefreshButton";

const URL_IMG = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

const CelebritiesTable = () => {
  const { paginatedCelebrities, loading, page, totalPages, refreshTrigger, setPage, fetchCelebrities } =
    useCelebritiesStore();

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
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCelebrity(null);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="flex justify-between flex-col pb-4">
        <div className="mb-4 flex justify-between gap-4">
          <SearchInput />
          <Button onClick={handleNewRecord}>Добавить новую запись</Button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <OwnerFilter />
          <RefreshButton />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableHeaderComponent
            columns={[
              { key: "id", label: "ID" },
              { key: "geo", label: "Гео" },
              { key: "img", label: "Изображение" },
              { key: "name", label: "Имя" },
              { key: "category", label: "Категория" },
              { key: "subject", label: "Субъект" },
              // { key: "about", label: "Инфа" },
              { key: "owner", label: "Пользователь" },
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
              <TableCell>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {celebrity.cimg1 === null || celebrity.cimg1 === "" ? (
                  // <div className="w70 h70 bg-black"></div>
                 <ImagesIcon size={70} color="#4c81c8"/>
                ) : (
                  <img
                    src={`${URL_IMG + "/"}${celebrity.id + "/"}${celebrity.cimg1}`}
                    alt="Image"
                    width={70}
                    height={70}
                    className="rounded-xl"
                  />
                )}
              </TableCell>
              <TableCell>{celebrity.name}</TableCell>
              <TableCell>{celebrity.category}</TableCell>
              <TableCell>{celebrity.subject}</TableCell>
              {/* <TableCell>{celebrity.about}</TableCell> */}
              <TableCell>{celebrity.owner || "Неизвестно"}</TableCell>
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
