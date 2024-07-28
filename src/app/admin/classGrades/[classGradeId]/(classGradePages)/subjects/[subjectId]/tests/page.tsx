"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { SubjectContext } from "../layout";

export default function TestPage() {
  const subject = useContext(SubjectContext);

  return <div className="flex flex-col gap-4">Tests</div>;
}
