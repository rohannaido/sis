"use client";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { sidebarOpen as sidebarOpenAtom } from "@/store/atoms/sidebar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpenIcon, HomeIcon, Library } from "lucide-react";

export function LibrarySidebar({}: {}) {
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
    <div className="w-[200px] min-w-[200px] flex-col border-r bg-background p-4 md:flex absolute z-20 sm:sticky sm:top-[64px] sm:h-sidebar">
      <nav className="flex flex-col gap-2">
        <Link
          href="/library/books"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <Library className="h-5 w-5" />
          Books
        </Link>
        <Link
          href="/library/borrowed-books"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <BookOpenIcon className="h-5 w-5" />
          Borrowed Books
        </Link>
      </nav>
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
