"use client";

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { Signout } from "./Signout";
import { ProfileDropDown } from "./profile-menu/ProfileDropDown";
import Link from "next/link";

export const AppbarAuth = () => {
  const session = useSession();

  return !session?.data?.user ? (
    <>
      <Button
        size={"sm"}
        // variant={isInMenu ? 'navLink' : 'outline'}
        id="navbar-default"
        onClick={() => {
          signIn();
        }}
      >
        Log in
      </Button>
      <Link href="/signup">
        <Button size={"sm"} variant={"outline"} id="navbar-default">
          Sign up
        </Button>
      </Link>
    </>
  ) : (
    <ProfileDropDown />
    // <Signout />
  );
};
