import Link from "next/link";
import React from "react";
import Container from "../Container";
import { Button } from "../ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LogOut from "./LogOut";
import Notification from "./Notification";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-foreground py-5">
      <Container>
        <ul className="flex items-center justify-between text-background">
          <li>
            <Link href={"/"}>Home</Link>
          </li>

          <li>
            {session?.user?.email ? (
              <div className="flex items-center gap-4">
                <Notification id={session?.user?.id} />
                <p>{session?.user?.username}</p>
                <Link href={"/chats"}>Chats</Link>
                <LogOut />
              </div>
            ) : (
              <Link href={"/login"}>
                <Button variant="secondary">Login</Button>
              </Link>
            )}
          </li>
        </ul>
      </Container>
    </nav>
  );
};

export default Navbar;
