import { getCurrentSession, loginUser, registerUser } from "@/actions/auth";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";
import { redirect } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import zod from "zod";

const SignInSchema = zod.object({
	email: zod.string().email(),
	password: zod
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
});

const SignInPage = async () => {
	const { user } = await getCurrentSession();

	if (user) {
		return redirect("/");
	}

	const action = async (prevState: any, formData: FormData) => {
		"use server";
		try {
			const parsed = SignInSchema.safeParse(
				Object.fromEntries(formData)
            );

            if (!parsed.success) {
                const errorMessages = parsed.error.errors.map(err => err.message).join(' and ');
				return {
				message:errorMessages,
				errors: parsed.error
				}
			}

			const { email, password } = parsed.data;
			const { user, error } = await loginUser(email, password);
            
            if (error) {
                return { message: error };
            }
			if (user) {
				return redirect("/");
			}
		} catch (error) {
			console.log("Error:", error);
			return { message: String(error) };
		}
	};

	return <SignIn action={action} />;
};

export default SignInPage;
