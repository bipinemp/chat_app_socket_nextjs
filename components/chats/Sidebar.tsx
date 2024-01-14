"use client";

import React from "react";
import UserCard from "./UserCard";
import SearchBar from "./SearchBar";
import AcceptDecline from "./AcceptDecline";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface SidebarProps {
  friends: TAcceptedFriedsArr | undefined;
  friendReqs: FriendReqs | undefined;
  FrnReqsPending?: boolean;
  FriendsPending?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  friends,
  friendReqs,
  FriendsPending,
  FrnReqsPending,
}) => {
  const session = useSession();

  return (
    <div className="relative flex flex-col gap-5 bg-zinc-100 border border-r-primary py-7 px-5 w-[350px] h-[88vh]">
      <div>
        <SearchBar />
      </div>
      <div className="z-10 flex flex-col gap-4">
        <h2 className="underline">Your Chats</h2>
        <div className="w-full flex flex-col gap-3">
          {FriendsPending && (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-center" />
            </div>
          )}
          {friends?.map((friend) => {
            const friendUser: UserDetail =
              friend.requester?.id === session?.data?.user?.id
                ? friend.receiver
                : friend.requester;

            if (friendUser?.username) {
              return <UserCard key={friendUser.id} friendUser={friendUser} />;
            }

            return null;
          })}
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <h2 className="underline">Friend Requests</h2>
        {FrnReqsPending && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-center" />
          </div>
        )}
        {friendReqs?.length === 0 && (
          <p className="text-center text-destructive font-semibold">Empty</p>
        )}
        <div className="flex flex-col gap-3">
          {friendReqs?.length !== 0 &&
            friendReqs
              ?.filter((friend) => friend?.requester?.username)
              .map((friend) => {
                return (
                  <div
                    key={friend?.requester?.id}
                    className="flex items-center justify-between border border-primary p-2 rounded"
                  >
                    <p>{friend?.requester?.username}</p>
                    <AcceptDecline
                      receiverId={session?.data?.user?.id || ""}
                      requesterId={friend?.requester?.id || ""}
                      requesterUsername={friend?.requester?.username || ""}
                      requesterImage={friend?.requester?.image || ""}
                    />
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
