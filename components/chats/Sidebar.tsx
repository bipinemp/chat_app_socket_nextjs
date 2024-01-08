import getSession from "@/app/actions/getSession";
import React from "react";
import UserCard from "./UserCard";

interface SidebarProps {
  friends: TAcceptedFriedsArr;
}

const Sidebar: React.FC<SidebarProps> = async ({ friends }) => {
  const session = await getSession();

  return (
    <div className="relative bg-zinc-100 border border-r-primary py-7 px-5 w-[300px] h-[88vh]">
      <div className="flex flex-col gap-4">
        <h2>Your Chats</h2>
        <div className="w-full flex flex-col gap-3">
          {friends.map((friend) => {
            const friendUser: UserDetail =
              friend.requester?.id === session?.user?.id
                ? friend.receiver
                : friend.requester;

            return <UserCard friendUser={friendUser} />;
          })}
        </div>
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Sidebar;
