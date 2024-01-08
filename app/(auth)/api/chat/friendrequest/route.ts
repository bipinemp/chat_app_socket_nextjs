import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { FriendRequest } from "@/types/chatTypes";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { message: "You are not logged In" },
      { status: 401 }
    );
  }

  try {
    // valiadting user input
    const validatedData = FriendRequest.parse(data);
    const { receiverId, requesterId } = validatedData;

    // checking if user exists or not
    const requester = await db.user.findUnique({ where: { id: requesterId } });
    const receiver = await db.user.findUnique({ where: { id: receiverId } });

    if (!requester || !receiver) {
      return NextResponse.json({ message: "User not Found" }, { status: 404 });
    }

    // check if Friend request already exists
    const FriendReqExists = await db.friend.findUnique({
      where: {
        requesterId_receiverId: { receiverId, requesterId },
      },
    });

    if (FriendReqExists) {
      return NextResponse.json(
        {
          message: "Friend Request already Sent or Received",
        },
        { status: 400 }
      );
    }

    // creating friend request
    await db.friend.create({
      data: {
        receiverId: receiverId,
        requesterId: requesterId,
      },
    });

    return NextResponse.json(
      { message: "Friend Request Sent Successfully" },
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
