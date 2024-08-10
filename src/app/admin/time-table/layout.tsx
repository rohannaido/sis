"use client";
import TimeTableNav from "@/components/admin/time-table/TimeTableNav";
import React from "react";

export default function TimeTableLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto max-w-screen-xl justify-between p-2 text-black dark:text-white">
        <TimeTableNav />
        {children}
      </div>
    </>
  );
}
