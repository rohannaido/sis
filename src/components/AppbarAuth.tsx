"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { Signout } from "./Signout";
import { ProfileDropDown } from "./profile-menu/ProfileDropDown";

export const AppbarAuth = () => {
  const session = useSession();

  return !session?.data?.user ? (
    <Button
      size={"sm"}
      // variant={isInMenu ? 'navLink' : 'outline'}
      id="navbar-default"
      onClick={() => {
        signIn();
      }}
    >
      Login
    </Button>
  ) : (
    <ProfileDropDown />
    // <Signout />
  );
};
