import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { MessageType } from "@/types/chatTypes";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  // checking if user is authenticated or not
  if (!session) {
    return NextResponse.json(
      { message: "You are not logged In" },
      { status: 401 }
    );
  }

  try {
    // valiadting user input
    const validatedData = MessageType.parse(data);
    const { receiverId, senderId, message, image, username } = validatedData;

    // checking if user exists or not
    const requester = await db.user.findUnique({ where: { id: senderId } });
    const receiver = await db.user.findUnique({ where: { id: receiverId } });

    // if user's not exists
    if (!requester || !receiver) {
      return NextResponse.json({ message: "User not Found" }, { status: 404 });
    }

    // creating a new message
    await db.message.create({
      data: {
        message,
        senderId,
        receiverId,
        username: username,
        image: image,
      },
    });

    return NextResponse.json(
      { message: "Message Sent Successfully" },
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
