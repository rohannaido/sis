import { useQuery } from '@tanstack/react-query';

export const fetchSectionsForClassGrade = async (classGradeId: number | null) => {
    if (!classGradeId) {
        return [];
    }

    const url = `/api/admin/classGrades/${classGradeId}/sections`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch sections!");
    }

    return res.json();
};

export const useSectionsForClassGrade = (classGradeId: number | null) => {
    return useQuery({
        queryKey: ['sections', classGradeId],
        queryFn: () => fetchSectionsForClassGrade(classGradeId),
    });
};
