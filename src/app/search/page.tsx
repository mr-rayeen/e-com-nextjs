import SalesCampaignBanner from "@/components/layout/SalesCampaignBanner";
import ProductGrid from "@/components/product/ProductGrid";
import {searchProducts} from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
type SearchPageProps = {
	searchParams: Promise<{ query: string }>;
};
const SearchPage = async ({ searchParams }: SearchPageProps) => {
	const { query } = await searchParams;
	
    const products = await searchProducts(query);

	return (
		<div>
			<SalesCampaignBanner />
			<div className="bg-red-50 p-4">
				<div className="container mx-auto">
					<h1 className="text-2xl md:text-3xl font-bold text-center text-red-600 mb-2">
						Search results for &quot;{query}&quot; - UP TO 90%
						OFF! 🔥
					</h1>
					<p className="text-center text-rose-500 text-sm ms:text-base mb-2 animate-pulse">
						⚡ Flash Sale Ending Soon! ⏰ Limited Time Only
					</p>
					
				</div>
			</div>

			<div className="bg-yellow-50 text-yellow-600 p-4">
				<div className="container mx-auto">
					<div className="flex items-center justify-center gap-4 text-sm">
						<div className="flex items-center gap-2">
							<span>🚚💨</span>
							<span>Free Shipping</span>
						</div>
						<div className="flex items-center gap-2">
							<span>⭐</span>
							<span>Top Rated</span>
						</div>
						<div className="flex items-center gap-2">
							<span>💰</span>
							<span>Best Prices</span>
						</div>
					</div>
				</div>
			</div>

			<section className="container mx-auto py-8 text-black">
				{products.length > 0 ? (
					<>
						<div className="text-center mb-8">
							<p className="text-sm text-gray-500">
								🎉 Discover amazing deals matching
								your search!
							</p>
						</div>

						<ProductGrid products={products} />
					</>
				) : (
					<div className="text-center mb-8">
						<p className="text-2xl md:text-3xl text-gray-500 mt-10 flex flex-col items-center justify-center gap-4 ">
							<Image
								src="https://www.animatedimages.org/data/media/1498/animated-sad-image-0016.gif"
								alt="Sad gif"
								width={100}
								height={100}
							/>
							<span>Sorry Nothing Found!</span>
						</p>
						<div className="text-center w-[10rem] mx-auto border border-gray-200 mt-10 py-2 rounded-full bg-slate-200 hover:bg-slate-300 mb-8">
							<Link
								className="text-gray-500 text-sm"
								href="/"
							>
								Back to Home
							</Link>
						</div>
					</div>
				)}
			</section>
		</div>
	);
};

export default SearchPage;
