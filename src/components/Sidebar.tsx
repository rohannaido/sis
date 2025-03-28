"use client";
import { usePathname, useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { sidebarOpen as sidebarOpenAtom } from "@/store/atoms/sidebar";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock8,
  HomeIcon,
  Library,
  LibraryBig,
  Share,
  SquareLibrary,
  UserRoundPen,
  UsersRound,
} from "lucide-react";

export function Sidebar({ }: {}) {
  const pathName = usePathname();

  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarOpenAtom);
  const [libraryMenuOpen, setLibraryMenuOpen] = useState(false);

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
    <div
      className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-[200px] min-w-[200px] flex-col border-r bg-background p-4 md:flex absolute z-20 sm:sticky sm:top-[64px] sm:h-sidebar transition-transform duration-300`}
    >
      <nav className="flex flex-col gap-2">
        {/* <Link
          href="/admin"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <HomeIcon className="h-5 w-5" />
          Dashboard
        </Link> */}
        {/* <div>
          <div
            onClick={() => setLibraryMenuOpen(!libraryMenuOpen)}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LibraryBig className="h-5 w-5" />
            Library
          </div>
          {libraryMenuOpen && (
            <div className="ml-4">
              <Link
                href="/admin/library/books"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                prefetch={false}
              >
                <Library className="h-5 w-5" />
                Books
              </Link>
              <Link
                href="/admin/library/book-borrows"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                prefetch={false}
              >
                <Share className="h-5 w-5" />
                Book Borrows
              </Link>
            </div>
          )}
        </div> */}
        {/* <Link
          href="/admin/active-users"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <UsersRound className="h-5 w-5" />
          Active Users
        </Link> */}
        {/* <Link
          href="/admin/students"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <SquareLibrary className="h-5 w-5" />
          Students
        </Link> */}
        <Link
          href="/admin/classGrades"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <SquareLibrary className="h-5 w-5" />
          Classes
        </Link>
        <Link
          href="/admin/teachers"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <UserRoundPen className="h-5 w-5" />
          Teachers
        </Link>
        <Link
          href="/admin/time-table-list"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          prefetch={false}
        >
          <Clock8 className="h-5 w-5" />
          Time Table
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
        className={`block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out dark:bg-white ${!sidebarOpen ? "translate-y-1 rotate-45" : "-translate-y-0.5"
          }`}
      ></span>
      <span
        className={`my-0.5 block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out dark:bg-white ${!sidebarOpen ? "opacity-0" : "opacity-100"
          }`}
      ></span>
      <span
        className={`block h-0.5 w-6 rounded-sm bg-black transition-all duration-300 ease-out dark:bg-white ${!sidebarOpen ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
          }`}
      ></span>
    </button>
  );
}
