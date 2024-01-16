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
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

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
      return [];
    },
    enabled: debouncedSearchTerm !== "",
  });

  const isFriend = (user: any) => {
    const friends = [
      ...user.sentFriendRequests,
      ...user.receivedFriendRequests,
    ];
    return friends.some(
      (friend) =>
        friend?.receiver?.id === session?.data?.user?.id ||
        friend?.requester?.id === session?.data?.user?.id
    );
  };

  return (
    <div>
      <h2 className="underline">Search</h2>
      <Command className="border border-primary">
        <form className="relative flex flex-col">
          <CommandInput
            value={search}
            onValueChange={(e) => setSearch(e)}
            placeholder="Username or Email..."
          />
          <CommandList>
            <CommandGroup>
              {status === "error" ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : status === "pending" && search !== "" ? (
                <CommandItem>
                  <Loader2 className="w-5 h-5 animate-spin" />
                </CommandItem>
              ) : (
                <>
                  {data?.users.map((user: UserDetail, index: number) => {
                    return (
                      <CommandItem
                        key={user.id}
                        value={user.username}
                        className="flex items-center justify-between"
                      >
                        <p>{user.username}</p>
                        {user.id !== session?.data?.user?.id &&
                          !isFriend(user) && (
                            <FriendRequestBtn
                              receiverId={user.id || ""}
                              requesterId={session?.data?.user.id || ""}
                            />
                          )}
                      </CommandItem>
                    );
                  })}
                </>
              )}
            </CommandGroup>
          </CommandList>
        </form>
      </Command>
    </div>
  );
};

export default SearchBar;
