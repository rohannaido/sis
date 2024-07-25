"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "./ui/button";
import { BackArrow } from "@/icons/BackArrow";
import { useRecoilState } from "recoil";
import { sidebarOpen as sidebarOpenAtom } from "@/store/atoms/sidebar";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Sidebar({}: {}) {
  const pathName = usePathname();

  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarOpenAtom);

  useEffect(() => {
    if (window.innerWidth < 500) {
      setSidebarOpen(false);
    }
  }, []);

  if (!sidebarOpen) {
    return null;
  }

  return (
    //
    <div className="absolute z-20 h-full w-[300px] min-w-[300px] cursor-pointer self-start overflow-y-scroll bg-gray-50 dark:bg-gray-800 sm:top-[64px] sm:sticky sm:h-sidebar">
      <div className="flex">{/* <GoBackButton /> */}</div>
      {/* TODO: render pages */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Academics</AccordionTrigger>
          <AccordionContent>
            <Link
              key="classes"
              href="/admin/classGrades"
              className={`flex cursor-pointer border-b p-2 hover:bg-gray-700`}
            >
              <div className="flex w-full justify-between">
                <div className="flex">
                  <div>{"Classes"}</div>
                </div>
              </div>
            </Link>
          </AccordionContent>
          <AccordionContent>
            <Link
              key="sections"
              href="/admin/sections"
              className={`flex cursor-pointer border-b p-2 hover:bg-gray-700`}
            >
              <div className="flex w-full justify-between">
                <div className="flex">
                  <div>{"Sections"}</div>
                </div>
              </div>
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function ToggleButton({
  onClick,
  sidebarOpen,
}: {
  onClick: () => void;
  sidebarOpen: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center"
    >
      <span
        className={`block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out dark:bg-white ${
          !sidebarOpen ? "translate-y-1 rotate-45" : "-translate-y-0.5"
        }`}
      ></span>
      <span
        className={`my-0.5 block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out dark:bg-white ${
          !sidebarOpen ? "opacity-0" : "opacity-100"
        }`}
      ></span>
      <span
        className={`block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out dark:bg-white ${
          !sidebarOpen ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
        }`}
      ></span>
    </button>
  );
}
