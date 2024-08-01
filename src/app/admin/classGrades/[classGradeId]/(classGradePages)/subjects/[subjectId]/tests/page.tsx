"use client";

import { SubjectContext } from "@/contexts";
import { useContext, useEffect, useState } from "react";

export default function TestPage() {
  const subject = useContext(SubjectContext);

  return <div className="flex flex-col gap-4">Tests</div>;
}
