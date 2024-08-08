import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TimeTablePage() {
  return (
    <>
      <Link href={"/admin/time-table/slot-groups"}>
        <Button>Slot Group</Button>
      </Link>
    </>
  );
}
