import { LandingPage } from "@/components/landing/landing-page";
import {  getServerAuthSession } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { redirect } from "next/navigation";

const getUserDetails = async () => {
  const session = await getServerAuthSession();
  return session;
};

export default async function Home() {
  const session = await getUserDetails();

  if (session?.user?.isAdmin) {
    redirect("/admin");
  }

  if (session?.user) {
    return (
      <main className="no-scrollbar mx-auto flex h-full max-w-screen-xl flex-col overflow-y-auto pb-6 pt-10 text-lg">
        Loggedin
      </main>
    );
  }
  return (
    <main className="pb-20 pt-36">
      <LandingPage />
    </main>
  );
}
