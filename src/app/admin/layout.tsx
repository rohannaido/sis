import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { Sidebar } from "@/components/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("TEST ADMIN");
  const session = await getServerSession();

  if (!session || !session.user) {
    return redirect("/signin");
  }

  if (!process.env.ADMINS?.split(",").includes(session.user.email!)) {
    return notFound();
  }

  return (
    <>
      <div className="relative flex min-h-screen">
        <Sidebar />
        <div className="no-scrollbar grow overflow-y-auto p-2">{children}</div>
      </div>
    </>
  );
}
