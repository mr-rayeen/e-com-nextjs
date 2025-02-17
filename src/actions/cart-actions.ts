"use server"

import prisma from "@/lib/prisma";
import { getCurrentSession } from "./auth"
import { revalidatePath } from "next/cache";

export const createCart = async () => {
    // Get the current session to check if the user is logged in
    const { user } = await getCurrentSession();
    
    // Create a new cart in the database
    const cart = await prisma.cart.create({
        data: {
            // Generate a unique ID for the cart
            id: crypto.randomUUID(),
            // If the user is logged in, connect the cart to the user
            user: user ? { connect: { id: user.id } } : undefined,
            // Initialize the cart with an empty list of items
            items: {
                create: [],
            }
        },
        // Include the items in the cart in the returned data
        include: {
            items: true,
        },
    });

    // Return the newly created cart
    return cart;
}

export const getOrCreateCart = async (cartId?: string | null) =>{
    // Get the current session to check if the user is logged in
    const { user } = await getCurrentSession();

    if (user) {
        // If the user is logged in, find the user's cart in the database
        const userCart = await prisma.cart.findUnique({
            where: {
                userId: user.id,
            },
            include: {
                items: true,
            }
        });

        // If the user's cart exists, return it
        if (userCart) {
            return userCart;
        }
    }

    // If no cartId is provided, create a new cart
    if (!cartId) {
        return createCart();
    }

    // Find the cart by cartId in the database
    const cart = await prisma.cart.findUnique({
        where: {
            id: cartId,
        },
        include: {
            items: true,
        }
    });

    // If the cart does not exist, create a new cart
    if (!cart) {
        return createCart();
    }

    // Return the found cart
    return cart;
}

export const updateCartItem = async(
    cartId: string,
    sanityProductId: string,
    data: {
        title?: string,
        price?: number,
        image?: string,
        quantity?: number,
    }
) => {
    const cart = await getOrCreateCart(cartId);

    // console.log("Cart:", cart);
    // console.log('Sanity ID:',sanityProductId)
    const existingItem = cart.items.find(
		(item) =>
			item.sanityProductId === sanityProductId ||
			item.id === sanityProductId
    );

    // console.log('Request Aii for delete');
    // console.log("Existing Item:", existingItem);
    // console.log("Data:", data);

    if (existingItem) {
        //Update Quantity
        if (data.quantity === 0) {
            await prisma.cartLineItems.delete({
                where: {
                    id: existingItem.id,
                },
            })
            console.log("Deleted");
        } else if (data.quantity && data.quantity > 0) {
            await prisma.cartLineItems.update({
                where: {
                    id: existingItem.id
                },
                data: {
                    quantity: data.quantity,
                }
            })
            console.log("Updated");
        }
    } else if (data.quantity && data.quantity > 0) {
        await prisma.cartLineItems.create({
            data: {
                id: crypto.randomUUID(),
                cartId: cart.id,
                sanityProductId,
                quantity: data.quantity || 1,
                title: data.title || '',
                price: data.price || 0,
                image: data.image || '',
            }
        });
        console.log("Added!");
    }
    revalidatePath("/");
    return getOrCreateCart(cartId);
}

export const syncCartWithUser = async (cartId: string | null) => {
	const { user } = await getCurrentSession();

	// If the user is not logged in, return null
	if (!user) {
		return null;
	}

	// Find the user's existing cart in the database
	const existingUserCart = await prisma.cart.findUnique({
		where: {
			userId: user.id,
		},
		include: {
			items: true,
		},
	});

	// Find the anonymous cart by cartId in the database, if cartId is provided
	const existingAnonymousCart = cartId
		? await prisma.cart.findUnique({
				where: {
					id: cartId,
				},
				include: {
					items: true,
				},
			})
		: null;

	// If no cartId is provided and the user has an existing cart, return the user's cart
	if (!cartId && existingUserCart) {
		return existingUserCart;
	}

	// If no cartId is provided, create a new cart
	if (!cartId) {
		// Existing cart = null
		return createCart();
	}

	// If neither the anonymous cart nor the user's cart exists, create a new cart
	if (!existingAnonymousCart && !existingUserCart) {
		return createCart();
	}

	// If the user's cart exists and matches the provided cartId, return the user's cart
	if (existingUserCart && existingUserCart.id === cartId) {
		return existingUserCart;
	}

	// If the user does not have an existing cart, update the anonymous cart to associate it with the user
	if (!existingUserCart) {
		const newCart = await prisma.cart.update({
			where: {
				id: cartId,
			},
			data: {
				user: {
					connect: {
						id: user.id,
					},
				},
			},
			include: {
				items: true,
			},
		});

		return newCart;
    }
    
    if (!existingAnonymousCart) {
        return existingUserCart;
    }

    for (const item of existingAnonymousCart?.items) {
        const existingItem = existingUserCart.items.find((i) => i.sanityProductId === item.sanityProductId);

        if (existingItem) {
            //Add two cart quantities together
            await prisma.cartLineItems.update({
                where: {
                    id: existingItem.id
                },
                data: {
                    quantity: existingItem.quantity + item.quantity,
                }
            })
        } else {
            // Add non existing itms yo the user's cart
            await prisma.cartLineItems.create({
                data: {
                    id: crypto.randomUUID(),
                    cartId: existingUserCart.id,
                    sanityProductId: item.sanityProductId,
                    quantity: item.quantity,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                }
            })
        }
    }

    await prisma.cart.delete({
        where: {
            id:cartId,
        }
    })

    revalidatePath("/");
    return getOrCreateCart(existingUserCart.id);
}