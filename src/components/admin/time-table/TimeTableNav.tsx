import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TimeTableNav() {
  const pathname = usePathname();
  const routeList = [
    {
      name: "Slot Groups",
      href: `/admin/time-table/slot-groups`,
    },
    {
      name: "Class Subjects",
      href: `/admin/time-table/class-subjects`,
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
                  (index === 0 && pathname === `/admin/time-table`)
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
