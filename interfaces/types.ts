export interface Celebrity {
    id?: number; // Сделайте поле "id" необязательным
    geo: string;
    name: string;
    category: string;
    subject: string;
    about: string;
    cimg1?: string;
    cimg2?: string;
    cimg3?: string;
    cimg4?: string;
    cimg5?: string;
  }