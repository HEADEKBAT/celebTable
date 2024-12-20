import { create } from "zustand";
import { Celebrity } from "../interfaces/types";

interface CelebritiesState {
  celebrities: Celebrity[]; // Все записи
  paginatedCelebrities: Celebrity[]; // Записи для текущей страницы
  loading: boolean;
  filter: string; // Строка поиска
  sortBy: string; // Поле для сортировки
  sortOrder: "asc" | "desc"; // Порядок сортировки
  page: number; // Текущая страница
  limit: number; // Количество записей на странице
  totalPages: number; // Общее количество страниц
  setPage: (page: number) => void; // Установить текущую страницу
  setFilter: (filter: string) => void; // Установить фильтр
  setSort: (sortBy: string, sortOrder: "asc" | "desc") => void; // Установить сортировку
  setLoading: (loading: boolean) => void; // Установить состояние загрузки
  fetchCelebrities: () => Promise<void>; // Загрузить записи
  saveCelebrity: (celebrity: Celebrity) => Promise<void>; // Сохранить запись
  saveNewCelebrity: (userName: string) => Promise<Celebrity>; // Создать новую запись
  applyFilterAndPagination: () => void; // Применить фильтрацию и пагинацию
}

export const useCelebritiesStore = create<CelebritiesState>((set, get) => ({
  celebrities: [],
  paginatedCelebrities: [],
  loading: false,
  filter: "",
  sortBy: "id",
  sortOrder: "asc",
  page: 1,
  limit: 30,
  totalPages: 1,

  setPage: (page) => {
    set({ page });
    get().applyFilterAndPagination();
  },

  setFilter: (filter) => {
    set({ filter, page: 1 });
    get().applyFilterAndPagination();
  },

  setSort: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder });
    get().applyFilterAndPagination();
  },

  setLoading: (loading) => set({ loading }),

  fetchCelebrities: async () => {
    set({ loading: true });
    try {
      const response = await fetch("https://5.23.55.200/files/api/api.php", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Ошибка при получении данных");
      }

      const data = await response.json();
      set({ celebrities: data });
      get().applyFilterAndPagination();
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    } finally {
      set({ loading: false });
    }
  },

  saveCelebrity: async (celebrity: Celebrity) => {
    set({ loading: true });
    try {
      const response = await fetch("https://5.23.55.200/files/api/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(celebrity),
      });

      if (!response.ok) {
        throw new Error("Ошибка при сохранении данных");
      }

      await get().fetchCelebrities();
    } catch (error) {
      console.error("Ошибка при сохранении записи:", error);
    } finally {
      set({ loading: false });
    }
  },

  saveNewCelebrity: async (userName: string) => {
    set({ loading: true });
    try {
      const response = await fetch("https://5.23.55.200/files/api/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          geo: "",
          name: "",
          category: "",
          subject: "",
          about: "",
          userName: userName, // Передаем имя пользователя
          cimg1: null,
          cimg2: null,
          cimg3: null,
          cimg4: null,
          cimg5: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании записи");
      }

      const newCelebrity = await response.json();
      await get().fetchCelebrities(); // Обновляем данные
      return newCelebrity;
    } catch (error) {
      console.error("Ошибка при создании записи:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  applyFilterAndPagination: () => {
    const { celebrities, filter, sortBy, sortOrder, page, limit } = get();

    const lowerCaseFilter = filter.toLowerCase();
    const filtered = celebrities.filter((celeb) => {
      const matchesText =
        celeb.geo.toLowerCase().includes(lowerCaseFilter) ||
        celeb.name.toLowerCase().includes(lowerCaseFilter) ||
        celeb.category.toLowerCase().includes(lowerCaseFilter) ||
        celeb.subject.toLowerCase().includes(lowerCaseFilter);

      const matchesId =
        !isNaN(Number(filter)) &&
        celeb.id != null &&
        celeb.id.toString().includes(filter);

      return matchesText || matchesId;
    });

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

    const totalPages = Math.ceil(sorted.length / limit);
    const startIndex = (page - 1) * limit;
    const paginated = sorted.slice(startIndex, startIndex + limit);

    set({ paginatedCelebrities: paginated, totalPages });
  },
}));
