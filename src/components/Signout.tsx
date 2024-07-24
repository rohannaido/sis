"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export const Signout = () => {
  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      id="navbar-default"
      onClick={() => {
        signOut();
      }}
    >
      Logout
    </Button>
  );
};
