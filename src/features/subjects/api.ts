import { useQuery } from '@tanstack/react-query';

export const fetchSubjectsForClassGrade = async (classGradeId: number | null) => {
    if (!classGradeId) {
        return [];
    }

    const url = `/api/admin/classGrades/${classGradeId}/subjects`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch subjects!");
    }

    return res.json();
};

export const useSubjectsForClassGrade = (classGradeId: number | null) => {
    return useQuery({
        queryKey: ['subjects', classGradeId],
        queryFn: () => fetchSubjectsForClassGrade(classGradeId),
    });
};
