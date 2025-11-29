import type { Product, CartItem } from '@/lib/types';

const CART_KEY = 'png_sme_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];

  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  // Dispatch custom event for cart updates
  window.dispatchEvent(new Event('cart-updated'));
}

export function addToCart(product: Partial<Product>, quantity: number = 1): void {
  const cart = getCart();

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      product: product as Product,
      quantity,
    });
  }

  saveCart(cart);
}

export function removeFromCart(productId: string): void {
  const cart = getCart();
  const newCart = cart.filter((item) => item.product.id !== productId);
  saveCart(newCart);
}

export function updateCartItemQuantity(productId: string, quantity: number): void {
  const cart = getCart();
  const item = cart.find((item) => item.product.id === productId);

  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartCount(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => {
    return total + (item.product.price || 0) * item.quantity;
  }, 0);
}
