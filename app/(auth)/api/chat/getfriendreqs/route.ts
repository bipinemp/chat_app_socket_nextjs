import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  // checking if user is authenticated or not
  if (!session) {
    return NextResponse.json(
      { message: "You are not logged In" },
      { status: 401 }
    );
  }

  try {
    // all friend requests
    const friendReqs = await db.friend.findMany({
      where: {
        receiverId: session?.user?.id,
        status: "PENDING",
      },
      select: { requester: true },
    });

    return NextResponse.json(friendReqs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Something bad happened, Try again : ${error}` },
      { status: 400 }
    );
  }
}
