"use client";

import { FC } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, TRegister } from "@/types/authTypes";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegister>({
    resolver: zodResolver(RegisterSchema),
  });

  async function onsubmit(data: TRegister) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/register",
        data
      );
      if (response.status === 201) {
        toast.success("Registered Successfully");
        router.push("/login");
      }
    } catch (error: any) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
      toast.error(error.message);
    }
  }
  return (
    <div className="w-[500px] mx-auto mt-20 flex flex-col gap-6 border border-ring py-5 px-7 rounded-lg">
      <h2 className="text-center">Register</h2>
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onsubmit)}>
        <div className="flex flex-col">
          <Input
            {...register("username")}
            placeholder="Enter Username..."
            name="username"
            type="text"
            className="border border-ring"
          />
          <span className="text-sm text-destructive">
            {errors.username?.message}
          </span>
        </div>
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
        <Button type="submit">Register</Button>
      </form>
      <div className="flex items-center gap-3 justify-center">
        Already have an account?{" "}
        <Link href={"/login"} className="underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
