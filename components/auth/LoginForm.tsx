"use client";

import { FC, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface LoginFormProps {}

const LoginForm: FC<LoginFormProps> = ({}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>({
    resolver: zodResolver(LoginSchema),
  });

  async function onsubmit(data: TLogin) {
    try {
      setLoading(true);
      const signInData = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInData?.error === "CredentialsSignin") {
        toast.error("Email or Password didn't match");
      }
      if (signInData?.status === 200) {
        router.refresh();
        router.push("/");
        revalidatePath("/");
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignGoogle() {
    try {
      await signIn("google", {
        redirect: false,
      });

      revalidatePath("/");
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
      toast.error(error.message);
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
        <Button type="submit">
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            "Login"
          )}
        </Button>
      </form>
      <div className="flex items-center gap-2 justify-center">
        Don&apos;t have an account?{" "}
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
