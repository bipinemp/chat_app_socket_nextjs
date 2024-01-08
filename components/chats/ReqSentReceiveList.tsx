"use client";

import { FC } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReqSentReceiveListProps {
  idd: string;
  friendReqs: any[];
}

const ReqSentReceiveList: FC<ReqSentReceiveListProps> = ({
  friendReqs,
  idd,
}) => {
  async function acceptFriendRequest(requesterId: string) {
    try {
      console.log(idd, requesterId);
      const response = await axios.post(
        "http://localhost:3000/api/chat/accept",
        {
          receiverId: idd,
          requesterId,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  function declineFriendRequest(requesterId: string) {
    try {
      const response = axios.post("http://localhost:3000/api/chat/accept", {
        receiverId: idd,
        requesterId,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="p-5 border border-primary rounded-lg flex flex-col gap-5 mt-10 w-[600px]">
        <h1>Sent Friend Requests: </h1>

        <div className="flex flex-col gap-3">
          {friendReqs?.sentFriendRequests.map((req) => (
            <div key={req.id} className="flex items-center justify-between">
              <h3>{req.receiver?.username}</h3>
              {/* <div className="flex items-center gap-4">
                <Button>
                  <Check className="w-5 h-5" />
                </Button>
                <Button variant="destructive">
                  <X className="w-5 h-5" />
                </Button>
              </div> */}
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 border border-primary rounded-lg flex flex-col gap-5 mt-10 w-[600px]">
        <h1>Received Friend Requests: </h1>

        <div className="flex flex-col gap-3">
          {friendReqs?.receivedFriendRequests.map((req) => (
            <div key={req.id} className="flex items-center justify-between">
              <h3>{req.requester?.username}</h3>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => acceptFriendRequest(req?.requester?.id || "")}
                >
                  <Check className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => declineFriendRequest(req?.requester?.id || "")}
                  variant="destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReqSentReceiveList;
