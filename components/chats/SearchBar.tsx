"use client";

import { FC, useState } from "react";
import { Input } from "../ui/input";
import { Loader2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useDebounce from "@/hooks/useDebounce";
import FriendRequestBtn from "./FriendRequestBtn";
import { useSession } from "next-auth/react";
import clsx from "clsx";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [search, setSearch] = useState("");
  const session = useSession();

  const debouncedSearchTerm = useDebounce(search, 200);

  const { data, status } = useQuery({
    queryKey: ["searchusers", debouncedSearchTerm],
    queryFn: () => {
      if (debouncedSearchTerm) {
        return axios
          .get(`http://localhost:3000/api/chat/search?q=${debouncedSearchTerm}`)
          .then((res) => res.data);
      }
    },
    enabled: debouncedSearchTerm !== "",
  });

  // console.log("Search results : ", data?.users);

  return (
    <div>
      <h2 className="underline">Search</h2>
      <form className="relative flex flex-col">
        <span className="absolute top-3 left-2">
          <Search className="w-6 h-6" />
        </span>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Username or Email..."
          className="border-primary py-6 pl-10 focus-visible:ring-0 rounded-none"
        />
        <div
          className={clsx("mt-1 absolute w-full top-11 z-20", {
            "border border-primary": data?.users,
          })}
        >
          {status === "error" ? (
            <p className="text-center">Not Found :(</p>
          ) : status === "pending" && search !== "" ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <div>
              {data?.users.map((user: UserDetail, index: number) => (
                <div
                  key={user.id}
                  className={clsx(
                    "flex items-center bg-zinc-200 hover:bg-neutral-300 justify-between gap-5 py-2 px-6 cursor-pointer",
                    {
                      "border-b border-b-primary":
                        data?.users.length !== index + 1,
                    }
                  )}
                >
                  <p>{user.username}</p>
                  <FriendRequestBtn
                    receiverId={user.id}
                    requesterId={session?.data?.user.id || ""}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
