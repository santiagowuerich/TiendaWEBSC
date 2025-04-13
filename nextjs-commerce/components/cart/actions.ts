'use server';

import { TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Versiones simplificadas de las funciones del carrito para Sanity/WhatsApp
// En lugar de usar Shopify, estas funciones solo proporcionan mensajes para indicar
// que la funcionalidad está deshabilitada.

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  console.warn('[Cart Action] addItem: Funcionalidad deshabilitada.');
  return "Funcionalidad deshabilitada.";
}

export async function removeItem(prevState: any, merchandiseId: string) {
  console.warn('[Cart Action] removeItem: Funcionalidad deshabilitada.');
  return "Funcionalidad deshabilitada.";
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  console.warn('[Cart Action] updateItemQuantity: Funcionalidad deshabilitada.');
  return "Funcionalidad deshabilitada.";
}

export async function redirectToCheckout() {
  console.warn('[Cart Action] redirectToCheckout: Funcionalidad deshabilitada.');
  // Aquí eventualmente podríamos implementar el redireccionamiento a WhatsApp
}

export async function createCartAndSetCookie() {
  console.warn('[Cart Action] createCartAndSetCookie: Funcionalidad deshabilitada.');
  // No necesitamos crear un carrito para la funcionalidad de WhatsApp
} 