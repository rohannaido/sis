import { notFound, redirect } from "next/navigation";
import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { getServerAuthSession, UserSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session || !session.user) {
    return redirect("/signin");
  }

  if (!(session as UserSession).user.isAdmin) {
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
