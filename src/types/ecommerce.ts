import { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
  };
}

export interface Review {
  id?: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  id?: string;
  name: string;
  description: string;
  image?: string;
}
