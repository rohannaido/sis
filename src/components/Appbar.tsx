"use client";

import { useRecoilState } from "recoil";
import { AppbarAuth } from "./AppbarAuth";
import { ThemeToggler } from "./landing/theme-toggler";
import { ToggleButton } from "./Sidebar";
import { sidebarOpen as sidebarOpenAtom } from "@/store/atoms/sidebar";

export const Appbar = () => {
  const [sidebarOpen, setSidebarOpen] = useRecoilState(sidebarOpenAtom);

  return (
    <>
      <nav className="fixed top-0 z-50 flex h-16 w-full items-center gap-2 border-b bg-background/80 px-4 shadow-sm backdrop-blur-md print:hidden">
        <div className="mx-auto flex w-full items-center justify-between md:max-w-screen-2xl">
          {/* TODO AFTER LOGIN TOGGLE */}
          <div className="flex gap-4">
            {
              <ToggleButton
                onClick={() => {
                  setSidebarOpen((p) => !p);
                }}
                sidebarOpen={sidebarOpen ? false : true}
              />
            }
            <div>SIS</div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden items-center justify-around space-x-3 sm:flex md:block md:w-auto">
              <AppbarAuth />
            </div>
            <ThemeToggler />
            <div className="block sm:hidden">{/* <NavigationMenu /> */}</div>
          </div>
        </div>
      </nav>
      <div className="h-16 w-full print:hidden" />
    </>
  );
};
