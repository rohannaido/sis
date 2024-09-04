export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="relative flex min-h-screen">
        <div className="no-scrollbar grow overflow-y-auto mx-auto max-w-screen-xl justify-between p-2 text-black dark:text-white">
          {children}
        </div>
      </div>
    </>
  );
}
