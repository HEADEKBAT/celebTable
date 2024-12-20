export interface Celebrity {
    id?: number | null; // Сделайте поле "id" необязательным
    geo: string;
    name: string;
    category: string;
    subject: string;
    about: string;
    userName?: string | null; // Сделайте поле "userName" необязательным
    cimg1?: string;
    cimg2?: string;
    cimg3?: string;
    cimg4?: string;
    cimg5?: string;
  }