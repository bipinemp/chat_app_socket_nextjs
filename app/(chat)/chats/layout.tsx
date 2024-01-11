"use client";

import getFriendReqs from "@/app/actions/getFriendReqs";
import getFriends from "@/app/actions/getFriends";
import Sidebar from "@/components/chats/Sidebar";
import { useQuery } from "@tanstack/react-query";

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: friends, isPending: FriendsPending } =
    useQuery<TAcceptedFriedsArr>({
      queryKey: ["friends"],
      queryFn: getFriends,
    });

  const { data: friendReqs, isPending: FrnReqsPending } = useQuery<FriendReqs>({
    queryKey: ["friendreqs"],
    queryFn: getFriendReqs,
  });

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
