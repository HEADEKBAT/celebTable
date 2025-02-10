export interface Celebrity {
    id?: number | null; // Сделайте поле "id" необязательным
    geo: string;
    name: string;
    category: string;
    subject: string;
    about: string;
    owner?: string | null; // Сделайте поле "owner" необязательным
    cimg1?: string | null;
    cimg2?: string | null;
    cimg3?: string | null;
    cimg4?: string | null;
    cimg5?: string | null;
    access?:  string | null | [];
  }