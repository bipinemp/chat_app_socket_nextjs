"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormatDate from "@/hooks/FormatDate";
import axios from "axios";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { Send } from "lucide-react";

const socket = io("ws://localhost:8000");

interface ChatMessage {
  id?: string;
  message: string;
  senderId?: string;
  receiverId?: string;
  createdAt?: string;
  image?: string;
  username?: string;
}

function createRoomId(senderId: string, receiverId: string) {
  const sortedIds = [senderId, receiverId].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
}

const Page = ({ params }: { params: { id: string } }) => {
  const session = useSession();
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/chat/getmessages?t=${params.id}`
        );

        setChatMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInitialMessages();
  }, [params.id]);

  useEffect(() => {
    const userData = session?.data?.user;

    const roomId = createRoomId(session?.data?.user?.id || "", params?.id);

    if (roomId) {
      setRoomId(roomId);
      socket.emit("joinRoom", { userData, roomId });
    }

    const handleChatMessage = (message: ChatMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("chatMessage", handleChatMessage);

    return () => {
      // Clean up the event listener when the component is unmounted
      socket.off("chatMessage", handleChatMessage);
    };
  }, [session?.data?.user]);

  async function sendMessage() {
    try {
      await axios.post("http://localhost:3000/api/chat/sendmsg", {
        receiverId: params.id,
        senderId: session?.data?.user?.id,
        message,
        image: session?.data?.user?.image || "",
        username: session?.data?.user?.username,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ChatMessage = {
      senderId: session?.data?.user?.id,
      createdAt: Date.now(),
      image: session?.data?.user?.image || null,
      username: session?.data?.user?.username,
      message,
    };
    if (message.trim() !== "") {
      socket.emit("chatMessage", ChatMessage, roomId);
      sendMessage();
      setMessage("");
    }
  };

  return (
    <div className="w-full py-7 flex flex-col gap-5">
      <div className="border-b border-b-primary pb-6 px-5">
        <h2>UserDetail</h2>
      </div>

      <div className="flex flex-col-reverse gap-5 h-[400px] overflow-scroll overflow-x-hidden px-5 py-4">
        {chatMessages.length !== 0 &&
          chatMessages.map((chat) => {
            const isSender = chat.senderId === session?.data?.user?.id;

            return (
              <div key={chat.id} className="w-full">
                <div
                  className={clsx("flex flex-col", {
                    "items-end": isSender,
                    "items-start": !isSender,
                  })}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="self-end">
                      {chat.image === "" || chat.image === null ? (
                        <div className="w-[45px] h-[45px] relative bg-destructive rounded-full flex items-center justify-center">
                          <span className="absolute text-secondary font-bold text-lg">
                            {chat.username?.charAt(0)}
                          </span>
                        </div>
                      ) : (
                        <Image
                          src={chat.image || ""}
                          width={45}
                          height={45}
                          alt="profile_image"
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">
                        {FormatDate(chat.createdAt || "")}
                      </span>
                      <p
                        className={clsx("py-3 px-8", {
                          "text-secondary bg-primary rounded-full": isSender,
                          "text-primary bg-zinc-200 rounded-full": !isSender,
                        })}
                      >
                        {chat.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <form
        onSubmit={handleSendMessage}
        className="px-5 flex items-center gap-4"
      >
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border-primary py-6"
          placeholder="Enter a message..."
        />
        <Button className="py-6 flex items-center gap-3">
          <Send className="w-5 h-5" />
          Send
        </Button>
      </form>
    </div>
  );
};

export default Page;
