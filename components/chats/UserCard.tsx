"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface UserCardProps {
  friendUser: UserDetail;
}

const UserCard: FC<UserCardProps> = ({ friendUser }) => {
  const pathname = usePathname();

  return (
    <Link
      href={`/chats/${friendUser.id}`}
      className={clsx(
        "w-[250px] bg-neutral-300 px-2 py-3 rounded-xl flex items-center gap-4 border-[2px]",
        {
          "border-[2px] border-primary":
            pathname.split("/")[2] === friendUser.id,
        }
      )}
    >
      {friendUser.image === "" || friendUser.image === null ? (
        <div className="w-[45px] h-[45px] relative bg-destructive rounded-full flex items-center justify-center">
          <span className="absolute text-secondary font-bold text-lg">
            {friendUser.username?.charAt(0)}
          </span>
        </div>
      ) : (
        <Image
          src={friendUser.image || ""}
          width={45}
          height={45}
          alt="profile_image"
          className="rounded-full"
        />
      )}
      <p>{friendUser?.username}</p>
    </Link>
  );
};

export default UserCard;
