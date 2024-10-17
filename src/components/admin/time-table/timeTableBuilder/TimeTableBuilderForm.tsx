import React from 'react';
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SlotGroupPage from "../SlotGroupPage";
import { Skeleton } from '@/components/ui/skeleton';
import { useTimeTableContexts } from './TimeTableSelectionContexts';

interface TimeTableFormProps {
    slotGroups: any[];
    classGrades: any[];
    sections: any[];
    subjects: any[];
    teachers: any[];
    timeTableLength: number;
    isSlotGroupsLoading: boolean;
    isClassGradesLoading: boolean;
    isSectionsLoading: boolean;
    isSubjectsLoading: boolean;
    isTeachersLoading: boolean;
}

const TimeTableBuilderForm: React.FC<TimeTableFormProps> = ({
    slotGroups,
    isSlotGroupsLoading,
    classGrades,
    isClassGradesLoading,
    sections,
    isSectionsLoading,
    subjects,
    isSubjectsLoading,
    teachers,
    isTeachersLoading,
    timeTableLength,
}) => {
    const [slotGroupDialogOpen, setSlotGroupDialogOpen] = React.useState<boolean>(false);

    const { slotGroup, setSlotGroup, classGrade, setClassGrade, section, setSection, subject, setSubject, teacher, setTeacher } = useTimeTableContexts();

    return (
        <div className="grid grid-cols-5 gap-4">
            <div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="slotGroup">Slot Group</Label>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setSlotGroupDialogOpen(true);
                        }}
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only">Edit/Create Slot Group</span>
                    </Button>
                </div>
                <Dialog open={slotGroupDialogOpen} onOpenChange={setSlotGroupDialogOpen}>
                    <DialogContent className="h-screen min-w-[800px] m-0 p-0">
                        <SlotGroupPage />
                    </DialogContent>
                </Dialog>
                {isSlotGroupsLoading ? <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-500 mx-auto"></div> : <Select
                    value={slotGroup?.id?.toString() || ""}
                    onValueChange={(value) => {
                        setSlotGroup(slotGroups.find((slotGroup) => slotGroup.id?.toString() === value));
                    }}
                    disabled={timeTableLength > 0}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select slot group" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {slotGroups?.map((slotGroup) => (
                                <SelectItem
                                    key={slotGroup.id}
                                    value={slotGroup.id.toString()}
                                >
                                    {slotGroup.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                }
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="classGrade">Class</Label>
                    <div className="h-8 w-8 p-0"></div>
                </div>
                {isClassGradesLoading ? <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-500 mx-auto"></div> : <Select
                    value={classGrade?.id?.toString() || ""}
                    onValueChange={(value) => {
                        setClassGrade(classGrades.find((classGrade) => classGrade.id?.toString() === value));
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {classGrades?.map((classGrade) => (
                                <SelectItem
                                    key={classGrade.id}
                                    value={classGrade.id.toString()}
                                >
                                    {classGrade.title}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                }
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="section">Section</Label>
                    <div className="h-8 w-8 p-0"></div>
                </div>
                {isSectionsLoading ? <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-500 mx-auto"></div> : <Select
                    value={section?.id?.toString() || ""}
                    onValueChange={(value) => {
                        setSection(sections.find((section) => section.id?.toString() === value));
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            {sections?.map((section) => (
                                <SelectItem
                                    key={section.id}
                                    value={section.id.toString()}
                                >
                                    {section.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                }
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="subject">Subject</Label>
                    <div className="h-8 w-8 p-0"></div>
                </div>
                {isSubjectsLoading ? <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-500 mx-auto"></div> : <Select
                    value={subject?.id?.toString() || ""}
                    onValueChange={(value) => {
                        setSubject(subjects.find((subject) => subject.id?.toString() === value));
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            {subjects?.map((subject) => (
                                <SelectItem
                                    key={subject.id}
                                    value={subject.id.toString()}
                                >
                                    {subject.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                }
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="teacher">Teacher</Label>
                    <div className="h-8 w-8 p-0"></div>
                </div>
                {isTeachersLoading ? <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-500 mx-auto"></div> : <Select
                    value={teacher?.id?.toString() || ""}
                    onValueChange={(value) => {
                        setTeacher(teachers.find((teacher) => teacher.id?.toString() === value));
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            {teachers?.map((teacher) => (
                                <SelectItem
                                    key={teacher.id}
                                    value={teacher.id.toString()}
                                >
                                    {teacher.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                }
            </div>
        </div>
    );
};

export default TimeTableBuilderForm;

