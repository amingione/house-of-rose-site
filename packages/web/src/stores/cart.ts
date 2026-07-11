import { atom, computed } from 'nanostores';

/**
 * The cart.
 *
 * Deliberately stores as little as possible: an id, a quantity, and just enough
 * display data to render the drawer without a network call. It does NOT store a
 * price the server will trust — `unitPrice` here is for display only. Every
 * checkout function re-reads the real price from Sanity by `productId`, so a
 * tampered localStorage payload can change what the drawer *looks* like and
 * nothing else.
 *
 * Persisted to localStorage so the cart survives reloads and swup navigations.
 */

export interface CartItem {
  /** Sanity `_id`. The only field the server trusts. */
  productId: string;
  quantity: number;
  /** Display-only snapshot below — never used to compute an amount. */
  title: string;
  slug: string;
  unitPrice: number; // cents
  image?: string;
  size?: string;
}

const STORAGE_KEY = 'hor.cart.v1';

const isBrowser = typeof window !== 'undefined';

function read(): CartItem[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive: drop anything that doesn't look like a CartItem rather than
    // letting a malformed entry blow up the drawer render.
    return parsed.filter(
      (i): i is CartItem =>
        typeof i === 'object' &&
        i !== null &&
        typeof (i as CartItem).productId === 'string' &&
        typeof (i as CartItem).quantity === 'number' &&
        (i as CartItem).quantity > 0,
    );
  } catch {
    return [];
  }
}

function write(items: readonly CartItem[]): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Private browsing / quota — the cart still works for this session.
  }
}

export const cartItems = atom<CartItem[]>(read());
export const cartOpen = atom<boolean>(false);

cartItems.listen((items) => write(items));

export const cartCount = computed(cartItems, (items) =>
  items.reduce((n, i) => n + i.quantity, 0),
);

/** Display-only subtotal, in cents. The server computes the real one. */
export const cartSubtotal = computed(cartItems, (items) =>
  items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
);

export function addItem(item: Omit<CartItem, 'quantity'>, quantity = 1): void {
  const items = [...cartItems.get()];
  const existing = items.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ ...item, quantity });
  }
  cartItems.set(items);
  cartOpen.set(true);
}

export function setQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeItem(productId);
    return;
  }
  cartItems.set(
    cartItems.get().map((i) => (i.productId === productId ? { ...i, quantity } : i)),
  );
}

export function removeItem(productId: string): void {
  cartItems.set(cartItems.get().filter((i) => i.productId !== productId));
}

export function clearCart(): void {
  cartItems.set([]);
}

/** What the checkout functions accept — id + qty, nothing else. */
export function toLineItems(): Array<{ productId: string; quantity: number }> {
  return cartItems.get().map(({ productId, quantity }) => ({ productId, quantity }));
}

export const formatPrice = (cents: number): string =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
