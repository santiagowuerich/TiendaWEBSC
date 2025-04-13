'use client';

import { createContext, useContext, useMemo, useReducer } from 'react';
// Eliminar o comentar la importación de tipos de Shopify si no se usan
// import type { Cart, CartItem } from 'lib/shopify/types'; 

// Definir tipos básicos si no se usa Shopify
type CartItem = { id: string; quantity: number; cost: { totalAmount: { amount: string; currencyCode: string } }; merchandise: any };
type Cart = { id: string; checkoutUrl: string; totalQuantity: number; lines: CartItem[]; cost: { subtotalAmount: { amount: string; currencyCode: string }; totalAmount: { amount: string; currencyCode: string }; totalTaxAmount: { amount: string; currencyCode: string } } };

// Tipos de acciones (pueden variar)
type CartAction =
  | { type: 'UPDATE_ITEM'; payload: { merchandiseId: string; updateType: 'plus' | 'minus' | 'delete' } }
  | { type: 'ADD_ITEM'; payload: { variant: any; product: any } }; // Simplificado con any

// Tipo del contexto
type CartContextType = {
  cart: Cart;
  updateCartItem: (merchandiseId: string, updateType: 'plus' | 'minus' | 'delete') => void;
  addCartItem: (variant: any, product: any) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Estado inicial del carrito (vacío)
function createEmptyCart(): Cart {
  return {
    id: '',
    checkoutUrl: '', 
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: '0', currencyCode: 'ARS' }, // Asegurar ARS
      totalAmount: { amount: '0', currencyCode: 'ARS' },    // Asegurar ARS
      totalTaxAmount: { amount: '0', currencyCode: 'ARS' } // Asegurar ARS
    }
  };
}

// Reducer simplificado (la lógica real puede ser más compleja)
function cartReducer(state: Cart, action: CartAction): Cart {
  console.log('Cart action:', action.type, action.payload);
  // Aquí iría la lógica real para añadir/actualizar items
  // Ejemplo básico para añadir (sin comprobar duplicados, etc.):
  if (action.type === 'ADD_ITEM') {
    const newItem = {
      id: action.payload.variant.id, // Asume que variant tiene id
      quantity: 1,
      cost: { totalAmount: { amount: action.payload.variant.price, currencyCode: 'ARS' } }, // Asume variant tiene price
      merchandise: action.payload.variant
    };
    return {
      ...state,
      lines: [...state.lines, newItem],
      totalQuantity: state.totalQuantity + 1
      // Actualizar costs requeriría más lógica
    };
  }
  return state; // Devuelve el estado sin modificar para otras acciones por ahora
}

// Componente proveedor del carrito
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, createEmptyCart());

  const updateCartItem = (merchandiseId: string, updateType: 'plus' | 'minus' | 'delete') => {
    dispatch({ type: 'UPDATE_ITEM', payload: { merchandiseId, updateType } });
  };

  const addCartItem = (variant: any, product: any) => {
    dispatch({ type: 'ADD_ITEM', payload: { variant, product } });
  };

  const value = useMemo(() => ({
    cart,
    updateCartItem,
    addCartItem
  }), [cart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook para acceder al contexto del carrito
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
