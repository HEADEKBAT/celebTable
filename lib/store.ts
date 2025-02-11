import { create } from "zustand";
import { Celebrity } from "../interfaces/types";
import { useAuthStore } from "./auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CelebritiesState {
  celebrities: Celebrity[];              // Все записи из API
  paginatedCelebrities: Celebrity[];       // Записи для текущей страницы (после всех фильтраций)
  distinctOwners: string[];                // Уникальные значения поля owner (из доступных записей)
  loading: boolean;
  refreshTrigger: number;                  // Состояние для отслеживания обновлений
  filter: string;                          // Текстовый фильтр (по geo, name, category, subject, id)
  ownerFilter: string;                     // Фильтр по полю owner (выбирается из выпадающего списка)
  sortBy: string;                          // Поле сортировки
  sortOrder: "asc" | "desc";               // Порядок сортировки
  page: number;                            // Текущая страница
  limit: number;                           // Количество записей на странице
  totalPages: number;                      // Общее количество страниц
  triggerRefresh: () => void;
  setPage: (page: number) => void;
  setFilter: (filter: string) => void;
  setOwnerFilter: (owner: string) => void;
  setSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  setLoading: (loading: boolean) => void;
  fetchCelebrities: () => Promise<void>;
  applyFilterAndPagination: () => void;
}

export const useCelebritiesStore = create<CelebritiesState>((set, get) => ({
  celebrities: [],
  paginatedCelebrities: [],
  distinctOwners: [],
  loading: false,
  refreshTrigger: 0,
  filter: "",
  ownerFilter: "",
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

  setOwnerFilter: (owner) => {
    set({ ownerFilter: owner, page: 1 });
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
      const response = await fetch(`${API_URL}`, {
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

  triggerRefresh: () => {
    set((state) => ({ refreshTrigger: state.refreshTrigger + 1 }));
  },

  applyFilterAndPagination: () => {
    const {
      celebrities,
      filter,
      ownerFilter,
      sortBy,
      sortOrder,
      page,
      limit,
    } = get();

    // Шаг 1. Первичная фильтрация по доступности (по полю owner)
    // Если пользователь не авторизован, остаются записи, где owner пустой или равен "#n/a".
    // Если пользователь авторизован, доступны записи, где owner пустой/#n/a или совпадает с authUser.name.
    const authUser = useAuthStore.getState().user;
    let accessible = celebrities.filter((celeb) => {
      const ownerVal = celeb.owner ? celeb.owner.toLowerCase().trim() : "";
      if (!authUser) {
        return ownerVal === "" || ownerVal === "#n/a";
      } else {
        return ownerVal === "" ||
               ownerVal === "#n/a" ||
               ownerVal === authUser.name.toLowerCase().trim();
      }
    });

    // Шаг 2. Вычисляем уникальные значения owner из доступных записей
    const computedDistinctOwners = Array.from(
      new Set(
        accessible
          .map((celeb) => {
            return typeof celeb.owner === "string" ? celeb.owner.trim() : "";
          })
          .filter((o) => o !== "" && o.toLowerCase() !== "#n/a")
      )
    );
    // Обновляем distinctOwners в состоянии
    set({ distinctOwners: computedDistinctOwners });

    // Шаг 3. Если установлен дополнительный фильтр по owner, оставляем записи,
    // у которых значение поля owner (в нижнем регистре) совпадает с ownerFilter.
    if (ownerFilter.trim() !== "") {
      const lowerOwnerFilter = ownerFilter.toLowerCase().trim();
      accessible = accessible.filter((celeb) => {
        const ownerVal = celeb.owner ? celeb.owner.toLowerCase().trim() : "";
        return ownerVal === lowerOwnerFilter;
      });
    }

    // Шаг 4. Применяем текстовый фильтр по полям: geo, name, category, subject, id.
    const lowerCaseFilter = filter.toLowerCase();
    const filtered = accessible.filter((celeb) => {
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

    // Шаг 5. Сортировка
    const sorted = filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Celebrity];
      const bValue = b[sortBy as keyof Celebrity];
      if (sortBy === "id") {
        const idA = Number(a.id) || 0;
        const idB = Number(b.id) || 0;
        return sortOrder === "asc" ? idA - idB : idB - idA;
      }
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

    // Шаг 6. Пагинация
    const totalPages = Math.ceil(sorted.length / limit);
    const startIndex = (page - 1) * limit;
    const paginated = sorted.slice(startIndex, startIndex + limit);
    set({ paginatedCelebrities: paginated, totalPages });
  },
}));
