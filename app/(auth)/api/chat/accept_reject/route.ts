import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { FriendRequest } from "@/types/chatTypes";
import { Prisma } from "@prisma/client";
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
    const { receiverId, requesterId, status } = validatedData;

    // checking if user exists or not
    const requester = await db.user.findUnique({
      where: { id: requesterId },
    });
    const receiver = await db.user.findUnique({
      where: { id: receiverId },
    });

    if (!requester || !receiver) {
      return NextResponse.json({ message: "User not Found" }, { status: 404 });
    }

    // updating the friend request stats, ACCEPT or REJECT
    await db.friend.update({
      where: { requesterId_receiverId: { receiverId, requesterId } },
      data: { status },
    });

    return NextResponse.json(
      { message: "Friend Request Accepted Successfully" },
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // https://www.prisma.io/docs/orm/reference/error-reference#p2025
      if (error.code === "P2025") {
        // User not found error
        return NextResponse.json(
          { message: "User not Found" },
          { status: 404 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Unexpected error occurred, Please Try Again Later." },
        { status: 500 }
      );
    }
  }
}
