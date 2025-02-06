"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_DATABASE_URL;

// Интерфейс пользователя
interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

// Тип для хранения данных редактирования
interface EditData {
  name: string;
  role: string;
}

const roles = ["newUser", "teamUser", "admin", "noUser"];

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  // Храним данные редактирования для каждой строки по id
  const [editRows, setEditRows] = useState<Record<number, EditData>>({});
  // Состояние для выбранного пользователя для удаления
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  // Флаг для управления видимостью диалога удаления
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${AUTH_URL}`, { method: "GET" });
        if (!res.ok) {
          throw new Error("Ошибка загрузки данных");
        }
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Неизвестная ошибка");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Режим редактирования для конкретной строки
  const handleEditClick = (user: User) => {
    setEditRows((prev) => ({
      ...prev,
      [user.id]: { name: user.name, role: user.role },
    }));
  };

  // Отмена редактирования
  const handleCancelClick = (userId: number) => {
    setEditRows((prev) => {
      const newState = { ...prev };
      delete newState[userId];
      return newState;
    });
  };

  // Обработчик изменения имени
  const handleNameChange = (userId: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditRows((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], name: value },
    }));
  };

  // Обработчик изменения роли
  const handleRoleChange = (userId: number, value: string) => {
    setEditRows((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], role: value },
    }));
  };

  // Сохранение изменений: отправляем обновлённые данные в API и обновляем локальное состояние
  const handleSaveClick = async (user: User) => {
    const editedData = editRows[user.id];
    if (!editedData) return;
    try {
      const res = await fetch(`${AUTH_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: editedData.name,
          role: editedData.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка обновления данных");
      }
      // Обновляем состояние пользователей
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, name: editedData.name, role: editedData.role } : u
        )
      );
      // Выходим из режима редактирования
      handleCancelClick(user.id);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Ошибка обновления данных");
    }
  };

  // Обработчик удаления записи
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  // Подтверждение удаления: отправляем запрос к API и обновляем состояние
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`${AUTH_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: userToDelete.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка удаления записи");
      }
      // Удаляем пользователя из локального состояния
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
      setOpenDeleteDialog(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Ошибка удаления записи");
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Список пользователей</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Created At</th>
            <th className="border border-gray-300 p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isEditing = Boolean(editRows[user.id]);
            const editData = editRows[user.id];
            return (
              <tr key={user.id}>
                <td className="border border-gray-300 p-2">{user.id}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">
                  {isEditing ? (
                    <Input
                      value={editData?.name || ""}
                      onChange={(e) => handleNameChange(user.id, e)}
                      className="w-full"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {isEditing ? (
                    <Select
                      value={editData?.role || user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((roleOption) => (
                          <SelectItem key={roleOption} value={roleOption}>
                            {roleOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="border border-gray-300 p-2">{user.createdAt}</td>
                <td className="border border-gray-300 p-2">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button variant="default" onClick={() => handleSaveClick(user)}>
                        Сохранить
                      </Button>
                      <Button variant="destructive" onClick={() => handleCancelClick(user.id)}>
                        Отмена
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => handleEditClick(user)}>
                        Редактировать
                      </Button>
                      <AlertDialog open={openDeleteDialog && userToDelete?.id === user.id}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" onClick={() => handleDeleteClick(user)}>
                            Удалить
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы действительно хотите удалить запись пользователя с email: {user.email}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
                              Отмена
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirmDelete}>
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Если выбран пользователь для удаления, но диалог ещё не открыт (на случай, если нужен глобальный AlertDialog) */}
      {userToDelete && !openDeleteDialog && (
        <AlertDialog open={openDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
              <AlertDialogDescription>
                Вы действительно хотите удалить запись пользователя с email: {userToDelete.email}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
                Отмена
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmDelete}>
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
