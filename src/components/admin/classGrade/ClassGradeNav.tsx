import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClassGradeNav({
  classGradeId,
}: {
  classGradeId: number;
}) {
  const pathname = usePathname();
  const routeList = [
    {
      name: "Subjects",
      href: `/admin/classGrades/${classGradeId}/subjects`,
    },
    {
      name: "Sections",
      href: `/admin/classGrades/${classGradeId}/sections`,
    },
    {
      name: "Settings",
      href: `/admin/classGrades/${classGradeId}/settings`,
    },
  ];

  return (
    <div className="relative">
      <div className="max-w-[600px] lg:max-w-none">
        <div
          className={cn(
            "mb-4 flex items-center",
            "[&>a:first-child]:text-primary"
          )}
        >
          {routeList.map((routeItem, index) => (
            <Link
              href={routeItem.href}
              key={routeItem.href}
              className={cn(
                "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
                pathname?.startsWith(routeItem.href) ||
                  (index === 0 &&
                    pathname === `/admin/classGrades/${classGradeId}`)
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
