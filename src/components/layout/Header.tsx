"use client";
import { logoutUser } from "@/actions/auth";
import { User } from "@prisma/client";
import { LogOut, MenuIcon, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AnnouncementBar = () => {
	return (
		<div className="w-full bg-black py-2 h-fit">
			<div className="container max-auto flex items-center justify-center px-8">
				<span className="text-white text-center text-sm fnt-medium tracking-wide ">
					☀️ FREE SHIPPING ON ORDERS OVER $15.00 🎉 FREE 🎉
				</span>
			</div>
		</div>
	);
};


type HeaderProps = {
	user:Omit<User,"password"> | null;
	categorySelector:React.ReactNode;
}

const Header = ({user, categorySelector}:HeaderProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(true);
	const [prevScrollY, setPrevScrollY] = useState<number>(0);
	const router = useRouter();
	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const scrolledUp = currentScrollY < prevScrollY;
			
            if (scrolledUp) {
                setIsOpen(true);
            } else if (currentScrollY > 100) {
                setIsOpen(false);
            }

            setPrevScrollY(currentScrollY);
		};

		setPrevScrollY(window.scrollY);
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [prevScrollY]);

	return (
		<header className="w-full sticky top-0 z-50">
			<div
				className={`w-full transform transition-transform duration-300 ease-in-out 
                    ${isOpen ? "translate-y-0" : "-translate-y-full"} 
                `}
			>
				<AnnouncementBar />
				<div className="w-full justify-center items-center py-3 sm:py-4 bg-white/80 shadow-sm border-b border-gray-100 backdrop-blur-sm ">
					<div className="flex text-slate-700 justify-between container items-center mx-auto px-8">
						<div className="flex flex-1 justify-start items-center gap-4 sm:gap-6 ">
							<button className="text-gray-700 hover:text-gray-900 md:hidden">
								<MenuIcon className="h-5 w-5 hover:text-gray-900" />
							</button>

							<nav className="hidden md:flex gap-4 lg:gap-6 text-sm font-medium ">
								<Link className="hover:text-black "  href="#">Shop</Link>
								<Link  className="hover:text-black " href="#">New Arrivals</Link>
								{categorySelector}
								<Link  className="hover:text-black " href="#">Sale</Link>
							</nav>
						</div>

						<Link
							href="#"
							className="absolute left-1/2 -translate-x-1/2"
						>
							<span className="text-xl sm-text-2xl text-black font-bold tracking-tight ">
								DEAL
							</span>
						</Link>

						<div className="flex flex-1 justify-end items-center gap-2 sm:gap-4 ">
							<button className="text-gray-500 hover:text-gray-900 sm:block">
								<Search className="h-5 w-5 sm:h-6 sm:w-6" />
							</button>

							{user ? (
								<div className="flex items-center gap-2 sm:gap-4">
									<span className="text-sm text-gray-700 hidden  md:block">
										{user.email}
									</span>
									<Link
										href="#"
										className="text-gray-700 hover:text-gray-900 hidden md:block"
										onClick={async (e) => {
											e.preventDefault();
											await logoutUser();
											router.refresh();
										}}
									>
										<LogOut className="h-5 w-5  sm:h-6 sm:w-65" />
									</Link>
								</div>
							) : (
								<>
									<Link
										className="hover:text-black"
										href="/auth/sign-in"
									>
										Sign In
									</Link>
									<Link
										className="hover:text-black "
										href="/auth/sign-up"
									>
										Sign Up
									</Link>
								</>
							)}

							<button className="text-gray-500  hover:text-gray-900 relative">
								<ShoppingBag className="h-5 w-5  sm:h-6 sm:w-6" />
								<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs w-3.5 h-3.5 sm-w-4 sm-h-4 flex items-center justify-center rounded-full p-2">
									0
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
