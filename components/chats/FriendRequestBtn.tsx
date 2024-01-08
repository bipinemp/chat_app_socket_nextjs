"use client";

import { FC } from "react";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import axios from "axios";

interface FriendRequestBtnProps {
  requesterId: string;
  receiverId: string;
}

const FriendRequestBtn: FC<FriendRequestBtnProps> = ({
  requesterId,
  receiverId,
}) => {
  const sendFriendReqest = () => {
    try {
      const response = axios.post(
        "http://localhost:3000/api/chat/friendrequest",
        {
          receiverId,
          requesterId,
        }
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button onClick={sendFriendReqest}>
        <UserPlus className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default FriendRequestBtn;
