"use client";

import React from "react";
import UserCard from "./UserCard";
import SearchBar from "./SearchBar";
import AcceptDecline from "./AcceptDecline";
import { Loader2 } from "lucide-react";
import socket from "@/lib/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import getFriendReqs from "@/app/actions/getFriendReqs";
import getFriends from "@/app/actions/getFriends";

interface SidebarProps {
  session: any;
}

const Sidebar: React.FC<SidebarProps> = ({ session }) => {
  const queryClient = useQueryClient();

  const { data: friends, isPending: FriendsPending } =
    useQuery<TAcceptedFriedsArr>({
      queryKey: ["friends"],
      queryFn: getFriends,
    });

  const { data: friendReqs, isPending: FrnReqsPending } = useQuery<FriendReqs>({
    queryKey: ["friendreqs"],
    queryFn: getFriendReqs,
  });

  useEffect(() => {
    const handleFriendReqNotification = (notification: NotificationType) => {
      if (notification.message && notification.type === "REQ") {
        queryClient.setQueryData(["friendreqs"], (data: any) => {
          const newData = [notification, ...(data || [])];
          queryClient.invalidateQueries({ queryKey: ["friendreqs"] });
          return newData;
        });
      }
    };

    const handleUpdatedFriendList = (friend: any) => {
      if (friend.requester.id && friend.receiver.id) {
        queryClient.setQueryData(["friends"], (data: any) => {
          const newFriend = friends && friends?.length > 0 ? friend[0] : friend;

          return [newFriend[0], ...(data || [])];
        });
      }
    };

    socket.on("friendreq_notification", handleFriendReqNotification);
    socket.on("updatedFriendsList", handleUpdatedFriendList);

    return () => {
      // Clean up the event listener when the component is unmounted
      socket.off("friendreq_notification", handleFriendReqNotification);
      socket.off("updatedFriendsList", handleUpdatedFriendList);
    };
  }, [socket]);

  return (
    <div className="relative flex flex-col gap-5 bg-zinc-100 border border-r-primary py-7 px-5 w-[350px] h-[88vh]">
      <div>
        <SearchBar />
      </div>
      <div className="z-10 flex flex-col gap-4">
        <h2 className="underline">Your Chats</h2>
        <p>UserLoggedIn: {session?.user?.username}</p>
        <div className="w-full flex flex-col gap-3">
          {FriendsPending && (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-center" />
            </div>
          )}
          {friends?.length === 0 && (
            <p className="text-center text-destructive font-semibold">Empty</p>
          )}
          {friends?.map((friend) => {
            const friendUser: UserDetail =
              friend.requester?.id === session?.user?.id
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
                      receiverId={session?.user?.id || ""}
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
