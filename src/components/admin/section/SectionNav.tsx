import { ClassGradeContext, SectionContext } from "@/contexts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

export default function SectionNav() {
  const classGrade = useContext(ClassGradeContext);
  const section = useContext(SectionContext);
  const pathname = usePathname();
  const routeList = [
    {
      name: "Students",
      href: `/admin/classGrades/${classGrade?.id}/sections/${section?.id}/students`,
    },
    {
      name: "Time Table",
      href: `/admin/classGrades/${classGrade?.id}/sections/${section?.id}/time-table`,
    },
  ];

  return (
    <div className="relative">
      <div className="max-w-[600px] lg:max-w-none">
        <div
          className={cn("mb-4 flex flex-col", "[&>a:first-child]:text-primary")}
        >
          {routeList.map((routeItem, index) => (
            <Link
              href={routeItem.href}
              key={routeItem.href}
              className={cn(
                "flex h-7 items-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
                pathname?.startsWith(routeItem.href) ||
                  (index === 0 &&
                    pathname ===
                      `/admin/classGrades/${classGrade?.id}/sections/${section?.id}`)
                  ? "bg-muted font-medium text-primary"
                  : "text-muted-foreground"
              )}
            >
              {routeItem.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
