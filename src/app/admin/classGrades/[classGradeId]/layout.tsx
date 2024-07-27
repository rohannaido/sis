"use client";

export default function ClassGradeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { classGradeId: string };
}) {
  return (
    <div className="mx-auto max-w-screen-xl justify-between p-2 text-black dark:text-white">
      {children}
    </div>
  );
}
