import { create } from "zustand";
import { Celebrity } from "../interfaces/types";

interface CelebritiesState {
  celebrities: Celebrity[]; // Все записи
  filteredCelebrities: Celebrity[]; // Отфильтрованные записи
  total: number; // Общее количество записей
  loading: boolean;
  filter: string; // Строка поиска
  sortBy: string; // Поле для сортировки
  sortOrder: "asc" | "desc"; // Порядок сортировки
  page: number; // Текущая страница
  setPage: (page: number) => void; // Установить страницу
  setFilter: (filter: string) => void; // Установить фильтр
  setSort: (sortBy: string, sortOrder: "asc" | "desc") => void; // Установить сортировку
  setLoading: (loading: boolean) => void; // Установить состояние загрузки

  // API methods
  fetchCelebrities: () => Promise<void>; // Загрузить записи
  saveCelebrity: (celebrity: Celebrity) => Promise<void>; // Сохранить/обновить запись

  // Client-side filtering
  applyFilter: () => void; // Применить фильтр
}

export const useCelebritiesStore = create<CelebritiesState>((set, get) => ({
  celebrities: [],
  filteredCelebrities: [],
  total: 0,
  loading: false,
  filter: "",
  sortBy: "id",
  sortOrder: "asc",
  page: 1,

  setPage: (page) => set({ page }),
  setFilter: (filter) => {
    set({ filter, page: 1 }); // При изменении фильтра сбрасываем на первую страницу
    get().applyFilter(); // Применяем фильтр
  },
  setSort: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder });
    get().applyFilter(); // Применяем сортировку
  },
  setLoading: (loading) => set({ loading }),

  // Fetch celebrities from server
  fetchCelebrities: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/celebrities");
      if (!response.ok) {
        throw new Error("Ошибка при получении данных");
      }
      const { data, total } = await response.json();
      set({ celebrities: data, filteredCelebrities: data, total });
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Save or update celebrity
  saveCelebrity: async (celebrity: Celebrity) => {
    set({ loading: true });
    try {
      const method = celebrity.id ? "PUT" : "POST";
      const response = await fetch("/api/celebrities", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(celebrity),
      });

      if (!response.ok) {
        throw new Error("Ошибка при сохранении данных");
      }

      // После сохранения обновляем данные
      await get().fetchCelebrities();
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
    } finally {
      set({ loading: false });
    }
  },

  // Client-side filtering and sorting
  applyFilter: () => {
    const { celebrities, filter, sortBy, sortOrder } = get();

    // Применяем фильтр
    const lowerCaseFilter = filter.toLowerCase();
    const filtered = celebrities.filter((celeb) => {
      const matchesText =
        celeb.geo.toLowerCase().includes(lowerCaseFilter) ||
        celeb.name.toLowerCase().includes(lowerCaseFilter) ||
        celeb.category.toLowerCase().includes(lowerCaseFilter) ||
        celeb.subject.toLowerCase().includes(lowerCaseFilter);

      // Проверяем частичное совпадение с ID
      const matchesId =
      !isNaN(Number(filter)) &&
      celeb.id != null && // Проверяем, что id не null и не undefined
      celeb.id.toString().includes(filter);

      return matchesText || matchesId;
    });

    // Применяем сортировку
    const sorted = filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Celebrity];
      const bValue = b[sortBy as keyof Celebrity];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    set({ filteredCelebrities: sorted });
  },
}));
