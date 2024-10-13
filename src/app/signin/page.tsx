import Signin from "@/components/Signin";
import { authOptions } from "@/lib/auth";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const SigninPage = async () => {
  const session = await getServerAuthSession();
  if (session?.user) {
    redirect("/");
  }
  return <Signin />;
};

export default SigninPage;
