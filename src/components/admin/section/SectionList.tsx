import { Section, SectionCard } from "./SectionCard";

export const SectionList = ({ sections }: { sections: Section[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {sections?.map((section) => (
        <SectionCard key={section.id} section={section} />
      ))}
    </div>
  );
};
