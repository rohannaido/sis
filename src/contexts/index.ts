import { ClassGrade } from "@/components/admin/classGrade/ClassGradeCard";
import { Subject } from "@/components/admin/subject/SubjectCard";
import { createContext } from "react";

export const ClassGradeContext = createContext<ClassGrade | null>(null);

export const SubjectContext = createContext<Subject | null>(null);
