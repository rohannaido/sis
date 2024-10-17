import { forwardRef } from "react";
import TimeTableBuilder, { TimeTableBuilderProps, TimeTableBuilderRef } from "./TimeTableBuilder";
import { TimeTableSelectionProvider } from "./TimeTableSelectionContexts";

export const TimeTableBuilderWrapped = forwardRef<TimeTableBuilderRef, TimeTableBuilderProps>(
    (
        props: {
            type?: string;
            timeTableId?: string;
        },
        ref
    ) => {
        return (
            <TimeTableSelectionProvider>
                <TimeTableBuilder {...props} ref={ref} />
            </TimeTableSelectionProvider>
        );
    });