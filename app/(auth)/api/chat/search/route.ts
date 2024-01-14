import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const searchParams = request.nextUrl.searchParams;
  const username_email = searchParams.get("q")?.toString();

  // checking if user is authenticated or not
  if (!session) {
    return NextResponse.json(
      { message: "You are not logged In" },
      { status: 401 }
    );
  }

  try {
    // searching user through username/email
    const users = await db.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: username_email,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: username_email,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        sentFriendRequests: {
          where: { status: "ACCEPTED" },
          include: { receiver: true },
        },
        receivedFriendRequests: {
          where: { status: "ACCEPTED" },
          include: { requester: true },
        },
      },
    });

    if (!users || users.length === 0) {
      return NextResponse.json(
        {
          message: "User Not Found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Something bad happened, Try again : ${error}` },
      { status: 400 }
    );
  }
}
