import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const receiverId = searchParams.get("t");

  const session = await getServerSession(authOptions);

  // checking if user is authenticated or not
  if (!session) {
    return NextResponse.json(
      { message: "You are not logged In" },
      { status: 401 }
    );
  }

  if (!receiverId || receiverId === "") {
    return NextResponse.json(
      { message: "Something went wrong , Try Again" },
      { status: 400 }
    );
  }

  try {
    // sending messages
    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            receiverId,
            senderId: session?.user?.id,
          },
          {
            senderId: receiverId,
            receiverId: session?.user?.id,
          },
        ],
      },
    });

    return NextResponse.json(
      { message: "Message Sent Successfully", messages },
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
