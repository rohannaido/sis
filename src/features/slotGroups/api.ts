
import { useQuery } from '@tanstack/react-query';

export const fetchSlotGroups = async () => {
    const url = `/api/admin/slot-groups`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch slot groups!");
    }

    return res.json();
};

export const useSlotGroups = () => {
    return useQuery({
        queryKey: ['slotGroups'],
        queryFn: fetchSlotGroups,
    });
};
