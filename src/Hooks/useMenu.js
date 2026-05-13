import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "../Utils/api";

export const useMenuQueries = () => {
    const queryClient = useQueryClient();

    const menuQuery = useQuery({
        queryKey: ['menu'],
        queryFn: () => apis.get('menu/menus'),
        staleTime: 1000 * 60 * 10,
    });

    const addMutation = useMutation({
        mutationFn: (payload) => apis.post("menu/add", payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['menu']);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apis.post("menu/delete", id),
        onSuccess: () => {
            queryClient.invalidateQueries(['menu']);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data) => apis.put(`menu/update/${data.id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['menu']);
        },
    });

    return {
        menuData: menuQuery.data?.menus || [],
        isLoading: menuQuery.isLoading,
        isError: menuQuery.isError,
        addMenuItem: addMutation.mutateAsync,
        isAdding: addMutation.isPending,
        deleteMenuItem: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        updateMenuItem: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending
    };
};