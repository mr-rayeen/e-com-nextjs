'use client'
import React, { useState } from "react";
import { Product } from "@/sanity.types"
import { Loader2, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type AddToCartButtonProps = {
    product: Product
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
    
    const [isLoading, setIsLoading] = useState(false)
    
    const handleAddToCart = async () => {
        setIsLoading(true)


        // Add to cart Functionality

        setIsLoading(false)
    }

    if (!product.price) {
        return null;
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={isLoading}
            className={`
                w-full mt-6 bg-gradient-to-r from-red-500 to-red-600
                text-white py-4 rounded-full font-bold text-xl
                hover:from-red-600 hover:to-red-700
                transition-all transform
                hover:scale-[1.02] active:scale-[1.02]
                shadow-xl flex items-center justify-center gap-3
                disabled:opacity-80 disabled:cursor-not-allowed
                disabled:hover:scale-100 disabled:active:scale-100
                disabled:hover:from-red-500 disabled:hover:to-red-600
                `}
        >
            {isLoading ? (<>
                <Loader2 className="size-6 animate-spin" />
                <span>Adding to Cart...</span>
            </>) : (<>
                <ShoppingCart className="size-6 text-white"/>
                Add to Cart -  {formatPrice(product.price)}
                </>
            )}
        </button>
    );
};

export default AddToCartButton;
