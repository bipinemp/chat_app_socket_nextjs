import Container from "@/components/Container";
import AcceptDecline from "@/components/chats/AcceptDecline";
import FriendRequestBtn from "@/components/chats/FriendRequestBtn";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

const Page = async () => {
  const users = await db.user.findMany();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <h1>Login to See Users List</h1>;
  }

  const sentFriendRequests = await db.friend.findMany({
    where: {
      requesterId: session?.user?.id,
      status: "PENDING",
    },
    select: { receiver: true },
  });

  const receivedFriendRequests = await db.friend.findMany({
    where: {
      receiverId: session?.user?.id,
      status: "PENDING",
    },
    select: { requester: true },
  });

  const acceptedFriends = await db.friend.findMany({
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

  return (
    <Container>
      <div className="flex flex-col gap-5 mt-10">
        {users.map((user) => (
          <Link
            href={`/chats/${user.id}`}
            key={user.id}
            className="flex items-center justify-between gap-5 py-4 px-6 border border-primary w-[450px] rounded-lg cursor-pointer"
          >
            <h2>{user.username}</h2>
            <FriendRequestBtn
              receiverId={user.id}
              requesterId={session?.user?.id}
            />
          </Link>
        ))}
      </div>
      {/* <ReqSentReceiveList idd={session?.user?.id} friendReqs={friendReqs} /> */}

      <div className="flex flex-col gap-5 mt-10 w-[600px]">
        <h3>Received Reqs</h3>
        <div className="flex flex-col gap-3">
          {receivedFriendRequests
            ?.map((requester) => requester)
            .map((user) => (
              <div className="flex items-center justify-between">
                <p>{user.requester?.username}</p>
                <AcceptDecline
                  receiverId={session?.user?.id}
                  requesterId={user?.requester?.id || ""}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Sent Friend Reqs  */}
      <div className="flex flex-col gap-5 mt-10 w-[600px]">
        <h3>Sent Reqs</h3>
        <div className="flex flex-col gap-3">
          {sentFriendRequests
            ?.map((receiver) => receiver)
            .map((user) => (
              <div className="flex">
                <p>{user.receiver?.username}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="p-5 border border-primary rounded-lg flex flex-col gap-5 mt-10 w-[600px] mb-20">
        <h1>Friends: </h1>

        <div className="flex flex-col gap-3">
          {acceptedFriends.map((friend) => {
            const friendUser =
              friend.requester?.id === session?.user?.id
                ? friend.receiver
                : friend.requester;
            return (
              <div>
                <p>{friendUser?.username}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default Page;

// {acceptedFriends
//   .map((requester) => requester)
//   .map((user) => (
//     <div>
//       <p>{user.requester?.username}</p>
//     </div>
//   ))}
