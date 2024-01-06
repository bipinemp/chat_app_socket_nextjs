"use client";

import { FC } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, TLogin } from "@/types/authTypes";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Google from "@/public/images/google.png";
import Image from "next/image";
import { revalidatePath } from "next/cache";

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>({
    resolver: zodResolver(LoginSchema),
  });

  async function onsubmit(data: TLogin) {
    try {
      const signInData = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      console.log(signInData);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSignGoogle() {
    try {
      const signInData = await signIn("google", {
        redirect: false,
      });
      revalidatePath("/");
      console.log(signInData);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="w-[500px] mx-auto mt-20 flex flex-col gap-6 border border-ring py-5 px-7 rounded-lg">
      <h2 className="text-center">Login</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onsubmit)}>
        <div className="flex flex-col">
          <Input
            {...register("email")}
            placeholder="Enter Email..."
            name="email"
            type="email"
            className="border border-ring"
          />
          <span className="text-sm text-destructive">
            {errors.email?.message}
          </span>
        </div>

        <div className="flex flex-col">
          <Input
            {...register("password")}
            placeholder="Enter Password..."
            name="password"
            type="password"
            className="border border-ring"
          />
          <span className="text-sm text-destructive">
            {errors.password?.message}
          </span>
        </div>
        <Button type="submit">Login</Button>
      </form>
      <div className="flex items-center gap-2 justify-center">
        Don't have an account?{" "}
        <Link href={"/register"} className="underline">
          Register
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="w-full h-[1px] bg-foreground"></span>
          <p>OR</p>
          <span className="w-full h-[1px] bg-foreground"></span>
        </div>
        <Button onClick={handleSignGoogle} className="flex items-center gap-3">
          <Image src={Google} width={20} height={20} alt="google logo" />
          Sign In Google
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
