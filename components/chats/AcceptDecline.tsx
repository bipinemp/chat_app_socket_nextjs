"use client";

import { FC } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AcceptDeclineProps {
  receiverId: string;
  requesterId: string;
}

const AcceptDecline: FC<AcceptDeclineProps> = ({ receiverId, requesterId }) => {
  async function acceptFriendRequest(requesterId: string) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/chat/accept_reject",
        {
          receiverId,
          requesterId,
          status: "ACCEPTED",
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  async function rejectFriendRequest(requesterId: string) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/chat/accept_reject",
        {
          receiverId,
          requesterId,
          status: "DECLINED",
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
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
