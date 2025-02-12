"use client";
import React, { useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const intialState: { message: string } = {
	message: "",
};

type SignInProps = {
	action: (
		prevState: any,
		formData: FormData
	) => Promise<{ message: string } | undefined>;
};

const SignIn = ({ action }: SignInProps) => {
	const [state, formAction, isPending] = useActionState(action, intialState);
    const [showPassword, setShowPassword] = useState(false);
    
    useEffect(() => {
        if (state?.message && state.message.length > 0) {
            toast.error(state.message);
        }        
    },[state?.message])

	return (
		<Form
			action={formAction}
			className="text-black p-8 max-w-md mx-auto  my-16 bg-white rounded shadow-md"
		>
			<h1 className="text-2xl font-bold text-center mb-2">
				Welcome Back!
			</h1>
			<p className="text-center mb-2 text-sm text-rose-600 font-semibold">
				️‍🔥 {"Member Exclusive".toUpperCase()} ️‍🔥
			</p>
			<p className="text-center mb-4 text-sm text-gray-600 ">
				Sign in to access your member deals!
			</p>

			{/* Form */}
			<div className="space-y-6">
				{/* Email */}
				<div className="space-y-2">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<input
						type="text"
						id="email"
						name="email"
						autoComplete="email"
						required
						className="w-full px-4 py-3 border-gray-200 shadow border rounded-md focus:ring-2 focus:ring-rose-600 focus:border-transparent transition-colors"
						placeholder="Enter your email"
					/>
				</div>

				{/* Password */}
				<div className="space-y-2 relative">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password
					</label>
					<input
						type={showPassword ? "text" : "password"}
						id="password"
						name="password"
						autoComplete="new-password"
						required
						className="w-full px-4 py-3 border-gray-200 shadow border rounded-md focus:ring-2 focus:ring-rose-600 focus:border-transparent transition-colors"
						placeholder="Enter your password"
					/>
					<div className="absolute bottom-3 right-3 cursor-pointer text-slate-400 hover:text-slate-500 transition-colors">
						{showPassword ? (
							<EyeClosed
								onClick={() =>
									setShowPassword(!showPassword)
								}
							/>
						) : (
							<Eye
								onClick={() =>
									setShowPassword(!showPassword)
								}
							/>
						)}
					</div>
				</div>

				{/* Copy Writing */}
				<div className="text-center ">
					<p className="text-xs text-gray-500 mb-2">
						⚡ Members save an extra 15% on all orders
					</p>
					<p className="text-xs text-gray-500 mb-2">
						🚚💨 Plus get free shipping on orders over
						$15.00💲
					</p>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={isPending}
					className={`w-full bg-rose-600 text-white py-3 rounded-md hover:bg-rose-700 transition-colors font-medium flex items-center justify-center gap-2 ${
						isPending && "cursor-not-allowed opacity-50"
					}`}
				>
					{isPending ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							SIGNING IN...
						</>
					) : (
						"SIGN IN"
					)}
				</button>
			</div>
		</Form>
	);
};

export default SignIn;
