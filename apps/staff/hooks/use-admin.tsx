"use client";

import { useQuery } from "@tanstack/react-query";
import { getAdminStaffListAction } from "@/action/admin.action";

const useAdmin = () => {
  return useQuery({
    queryKey: ["admin", "list"],
    queryFn: () => getAdminStaffListAction(),
    staleTime: 1000 * 60 * 5,
  });
};

export default useAdmin;
