import { useQuery } from '@tanstack/react-query';

export const fetchClassGrades = async () => {
    const url = `/api/admin/classGrades`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch class!");
    }

    return res.json();
};

export const useClassGrades = () => {
    return useQuery({
        queryKey: ['classGrades'],
        queryFn: fetchClassGrades,
    });
};
