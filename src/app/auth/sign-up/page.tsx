import { getCurrentSession, loginUser, registerUser } from '@/actions/auth'
import SignUp from '@/components/auth/SignUp';
import { redirect } from 'next/navigation';
import React from 'react'
import zod from 'zod';

const SignUpSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6,{message:"Password must be at least 6 characters long"}),
})

const SignupPage = async () => {

  const { user } = await getCurrentSession();

  if (user) {
    return redirect('/');
  }

  const action = async (formData: FormData) => {
    'use server';
    try {
      const parsed = SignUpSchema.safeParse(Object.fromEntries(formData));
      if (!parsed.success) {
        const errorMessages = parsed.error.errors.map(err => err.message).join(' and ');
        return {
          message:errorMessages,
          errors: parsed.error
        }
      }

      const { email, password } = parsed.data;
      const { user, error } = await registerUser(email, password);

      //If user created log him in and redirect home
      if(user){
        await loginUser(email, password);
        return redirect('/');
      }

      // If user already exist or any other error then set messsage.
      if (error) {
        return { message: error };
      }
    } catch (error) {
      console.log("Error:",error);
      return { message: String(error) };
    }
  }

  return (
    <SignUp action={action}/>
  )
}

export default SignupPage