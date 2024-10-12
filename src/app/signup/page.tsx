import SignUp from "@/components/SignUp";
import { authOptions } from "@/lib/auth";
import {  getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const SigninPage = async () => {
  const session = await getServerAuthSession(authOptions);
  if (session?.user) {
    redirect("/");
  }
  return <SignUp />;
};

export default SigninPage;
