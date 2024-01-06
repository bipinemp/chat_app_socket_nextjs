import { db } from "@/lib/db";
import { RegisterSchema } from "@/types/authTypes";
import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const data = await req.json();

  try {
    // validating user input
    const validatedData = RegisterSchema.parse(data);
    const { username, email, password } = validatedData;

    // if email already exists
    const emailExists = await db.user.findUnique({ where: { email } });

    if (emailExists) {
      return NextResponse.json(
        { message: "Email already used" },
        { status: 400 }
      );
    }

    // if username already used
    const usernameUsed = await db.user.findUnique({
      where: {
        username,
      },
    });

    if (usernameUsed) {
      return NextResponse.json(
        { message: "Username already used" },
        { status: 400 }
      );
    }

    // encrypting password using bcrypt
    const hashedPassword = await hash(password, 10);

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: "Registered Successfully" },
      { status: 201 }
    );
  } catch (error) {
    // Handling Validation error using zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: `Something bad happened, Try again : ${error}` },
      { status: 400 }
    );
  }
}
