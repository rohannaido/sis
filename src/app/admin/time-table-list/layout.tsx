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
      <div className="">
        {children}
      </div>
    </>
  );
}
