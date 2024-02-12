import { FormControl } from "@angular/forms";

export interface ProductInterface {
  id?: number;
  title?: string;
  price?: number;
  description?: string;
  images?: string[];
  creationAt?: string;
  updatedAt?: string;
  category?: CategoryInterface;
}

export interface CategoryInterface {
  id: number;
  name: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export interface ProductForm extends ProductInterface {
  categoryId: number;
}
