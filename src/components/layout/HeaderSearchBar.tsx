import { SearchIcon } from "lucide-react";
import Form from "next/form";
import React from "react";

const HeaderSearchBar = () => {
	return (
		<Form action="/search">
			<div className="relative group">
				<div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none ">
					<SearchIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-hover:text-gray-600 " />
				</div>
				<input
					type="text"
					placeholder="Search..."
					name="query"
					className="min-w-60  w-full pl-8 pr-2 py-2 text-sm border border-gray-200 rounded-full focus:ring-1 focus:black-ring focus:border-transparent transition-colors"
				/>
			</div>
		</Form>
	);
};

export default HeaderSearchBar;
