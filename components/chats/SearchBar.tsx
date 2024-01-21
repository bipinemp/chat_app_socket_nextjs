"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useDebounce from "@/hooks/useDebounce";
import FriendRequestBtn from "./FriendRequestBtn";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Props {
  session: any;
}

const SearchBar: React.FC<Props> = ({ session }) => {
  const [search, setSearch] = useState("");

  const debouncedSearchTerm = useDebounce(search, 200);

  const { data, status } = useQuery({
    queryKey: ["searchusers", debouncedSearchTerm],
    queryFn: () => {
      if (debouncedSearchTerm) {
        return axios
          .get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/search?q=${debouncedSearchTerm}`
          )
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
        friend?.receiver?.id === session?.user?.id ||
        friend?.requester?.id === session?.user?.id
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
                  {data?.users?.map((user: UserDetail, index: number) => {
                    return (
                      <CommandItem
                        key={user.id}
                        value={user.username}
                        className="flex items-center justify-between"
                      >
                        {!session?.user?.id && (
                          <Loader2 className="w-5 h-5 animate-spin text-center" />
                        )}
                        {session?.user?.id && (
                          <>
                            <p>{user.username}</p>
                            {user.id !== session?.user?.id &&
                              !isFriend(user) && (
                                <FriendRequestBtn
                                  receiverId={user?.id || ""}
                                  senderName={session?.user?.username}
                                  requesterId={session?.user?.id || ""}
                                  senderImage={session?.user?.image || ""}
                                />
                              )}
                          </>
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
