"use client";

import getFriendReqs from "@/app/actions/getFriendReqs";
import getFriends from "@/app/actions/getFriends";
import Sidebar from "@/components/chats/Sidebar";
import socket from "@/lib/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const session = useSession();

  const { data: friends, isPending: FriendsPending } =
    useQuery<TAcceptedFriedsArr>({
      queryKey: ["friends", session?.data?.user?.id],
      queryFn: getFriends,
    });

  const { data: friendReqs, isPending: FrnReqsPending } = useQuery<FriendReqs>({
    queryKey: ["friendreqs", session?.data?.user?.id],
    queryFn: getFriendReqs,
  });

  useEffect(() => {
    const handleFriendReqNotification = (notification: NotificationType) => {
      if (notification.type === "REQ") {
        queryClient.setQueryData(["friendreqs"], (data: any) => {
          const newData = [notification, ...(data || [])];
          queryClient.invalidateQueries({ queryKey: ["friendreqs"] });
          return newData;
        });
      }
    };

    const handleUpdatedFriendList = (friend: any) => {
      queryClient.setQueryData(["friends"], (data: any) => {
        const newFriend = friends && friends?.length > 0 ? friend[0] : friend;

        return [newFriend[0], ...(data || [])];
      });
    };

    socket.on("friendreq_notification", handleFriendReqNotification);
    socket.on("updatedFriendsList", handleUpdatedFriendList);

    return () => {
      // Clean up the event listener when the component is unmounted
      socket.off("friendreq_notification", handleFriendReqNotification);
      socket.off("updatedFriendsList", handleUpdatedFriendList);
    };
  }, []);

  return (
    <div className="flex">
      <Sidebar
        friends={friends}
        friendReqs={friendReqs}
        FriendsPending={FriendsPending}
        FrnReqsPending={FrnReqsPending}
      />
      {children}
    </div>
  );
}
