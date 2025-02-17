import { getOrCreateCart, syncCartWithUser, updateCartItem } from '@/actions/cart-actions';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
    id: string;
    title: string;
    price: number;
    quantity: number;
	image: string;
	sanityProductId?: string;
}

type CartStore = {
	items: CartItem[];
	isLoaded: boolean;
	isOpen: boolean;
	cartId: string | null;
	setStore: (store: Partial<CartStore>) => void;
	addItem: (item: CartItem) => Promise<void>;
	removeItem: (id: string) => Promise<void>;
	updateQuantity: (id: string, quantity: number) => Promise<void>;
	clearCart: () => void;
	open: () => void;
	close: () => void;
	setLoaded: (loaded: boolean) => void;
	syncWithUser: () => Promise<void>;
	getTotalItems: () => number;
	getTotalPrice: () => number;
	isLoading: string | null;
	setIsLoading: (isLoading: string) => void;
    setCartLoading: (isLoading: boolean) => void;
    cartLoading: boolean;
};

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			isLoaded: false,
			isOpen: false,
			cartId: null,
			isLoading: "",
			setIsLoading: (isLoading) => {
				set((state) => ({ ...state, isLoading }));
			},
			cartLoading: false,
			setCartLoading: (cartLoading) => {
				set((state) => ({ ...state, cartLoading }));
			},

			setStore: (store) => set(store),

			addItem: async (item) => {
				const { cartId, items, setCartLoading } = get();
				if (!cartId) {
					return;
				}
				// setCartLoading(true);

				const existingItem = items.find(
					(i) =>
						i.id === item.id || i.sanityProductId === item.id
				);
				const existingQuantity = existingItem
					? existingItem.quantity
					: 0;

				const addedItemQuantity = existingQuantity + item.quantity;

				const updatedCart = await updateCartItem(cartId, item.id, {
					title: item.title,
					price: item.price,
					image: item.image,
					quantity: addedItemQuantity,
				});


				set((state) => {
					return {
						...state,
						cartId: updatedCart.id,
						items: updatedCart.items,
					};
				});
				setCartLoading(false);
			},

			removeItem: async (id) => {
				const { cartId } = get();
				if (!cartId) {
					return;
				}
				const { setIsLoading } = get();
				setIsLoading(id);

				const updatedCart = await updateCartItem(cartId, id, {
					quantity: 0,
				});
				console.log(updatedCart);

				set((state) => {
					return {
						...state,
						cartid: updatedCart.id,
						// items: state.items.filter((item) => item.id !== id),
						items: updatedCart.items,
					};
				});
				setIsLoading("");
			},
			updateQuantity: async (id, quantity) => {
				const { cartId } = get();
				if (!cartId) {
					return;
				}

				const updatedCart = await updateCartItem(cartId, id, {
					quantity: quantity,
                });

				set((state) => {
					return {
						...state,
						cartid: updatedCart.id,
						items: updatedCart.items
					};
				});
			},
			syncWithUser: async () => {
                const { cartId, setCartLoading } = get();
                setCartLoading(true);

				if (!cartId) {
					const cart = await getOrCreateCart();
					set((state) => ({
						...state,
						cartId: cart.id,
						items: cart.items,
					}));
				}

				const syncedCart = await syncCartWithUser(cartId);
				if (syncedCart) {
					set((state) => ({
						...state,
						cartId: syncedCart.id,
						items: syncedCart.items,
					}));
                }
                setCartLoading(false);
			},
			clearCart: () => {
				set((state) => ({ ...state, items: [] }));
			},

			open: () => {
				set((state) => ({ ...state, isOpen: true }));
			},
			close: () => {
				set((state) => ({ ...state, isOpen: false }));
			},

			setLoaded: (loaded) => {
				set((state) => ({ ...state, isLoaded: loaded }));
			},

			getTotalItems: () => {
				const { items } = get();
				return items.reduce(
					(total, item) => total + item.quantity,
					0
				);
			},
			getTotalPrice: () => {
				const { items } = get();
				return items.reduce(
					(total, item) => total + item.price * item.quantity,
					0
				);
			},
		}),
		{
			name: "cart-storage",
			skipHydration: true,
		}
	)
);