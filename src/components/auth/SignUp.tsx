"use client"
import React, { useActionState, useEffect, useState } from 'react'
import Form from 'next/form';
import { Eye, EyeClosed, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const intialState: { message: string; } = {
	message: "",
};

type SignUpProps = {
    action:(prevState: any, formData: FormData) => Promise<{message:string} | undefined>
}

const SignUp = ({ action }: SignUpProps) => {
	const [state, formAction, isPending] = useActionState(action, intialState)
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (state?.message && state.message.length > 0) {
			toast.error(state.message);
		}
	}, [state?.message]);
	
    return (
		<Form
			action={formAction}
			className="text-black p-8 max-w-md mx-auto  my-16 bg-white rounded shadow-md"
		>
			<h1 className="text-2xl font-bold text-center mb-2">
				Join the DEAL Revolution!
			</h1>
			<p className="text-center mb-2 text-sm text-rose-600 font-semibold">
				️‍🔥 Limited Time Offer ️‍🔥
			</p>
			<p className="text-center mb-4 text-sm text-gray-600 ">
				Sign up now and get 90% OFF your first oder!
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
						placeholder="Create your password"
					/>
					<div className="absolute top-9 right-3 cursor-pointer text-slate-400 hover:text-slate-500 transition-colors">
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
					<div className="text-[10px] text-slate-400 text-left mt-1">
						<span>
							Password should be at least 6 characters
						</span>
					</div>
				</div>

				{/* Copy Writing */}
				<div className="text-center ">
					<p className="text-xs text-gray-500 mb-2">
						⚡ Only 127 welcome bonus packages remaining!
					</p>
					<p className="text-xs text-gray-500 mb-2">
						🕒 Offer expires in: 13:45 hours!
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
							CREATING ACCOUNT...
						</>
					) : (
						"CREATE ACCOUNT"
					)}
				</button>
			</div>
		</Form>
    );
}

export default SignUp