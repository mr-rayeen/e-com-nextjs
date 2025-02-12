import { getAllProducts } from "@/sanity/lib/client";


const Home =async () => {
  const products = await getAllProducts();

  return (
		<div className=" h-[1900px] text-black">
			Home
		</div>
  );
}

export default Home;