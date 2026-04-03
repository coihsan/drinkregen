"use client";

import { createStaffAction, getStaffAction } from "@/action/staff.action";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useStaff() {
  const queryClient = useQueryClient();

  // Query untuk mengambil data
  const staffQuery = useQuery({
    queryKey: ["staff", "list"],
    queryFn: () => getStaffAction(),
    staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit
  });

  // Mutation untuk menambah data
  const createMutation = useMutation({
    mutationFn: createStaffAction,
    onSuccess: () => {
      // Invalidate cache agar UI otomatis update
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  });

  return {
    staffs: staffQuery.data ?? [],
    isLoading: staffQuery.isLoading,
    isError: staffQuery.isError,
    createStaff: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}