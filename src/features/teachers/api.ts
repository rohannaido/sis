import { useQuery } from '@tanstack/react-query';

export const fetchTeachers = async (classGradeId: number | null, subjectId: number | null) => {
    const url = classGradeId && subjectId ? `/api/admin/teachers?classGradeId=${classGradeId}&subjectId=${subjectId}` : "/api/admin/teachers";

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch teachers");
    }

    return res.json();
};


export const useTeachers = (classGradeId: number | null, subjectId: number | null) => {
    return useQuery({
        queryKey: ['teachers', classGradeId, subjectId],
        queryFn: () => fetchTeachers(classGradeId, subjectId),
    });
};
