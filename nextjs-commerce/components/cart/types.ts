// Define un tipo simplificado para CartItem

export type SanityProduct = {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  image: any;
  description?: string;
};

// Tipo de artículo de carrito mínimo que satisface lo que necesitan los componentes
export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: {
      amount: string | number;
      currencyCode: string;
    }
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
    product: {
      title: string;
      handle: string;
      featuredImage: {
        url: string;
        altText: string;
      }
    }
  }
};

// Tipo de carrito mínimo
export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartItem[];
  cost: {
    totalAmount: {
      amount: string | number;
      currencyCode: string;
    };
    totalTaxAmount: {
      amount: string | number;
      currencyCode: string;
    };
  };
}; 