"use client";

import Sidebar from "@/components/chats/Sidebar";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex">
      <Sidebar session={session} />
      {children}
    </div>
  );
}
