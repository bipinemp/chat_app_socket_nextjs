"use client";

import { FC } from "react";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import axios from "axios";
import socket from "@/lib/socket";
import { useSession } from "next-auth/react";

interface FriendRequestBtnProps {
  requesterId: string;
  receiverId: string;
}

const FriendRequestBtn: FC<FriendRequestBtnProps> = ({
  requesterId,
  receiverId,
}) => {
  const session = useSession();

  const sendFriendReqest = async () => {
    const Notification = {
      username: session?.data?.user?.username,
      message: "Sent a friend request",
      receiverId: receiverId,
      senderId: session?.data?.user?.id,
      type: "REQ",
      read: false,
    };

    socket.emit("chat_notification", Notification);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/friendrequest`,
        {
          receiverId,
          requesterId,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        type="button"
        onClick={sendFriendReqest}
        size="icon"
        className="h-7 w-8"
      >
        <UserPlus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default FriendRequestBtn;
