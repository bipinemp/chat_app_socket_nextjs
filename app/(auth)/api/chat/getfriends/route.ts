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
    // sending friends
    const friends = await db.friend.findMany({
      where: {
        OR: [
          {
            requesterId: session?.user?.id,
            status: "ACCEPTED",
          },
          {
            receiverId: session?.user?.id,
            status: "ACCEPTED",
          },
        ],
      },
      select: {
        requester: true,
        receiver: true,
      },
    });

    return NextResponse.json(friends, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Something bad happened, Try again : ${error}` },
      { status: 400 }
    );
  }
}
