import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apis } from "../Utils/api";
import { useUser } from "../components/Context/useUser";

export const useOrdernQueries = () => {
    const queryClient = useQueryClient();

    const ordernQuery = useQuery({
        queryKey: ['ordern'],
        queryFn: () => apis.get('ordern/orderns'),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 60,
        refetctOnWindowsFocus: true,
        retry: 2,
        networkMode: 'offlineFirst'
    });

    const addMutation = useMutation({
        mutationFn: (data) => apis.post("ordern/add", data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['ordern'] });
        },
        onError: (error) => {
            console.error("Hubo un error:", error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data) => apis.put("ordern/update", data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['ordern'] });
        },
        onError: (error) => {
            console.error("Hubo un error:", error);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => apis.post("ordern/delete", id),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['ordern'] });
        },
        onError: (error) => {
            console.error("Hubo un error:", error);
        }
    });

    return {
        ordernData: ordernQuery.data?.orderns || [],
        isLoading: ordernQuery.isLoading,
        isError: ordernQuery.isError,
        addOrdernItem: addMutation.mutateAsync,
        isAdding: addMutation.isPending,
        deleteOrdernItem: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,
        updateOrdernItem: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending
    };
};