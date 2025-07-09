import { create } from "zustand";
import { Celebrity } from "../interfaces/types";
import { useAuthStore } from "./auth-store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type OwnerFilterMode = "own" | "all";

export interface CelebritiesState {
  celebrities: Celebrity[];
  paginatedCelebrities: Celebrity[];
  distinctOwners: string[];
  loading: boolean;
  refreshTrigger: number;
  filter: string;
  ownerFilter: string;
  ownerFilterMode: OwnerFilterMode;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
  totalPages: number;
  triggerRefresh: () => void;
  setPage: (page: number) => void;
  setFilter: (filter: string) => void;
  setOwnerFilter: (owner: string) => void;
  setOwnerFilterMode: (mode: OwnerFilterMode) => void;
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
  ownerFilterMode: "own",
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

  setOwnerFilterMode: (mode) => {
    set({ ownerFilterMode: mode, page: 1 });
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
      ownerFilterMode,
    } = get();

    const authUser = useAuthStore.getState().user;
    let accessible: Celebrity[] = [];

    if (!authUser) {
      accessible = celebrities.filter((c) => {
        const ownerVal = c.owner?.toLowerCase().trim() || "";
        return ownerVal === "" || ownerVal === "#n/a";
      });
    } else if (authUser.role === "admin") {
      if (ownerFilterMode === "own") {
        accessible = celebrities.filter((c) =>
          (c.owner?.toLowerCase().trim() || "") === authUser.name.toLowerCase().trim()
        );
      } else {
        accessible = [...celebrities];
      }
    } else if (authUser.role === "teamUser") {
      if (ownerFilterMode === "own") {
        accessible = celebrities.filter((c) =>
          (c.owner?.toLowerCase().trim() || "") === authUser.name.toLowerCase().trim()
        );
      } else {
        accessible = celebrities.filter((c) => {
          const ownerVal = c.owner?.toLowerCase().trim() || "";
          return ownerVal === "" || ownerVal === "#n/a";
        });
      }
    }

    const distinctOwners = Array.from(
      new Set(
        accessible
          .map((c) => c.owner?.trim() || "")
          .filter((o) => o && o.toLowerCase() !== "#n/a")
      )
    );
    set({ distinctOwners });

    if (ownerFilter.trim() !== "") {
      const lowerOwner = ownerFilter.toLowerCase().trim();
      accessible = accessible.filter((c) => {
        const ownerVal = c.owner?.toLowerCase().trim() || "";
        return ownerVal === lowerOwner;
      });
    }

    const lowerCaseFilter = filter.toLowerCase();
    const filtered = accessible.filter((c) => {
      const matchesText =
        c.geo.toLowerCase().includes(lowerCaseFilter) ||
        c.name.toLowerCase().includes(lowerCaseFilter) ||
        c.category.toLowerCase().includes(lowerCaseFilter) ||
        c.subject.toLowerCase().includes(lowerCaseFilter);
      const matchesId = !isNaN(Number(filter)) && c.id?.toString().includes(filter);
      return matchesText || matchesId;
    });

    const sorted = filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof Celebrity];
      const bValue = b[sortBy as keyof Celebrity];
      if (sortBy === "id") {
        return sortOrder === "asc"
          ? Number(a.id) - Number(b.id)
          : Number(b.id) - Number(a.id);
      }
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });

    const totalPages = Math.ceil(sorted.length / limit);
    const startIndex = (page - 1) * limit;
    const paginated = sorted.slice(startIndex, startIndex + limit);
    set({ paginatedCelebrities: paginated, totalPages });
  },
}));
