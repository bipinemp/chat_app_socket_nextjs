"use client";

import { FC } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import socket from "@/lib/socket";
import { useSession } from "next-auth/react";

interface AcceptDeclineProps {
  receiverId: string;
  requesterId: string;
  requesterUsername: string;
  requesterImage: string;
}

const AcceptDecline: FC<AcceptDeclineProps> = ({
  receiverId,
  requesterId,
  requesterUsername,
  requesterImage,
}) => {
  const queryClient = useQueryClient();
  const session = useSession();

  async function acceptFriendRequest(requesterId: string) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/accept_reject`,
        {
          receiverId,
          requesterId,
          status: "ACCEPTED",
        }
      );

      const friendsData = {
        requester: {
          id: requesterId,
          username: requesterUsername,
          image: requesterImage,
        },
        receiver: {
          id: receiverId,
          username: session?.data?.user?.username,
          image: session?.data?.user?.image,
        },
      };

      socket.emit("acceptfriendreq", friendsData);
    } catch (error) {
      console.log(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["friendreqs"] });
    }
  }

  async function rejectFriendRequest(requesterId: string) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/accept_reject`,
        {
          receiverId,
          requesterId,
          status: "DECLINED",
        }
      );

      queryClient.setQueryData(["friendreqs"], (data: any) => {
        return data.map((val: any) => val.requester.id !== requesterId);
      });

      socket.emit("deletefriendreq", requesterId);
    } catch (error) {
      console.log(error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["friendreqs"] });
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => acceptFriendRequest(requesterId || "")}
        size="icon"
      >
        <Check className="w-5 h-5" />
      </Button>
      <Button
        variant="destructive"
        onClick={() => rejectFriendRequest(requesterId || "")}
        size="icon"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default AcceptDecline;
