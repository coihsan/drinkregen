"use client";

import {
  archiveStaff,
  createStaffAction,
  getDivision,
  getStaffAction,
  getStaffDataArchived,
  togglePublishStaff,
  toggleUnpublishStaff,
  unArchiveStaff,
  updateStaff,
} from "@/action/staff.action";
import { updateStaffSchema } from "@lib/schema/staff.schema";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateStaffPayload = {
  id: string;
  data: z.infer<typeof updateStaffSchema>;
};

export function useStaff() {
  const queryClient = useQueryClient();

  // Query untuk mengambil data
  const staffQuery = useQuery({
    queryKey: ["staff", "list"],
    queryFn: () => getStaffAction(),
    staleTime: 1000 * 60 * 5, // 5 menit
  });

  // Mutation untuk menambah data
  const createMutation = useMutation({
    mutationFn: createStaffAction,
    onSuccess: () => {
      // Invalidate cache agar UI otomatis update
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  });

  const staffArchiveMutation = useMutation({
    mutationFn: archiveStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  });

  const unArchiveMutation = useMutation({
    mutationFn: (id: string) => unArchiveStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: (id: string) => togglePublishStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  })

  const toggleUnpublishMutation = useMutation({
    mutationFn: (id: string) => toggleUnpublishStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  })

  const archivedQuery = useQuery({
    queryKey: ["staff", "archived"],
    queryFn: () => getStaffDataArchived(),
    staleTime: 1000 * 60 * 5,
  });

  const getDivisionQuery = useQuery({
    queryKey: ["division", "list"],
    queryFn: () => getDivision(),
    staleTime: 1000 * 60 * 60, // 1 jam
  });

  const updateDataStaff = useMutation({
    mutationFn: ({ id, data }: UpdateStaffPayload) => updateStaff(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
      queryClient.invalidateQueries({ queryKey: ["staff", "archived"] });
    },
  });

  return {
    staffs: staffQuery.data ?? [],
    isLoading: staffQuery.isLoading,
    isError: staffQuery.isError,
    createStaff: createMutation.mutate,
    isCreating: createMutation.isPending,
    archiveStaff: staffArchiveMutation.mutate,
    unArchive : unArchiveMutation.mutate,
    togglePublish: togglePublishMutation.mutate,
    toggleUnpublish: toggleUnpublishMutation.mutate,
    fetchStaffArchived: archivedQuery.data ?? [],
    isArchivedLoading: archivedQuery.isLoading,
    archivedCount: archivedQuery.data?.length ?? 0,
    divisions: getDivisionQuery.data ?? [],
    updateDataStaff: updateDataStaff.mutate,
    updateDataStaffAsync: updateDataStaff.mutateAsync,
    isUpdatingStaff: updateDataStaff.isPending,
  };
}
