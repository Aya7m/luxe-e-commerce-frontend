export interface Product {
  _id: string;

  name: string;
  description: string;

  brand: string;
  category: string;

  price: number;
  rating: number;

  stock: number;

  image: string;

  createdAt: string;
}