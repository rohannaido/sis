import { ClassGrade } from "@/components/admin/classGrade/ClassGradeCard";
import { Section } from "@/components/admin/section/SectionCard";
import { Subject } from "@/components/admin/subject/SubjectCard";
import { createContext } from "react";

export const ClassGradeContext = createContext<ClassGrade | null>(null);

export const SubjectContext = createContext<Subject | null>(null);

export const SectionContext = createContext<Section | null>(null);
