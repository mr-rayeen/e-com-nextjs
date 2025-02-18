"use client";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { Loader, Loader2, ShoppingCartIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import CartItemSkeleton from "./CartItemSkeleton";
import secureIcon from "@/src/assets/icons8-protect.gif"
import truckIcon from "@/src/assets/truck.gif"
import returnIcon from "@/src/assets/return.png";
import moneyIcon from "@/src/assets/money.gif";
import { createCheckoutSession } from "@/actions/stripe-actions";


const Cart = () => {
	const {
		close,
		setLoaded,
		syncWithUser,
		isOpen,
		getTotalItems,
		items,
		updateQuantity,
		removeItem,
		isLoading,
		cartLoading,
		getTotalPrice,
		cartId,
	} = useCartStore(
		useShallow((state) => ({
			setLoaded: state.setLoaded,
			syncWithUser: state.syncWithUser,
			isOpen: state.isOpen,
			close: state.close,
			getTotalItems: state.getTotalItems,
			items: state.items,
			updateQuantity: state.updateQuantity,
			removeItem: state.removeItem,
			isLoading: state.isLoading,
			cartLoading: state.cartLoading,
			getTotalPrice: state.getTotalPrice,
			cartId: state.cartId,
		}))
	);
	
	const [qtyUpdate, setQtyUpdate] = useState("");

	useEffect(() => {
		const initCart = async () => {
			await useCartStore.persist.rehydrate();
			await syncWithUser();
			setLoaded(true);
		};

		initCart();
	}, [syncWithUser, setLoaded]);

	const [loadingProceed, setLoadingProceed] = useState<boolean>(false);

	const handleProceedToCheckout = async () => {
		if (!cartId || loadingProceed) {
			return;
		}

		setLoadingProceed(true);
		const checkoutUrl = await createCheckoutSession(cartId);
		if (!checkoutUrl) {
			return;
		}
		window.location.href = checkoutUrl;
		setLoadingProceed(false);
	}

	const totalPrice = getTotalPrice();

	const freeShippingAmount = 15; //$15 for free shipping
	const remainingForFreeShipping = useMemo(() => {
		return Math.max(0, freeShippingAmount - totalPrice)
	}, [totalPrice]);
	

	interface CartItem {
		id: string;
		image: string;
		title: string;
		price: number;
		quantity: number;
	}

	const updateQty = async (e: React.ChangeEvent<HTMLSelectElement>, item: CartItem) => {
		setQtyUpdate(item.id);
		await updateQuantity(item.id, Number(e.target.value));
		setQtyUpdate('');
	}
	
	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity  backdrop-blur-sm"
					onClick={() => close()}
				></div>
			)}

			{/* Cart Drawer */}
			<div
				className={`
            fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl
            transform transition-transform duration-300 ease-in-out z-50
            ${isOpen ? "translate-x-0" : "translate-x-full"} 
            `}
			>
				<div className="flex flex-col h-full">
					{/* Cart Header */}
					<div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
						<div className="flex items-center justify-center gap-4">
							<ShoppingCartIcon className="size-5 text-gray-500" />
							<h2 className="text-lg font-semibold text-gray-600">
								Shopping Cart
							</h2>
							<span className="bg-gray-200 px-2 text-sm font-semibold text-center text-gray-500 rounded-full">
								{getTotalItems()}
							</span>
						</div>
						<button
							onClick={() => close()}
							className="text-gray-500 hover:text-gray-900 rounded-full transition-colors"
						>
							<X className="h-5 w-5 " />
						</button>
					</div>

					{/* Cart Items */}
					{cartLoading ? (
						<CartItemSkeleton />
					) : (
						<>
							<div className="flex-1 overflow-y-auto">
								{items.length == 0 ? (
									<div className="flex flex-col items-center justify-center p-4 text-center h-full">
										<div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
											<ShoppingCartIcon className="size-8 text-gray-400" />
										</div>
										<h3 className="text-lg font-semibold text-gray-900 mb-2">
											Your Cart is Empty!
										</h3>
										<p className="text-sm text-gray-500">
											Looks Like you have not
											added any items to your
											cart yet.
										</p>
										<Link
											onClick={close}
											href="/"
											className=" bg-gray-100 mt-4 text-gray-500 rounded-full px-4 py-2 text-sm font-semibold hover:bg-gray-200 hover:text-gray-600 transition-all duration-200"
										>
											Start Shopping
										</Link>
									</div>
								) : (
									<div className="divide-y ">
										{items.map((item) => (
											<div
												key={`cart-item-${item.id}`}
												className="flex gap-4 p-4 hover:bg-gray-50 "
											>
												<div className="relative size-20 rounded-lg overflow-hidden flex-shrink-0 border">
													<Image
														src={
															item.image
														}
														alt={
															item.title
														}
														fill
														className="object-cover"
													/>
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="font-medium text-gray-900 truncate">
														{
															item.title
														}
													</h3>
													<div className="text-sm text-gray-500 mt-1">
														{formatPrice(
															item.price
														)}
													</div>
													<div className="flex text-black items-center justify-between gap-3 mt-2">
														{qtyUpdate ===
														item.id ? (
															<div className="px-2 py-1 w-14 text-sm">
																<Loader className="animate-spin h-4 w-4" />
															</div>
														) : (
															<select
																value={
																	item.quantity
																}
																onChange={(
																	e
																) =>
																	updateQty(
																		e,
																		item
																	)
																}
																className="border rounded-md px-2 py-1 text-sm bg-white "
															>
																{[
																	1,
																	2,
																	3,
																	4,
																	5,
																	6,
																	7,
																	8,
																	9,
																	10,
																].map(
																	(
																		num
																	) => (
																		<option
																			value={
																				num
																			}
																			key={`qty-slct-${item.id}-${num}`}
																		>
																			{
																				num
																			}
																		</option>
																	)
																)}
															</select>
														)}
														<button
															onClick={() =>
																removeItem(
																	item.id
																)
															}
															disabled={
																isLoading ===
																item.id
																	? true
																	: false
															}
															className={`bg-red-500 text-white text-sm px-2 py-1 rounded-md hover:bg-red-600
                                                        disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed 
                                                        `}
														>
															{isLoading ===
															item.id ? (
																<div className="flex items-center gap-2">
																	<Loader2 className="animate-spin h-4 w-4" />
																	<span>
																		Removing...
																	</span>
																</div>
															) : (
																<div className="flex items-center gap-2 inset-1 ">
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		x="0px"
																		y="0px"
																		width="16"
																		height="16"
																		viewBox="0,0,256,256"
																	>
																		<g
																			fill="#ffffff"
																			fillRule="nonzero"
																			stroke="none"
																			strokeWidth="1"
																			strokeLinecap="butt"
																			strokeLinejoin="miter"
																			strokeMiterlimit="10"
																			strokeDasharray=""
																			strokeDashoffset="0"
																			fontFamily="none"
																			fontWeight="none"
																			fontSize="none"
																			textAnchor="none"
																			style={{
																				mixBlendMode:
																					"normal",
																			}}
																		>
																			<g transform="scale(10.66667,10.66667)">
																				<path d="M10,2l-1,1h-6v2h18v-2h-6l-1,-1zM4.36523,7l1.52734,13.26367c0.132,0.99 0.98442,1.73633 1.98242,1.73633h8.24805c0.998,0 1.85138,-0.74514 1.98438,-1.74414l1.52734,-13.25586z"></path>
																			</g>
																		</g>
																	</svg>
																	<span>
																		Remove
																	</span>
																</div>
															)}
														</button>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Cart Footer */}
							{items.length > 0 && (
								<div className="border-t border-gray-200 p">
									{/* Shipping Progress */}
									{remainingForFreeShipping > 0 ? (
										<div className="p-4 bg-blue-50 border-b">
											<div className="flex gap-2 mb-2 text-blue-800 ">
												<span>
													<Image
														alt="truck"
														src={truckIcon}
														width={24}
														height={
															24
														}
													/>
												</span>
												<span className="font-medium">
													Add{" "}
													{formatPrice(
														remainingForFreeShipping
													)}{" "}
													more for free
													shipping!
												</span>
											</div>
											<div className="w-full bg-blue-200 rounded-full h-2">
												<div
													className="bg-blue-600 h-2 rounded-full transition-all duration-300"
													style={{
														width: `${Math.min(100, (totalPrice / freeShippingAmount) * 100)}%`,
													}}
												></div>
											</div>
										</div>
									) : (
										<div className="p-4 bg-green-50 border-b ">
											<div className="flex items-center gap-2 text-green-800">
												<span>🎉</span>
												<span>
													You have
													unlocked FREE
													shipping
												</span>
											</div>
										</div>
									)}

									{/* OrderSummary & Checkout */}
									<div className="p-4 space-y-4">
										<div className="space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span className="text-gray-500">
													Subtotal
												</span>
												<span className="font-medium text-gray-500">
													{formatPrice(
														totalPrice
													)}
												</span>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-gray-500">
													Shipping
												</span>
												<span className="font-medium text-gray-500">
													{remainingForFreeShipping >
													0
														? "Calculated at checkout"
														: "FREE"}
												</span>
											</div>
										</div>
										<div className="border-t pt-4">
											<div className="flex items-center justify-between text-sm mb-4">
												<span className="text-gray-500 text-lg font-medium">
													Total
												</span>
												<span className="font-bold text-gray-500 text-lg">
													{formatPrice(
														totalPrice
													)}
												</span>
											</div>
												<button className="w-full justify-center bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-white py-3 font-bold rounded-full hover:scale-95  transition-all duration-200"
													onClick={handleProceedToCheckout}
													disabled={loadingProceed}
												>
													{loadingProceed ? (
														<div className="flex items-center justify-center gap-2">
															<Loader2 className="animate-spin h-4 w-4" />
															<span>
																Processing...
															</span>
														</div>
													) : 'Proceed to Checkout'}
											</button>
											<div className="flex items-center justify-between mt-4 space-y-2 text-gray-500">
												<div className="flex items-center gap-2 text-xs">
													<Image
														className="size-5"
														src={
															secureIcon
														}
														alt="secure-icon"
													/>
													<span>
														Secure
														Checkout
													</span>
												</div>
												<div className="flex items-center gap-2 text-xs">
													<Image
														className="size-5"
														src={
															returnIcon
														}
														alt="return-icon"
													/>
													<span>
														30-day returns
													</span>
												</div>
												<div className="flex items-center gap-2 text-xs">
													<Image
														className="size-5"
														src={
															moneyIcon
														}
														alt="money-icon"
													/>
													<span>
														Payment Methods
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Cart;
