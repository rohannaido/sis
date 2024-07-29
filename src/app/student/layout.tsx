import { StudentSidebar } from "@/components/StudentSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative flex min-h-screen">
        <StudentSidebar />
        <div className="no-scrollbar grow overflow-y-auto p-2">{children}</div>
      </div>
    </>
  );
}
