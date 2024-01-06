"use client";

import React from "react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export default function LogOut() {
  return (
    <Button variant="secondary" onClick={() => signOut()}>
      LogOut
    </Button>
  );
}
