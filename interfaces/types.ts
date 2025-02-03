export interface Celebrity {
    id?: number | null; // Сделайте поле "id" необязательным
    geo: string;
    name: string;
    category: string;
    subject: string;
    about: string;
    userName?: string | null; // Сделайте поле "userName" необязательным
    cimg1?: string | null;
    cimg2?: string | null;
    cimg3?: string | null;
    cimg4?: string | null;
    cimg5?: string | null;
  }