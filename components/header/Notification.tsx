"use client";

import { useWhichUserChatOpened } from "@/store/store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import socket from "@/lib/socket";
import { Bell } from "lucide-react";
import clsx from "clsx";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";

const Notification = () => {
  const session = useSession();
  const { notifications, setNotifications, userId, markAllAsread } =
    useWhichUserChatOpened();

  useEffect(() => {
    socket.emit("join_notification", session?.data?.user?.id);

    const handleChatNotification = (notification: NotificationType) => {
      if (notification.type === "CHAT") {
        if (userId !== notification.senderId) {
          setNotifications((prev) => [notification, ...prev]);
        }
      }
      if (notification.type === "REQ") {
        setNotifications((prev) => [notification, ...prev]);
      }
    };

    socket.on("chat_notification", handleChatNotification);

    return () => {
      // Clean up the event listener when the component is unmounted
      socket.off("chat_notification", handleChatNotification);
    };
  }, [userId, session?.data?.user?.id]);

  const [unReadNotificationCount, setUnReadNotificationCount] = useState(0);
  useEffect(() => {
    const unReadNotifications = notifications.filter(
      (notification) => !notification.read
    );
    setUnReadNotificationCount(unReadNotifications.length);
  }, [notifications]);

  return (
    <Menubar className="w-fit p-0 bg-transparent border-none">
      <MenubarMenu>
        <MenubarTrigger
          onClick={() => markAllAsread()}
          className="relative w-fit bg-transparent p-0 border-none focus:bg-secondary/20 data-[state=open]:bg-secondary/20 data-[state=close]:bg-primary rounded-full"
        >
          <Bell className="text-secondary w-10 h-10 p-2 rounded-full hover:bg-secondary/20 transition cursor-pointer" />
          {unReadNotificationCount > 0 && (
            <span className="absolute right-0 text-xs top-0 bg-destructive w-[20px] h-[20px] flex items-center justify-center rounded-full">
              {unReadNotificationCount}
            </span>
          )}
        </MenubarTrigger>
        {notifications.length > 0 && (
          <MenubarContent className="w-full">
            <>
              {notifications.map((msg, index) => (
                <MenubarItem key={index} className="w-full">
                  <Link
                    href={`/chats/${msg.senderId}`}
                    className={clsx("w-full py-2 px-3 cursor-pointer", {
                      "border-b border-primary":
                        notifications.length !== index + 1,
                    })}
                  >
                    <b>{msg.username} :</b> {msg.message}
                  </Link>
                </MenubarItem>
              ))}
            </>
          </MenubarContent>
        )}
      </MenubarMenu>
    </Menubar>
  );
};

export default Notification;
