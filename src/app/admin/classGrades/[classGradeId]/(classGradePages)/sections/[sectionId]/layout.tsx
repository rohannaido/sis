"use client";

import { Section } from "@/components/admin/section/SectionCard";
import SectionNav from "@/components/admin/section/SectionNav";
import { SectionContext } from "@/contexts";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    sectionId: string;
    classGradeId: string;
  };
}) {
  const [section, setSection] = useState<Section | null>(null);

  async function fetchSection() {
    try {
      const response = await fetch(`/api/admin/sections/${params.sectionId}`);
      const data = await response.json();
      setSection(data);
    } catch (e) {
      toast.error("Something went wrong while searching for subject");
    } finally {
    }
  }

  useEffect(() => {
    fetchSection();
  }, []);

  return (
    <SectionContext.Provider value={section}>
      <div className="font-bold md:text-xl lg:text-xl">
        Section - {section?.name}
      </div>
      {section ? (
        <div className="flex mt-4">
          <div className="w-3/12 mr-4">
            <SectionNav></SectionNav>
          </div>
          <div className="w-full">{children}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </SectionContext.Provider>
  );
}
