import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ClassGrade, Section, Subject, SlotsGroup } from '@prisma/client'; // Adjust import path as needed
export type Teacher = {
    id: number;
    name: string;
    email: string;
};

// SlotGroup Context
const SlotGroupContext = createContext<{
    slotGroup: SlotsGroup | undefined;
    setSlotGroup: (slotGroup: SlotsGroup | undefined) => void;
} | undefined>(undefined);

export const SlotGroupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [slotGroup, setSlotGroup] = useState<SlotsGroup | undefined>(undefined);
    return (
        <SlotGroupContext.Provider value={{ slotGroup, setSlotGroup }}>
            {children}
        </SlotGroupContext.Provider>
    );
};

export const useSlotGroup = () => {
    const context = useContext(SlotGroupContext);
    if (context === undefined) {
        throw new Error('useSlotGroup must be used within a SlotGroupProvider');
    }
    return context;
};

// ClassGrade Context
const ClassGradeContext = createContext<{
    classGrade: ClassGrade | undefined;
    setClassGrade: (classGrade: ClassGrade | undefined) => void;
} | undefined>(undefined);

export const ClassGradeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [classGrade, setClassGrade] = useState<ClassGrade | undefined>(undefined);
    return (
        <ClassGradeContext.Provider value={{ classGrade, setClassGrade }}>
            {children}
        </ClassGradeContext.Provider>
    );
};

export const useClassGrade = () => {
    const context = useContext(ClassGradeContext);
    if (context === undefined) {
        throw new Error('useClassGrade must be used within a ClassGradeProvider');
    }
    return context;
};

// Section Context
const SectionContext = createContext<{
    section: Section | undefined;
    setSection: (section: Section | undefined) => void;
} | undefined>(undefined);

export const SectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [section, setSection] = useState<Section | undefined>(undefined);
    return (
        <SectionContext.Provider value={{ section, setSection }}>
            {children}
        </SectionContext.Provider>
    );
};

export const useSection = () => {
    const context = useContext(SectionContext);
    if (context === undefined) {
        throw new Error('useSection must be used within a SectionProvider');
    }
    return context;
};

// Subject Context
const SubjectContext = createContext<{
    subject: Subject | undefined;
    setSubject: (subject: Subject | undefined) => void;
} | undefined>(undefined);

export const SubjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [subject, setSubject] = useState<Subject | undefined>(undefined);
    return (
        <SubjectContext.Provider value={{ subject, setSubject }}>
            {children}
        </SubjectContext.Provider>
    );
};

export const useSubject = () => {
    const context = useContext(SubjectContext);
    if (context === undefined) {
        throw new Error('useSubject must be used within a SubjectProvider');
    }
    return context;
};

// Teacher Context
const TeacherContext = createContext<{
    teacher: Teacher | undefined;
    setTeacher: (teacher: Teacher | undefined) => void;
} | undefined>(undefined);

export const TeacherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [teacher, setTeacher] = useState<Teacher | undefined>(undefined);
    return (
        <TeacherContext.Provider value={{ teacher, setTeacher }}>
            {children}
        </TeacherContext.Provider>
    );
};

export const useTeacher = () => {
    const context = useContext(TeacherContext);
    if (context === undefined) {
        throw new Error('useTeacher must be used within a TeacherProvider');
    }
    return context;
};

export const TimeTableSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <SlotGroupProvider>
            <ClassGradeProvider>
                <SectionProvider>
                    <SubjectProvider>
                        <TeacherProvider>
                            {children}
                        </TeacherProvider>
                    </SubjectProvider>
                </SectionProvider>
            </ClassGradeProvider>
        </SlotGroupProvider>
    );
};

// Combined hook for convenience
export const useTimeTableContexts = () => {
    const { slotGroup, setSlotGroup } = useSlotGroup();
    const { classGrade, setClassGrade } = useClassGrade();
    const { section, setSection } = useSection();
    const { subject, setSubject } = useSubject();
    const { teacher, setTeacher } = useTeacher();

    return { slotGroup, setSlotGroup, classGrade, setClassGrade, section, setSection, subject, setSubject, teacher, setTeacher };
};