"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWhichUserChatOpened } from "@/store/store";

interface Props {
  children: React.ReactNode;
}

const PathTracker: React.FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const { setUserId } = useWhichUserChatOpened();
  useEffect(() => {
    if (!pathname.startsWith("/chats/")) {
      setUserId("");
    }
  }, [pathname]);
  return <div>{children}</div>;
};

export default PathTracker;
