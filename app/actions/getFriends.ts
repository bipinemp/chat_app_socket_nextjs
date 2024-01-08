"use server";

import { db } from "@/lib/db";
import getSession from "./getSession";

const getFriends = async () => {
  const session = await getSession();
  if (!session?.user && !session?.user?.email) {
    return [];
  }

  try {
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

    return friends;
  } catch (error: any) {
    return [];
  }
};

export default getFriends;
