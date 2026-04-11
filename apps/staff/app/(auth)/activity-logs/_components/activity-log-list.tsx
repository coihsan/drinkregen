"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@workspace/ui/components/input";
import {
  getActivityLogsAction,
  type ActivityLogItem,
} from "@/action/activity-log.action";
import {
  formatActivityAction,
  formatActivityDetails,
} from "@/lib/activity-log-format";
import { AdminTableHeaders } from "@/lib/constant";
import SearchBar from "@/components/search-bar";

const ActivityLogList = () => {
  const [query, setQuery] = useState("");
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: () => getActivityLogsAction(),
    staleTime: 1000 * 30,
  });

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return data;
    }

    return data.filter((log) =>
      [
        log.actorEmail,
        log.targetStaffName ?? "",
        log.targetEmail ?? "",
        formatActivityAction(log.action),
        formatActivityDetails(log.details),
      ].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [data, query]);

  const totalActivity = () => {
    return data.length;
  };

  return (
    <section className="space-y-4 rounded-2xl border bg-background p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Activity Logs</h2>
          <p className="text-sm text-muted-foreground">
            Riwayat 100 aksi terakhir dari manajemen admin dan perubahan data
            staff.
          </p>
        </div>
        <SearchBar
          totalIndex={totalActivity()}
          className="w-full md:max-w-sm"
          placeHolder="Cari actor, target, aksi, detail"
          searchQuery={(value) => setQuery(value)}
        />
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b text-left text-sm">
                {AdminTableHeaders.map((data, key) => (
                  <th key={key} className="px-4 py-3 font-medium">
                    {data}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="px-4 py-8 text-sm text-muted-foreground"
                    colSpan={6}
                  >
                    Loading activity logs...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    className="px-4 py-8 text-sm text-destructive"
                    colSpan={6}
                  >
                    Gagal memuat log aktivitas.
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-8 text-sm text-muted-foreground"
                    colSpan={6}
                  >
                    Belum ada aktivitas yang tercatat.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log: ActivityLogItem) => (
                  <tr key={log.id} className="border-b text-sm align-top">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">{log.actorEmail}</td>
                    <td className="px-4 py-3">
                      {formatActivityAction(log.action)}
                    </td>
                    <td className="px-4 py-3">{log.targetStaffName ?? "-"}</td>
                    <td className="px-4 py-3">{log.targetEmail ?? "-"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatActivityDetails(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ActivityLogList;
