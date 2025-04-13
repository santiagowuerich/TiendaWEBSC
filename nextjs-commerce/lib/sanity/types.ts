export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface ProductOption {
  name: string;
  value: string;
}

export interface SanityProduct {
  _id: string;
  _type: 'product';
  name: string;
  slug: {
    current: string;
  };
  price: number;
  stock: number;
  description?: string;
  category: {
    _ref: string;
    _type: 'reference';
  };
  image: {
    asset: {
      _ref: string;
      _type: 'reference';
    };
    hotspot?: {
      x: number;
      y: number;
    };
  };
  variants?: ProductVariant[];
  options?: ProductOption[];
  availableForSale: boolean;
}

export interface SanityCategory {
  _id: string;
  _type: 'category';
  title: string;
  slug: {
    current: string;
  };
  description?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: SanityProduct;
  variant?: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

export interface Menu {
  title: string;
  path: string;
} 