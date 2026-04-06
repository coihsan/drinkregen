"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import {
  demoteAdminToStaffAction,
  getAdminAuditLogsAction,
  getAdminStaffListAction,
  resetAdminPasswordAction,
  updateAdminLoginEmailAction,
} from "@/action/admin.action";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const AdminList = () => {
  const [query, setQuery] = useState("");
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [resettingStaffId, setResettingStaffId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [demotingStaffId, setDemotingStaffId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortField, setSortField] = useState<
    "staffName" | "adminEmail" | "divisionName" | "position"
  >("staffName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin", "staff-list"],
    queryFn: () => getAdminStaffListAction(),
    staleTime: 1000 * 60 * 5,
  });

  const { data: auditLogs = [], isLoading: isAuditLoading } = useQuery({
    queryKey: ["admin", "audit-logs"],
    queryFn: () => getAdminAuditLogsAction(),
    staleTime: 1000 * 60,
  });

  const updateEmailMutation = useMutation({
    mutationFn: updateAdminLoginEmailAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "staff-list"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin", "audit-logs"],
      });
      toast.success("Email login admin berhasil diperbarui.");
      setEditingStaffId(null);
      setEditedEmail("");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui email login admin.",
      );
    },
  });

  const demoteMutation = useMutation({
    mutationFn: demoteAdminToStaffAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "staff-list"],
      });
      await queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin", "audit-logs"],
      });
      toast.success("Admin berhasil diturunkan menjadi staff.");
      setDemotingStaffId(null);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Gagal menurunkan admin.",
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetAdminPasswordAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "audit-logs"],
      });
      toast.success("Password admin berhasil direset.");
      setResettingStaffId(null);
      setNewPassword("");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Gagal reset password admin.",
      );
    },
  });

  const filteredAdmins = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return data.filter((admin) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && admin.activeStatus) ||
        (statusFilter === "inactive" && !admin.activeStatus);

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        admin.staffName,
        admin.staffCode,
        admin.staffEmail,
        admin.adminEmail,
        admin.position,
        admin.divisionName,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [data, query, statusFilter]);

  const sortedAdmins = useMemo(() => {
    const items = [...filteredAdmins];
    items.sort((left, right) => {
      const leftValue = left[sortField].toLowerCase();
      const rightValue = right[sortField].toLowerCase();
      const comparison = leftValue.localeCompare(rightValue, "id");
      return sortDirection === "asc" ? comparison : -comparison;
    });
    return items;
  }, [filteredAdmins, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(sortedAdmins.length / pageSize));

  const paginatedAdmins = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedAdmins.slice(startIndex, startIndex + pageSize);
  }, [page, pageSize, sortedAdmins]);

  const editingAdmin =
    data.find((admin) => admin.staffId === editingStaffId) ?? null;
  const demotingAdmin =
    data.find((admin) => admin.staffId === demotingStaffId) ?? null;
  const resettingAdmin =
    data.find((admin) => admin.staffId === resettingStaffId) ?? null;

  const openEditDialog = (staffId: string, adminEmail: string) => {
    setEditingStaffId(staffId);
    setEditedEmail(adminEmail);
  };

  return (
    <>
      <section className="space-y-4 rounded-2xl border bg-background p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Admin Staff List</h2>
            <p className="text-sm text-muted-foreground">
              Daftar seluruh staff yang sudah menjadi admin.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:max-w-xl md:flex-row">
            <Select value={sortField} onValueChange={() => setSortField}>
              <SelectTrigger>
                <SelectValue placeholder={"sort"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort</SelectLabel>
                  <SelectItem value="staffName">Staff Name</SelectItem>
                  <SelectItem value="adminEmail">Admin Email</SelectItem>
                  <SelectItem value="divisionName">Division</SelectItem>
                  <SelectItem value="position">Position</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <select
              className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm"
              value={sortDirection}
              onChange={(event) =>
                setSortDirection(event.target.value as "asc" | "desc")
              }
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
            <select
              className="h-10 rounded-lg border border-input bg-transparent px-3 text-sm"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "all" | "active" | "inactive",
                )
              }
            >
              <option value="all">Semua Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Input
              className="w-full"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, email, staff ID, division"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead className="bg-muted/50">
                <tr className="border-b text-left text-sm">
                  <th className="px-4 py-3 font-medium">Staff</th>
                  <th className="px-4 py-3 font-medium">Staff Email</th>
                  <th className="px-4 py-3 font-medium">Admin Login</th>
                  <th className="px-4 py-3 font-medium">Position</th>
                  <th className="px-4 py-3 font-medium">Division</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      className="px-4 py-8 text-sm text-muted-foreground"
                      colSpan={7}
                    >
                      Loading admin staff...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td
                      className="px-4 py-8 text-sm text-destructive"
                      colSpan={7}
                    >
                      Gagal memuat daftar admin.
                    </td>
                  </tr>
                ) : paginatedAdmins.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-8 text-sm text-muted-foreground"
                      colSpan={7}
                    >
                      Belum ada staff yang menjadi admin.
                    </td>
                  </tr>
                ) : (
                  paginatedAdmins.map((admin) => (
                    <tr key={admin.staffId} className="border-b text-sm">
                      <td className="px-4 py-3">
                        <div className="font-medium">{admin.staffName}</div>
                        <div className="text-muted-foreground">
                          RGN-{admin.staffCode}
                        </div>
                      </td>
                      <td className="px-4 py-3">{admin.staffEmail}</td>
                      <td className="px-4 py-3">{admin.adminEmail}</td>
                      <td className="px-4 py-3">{admin.position}</td>
                      <td className="px-4 py-3">{admin.divisionName}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant={
                              admin.activeStatus ? "default" : "secondary"
                            }
                          >
                            {admin.activeStatus ? "Active" : "Inactive"}
                          </Badge>
                          {admin.isProtected ? (
                            <Badge variant="secondary">Protected</Badge>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openEditDialog(admin.staffId, admin.adminEmail)
                            }
                            disabled={admin.isProtected}
                          >
                            Edit Login
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setResettingStaffId(admin.staffId);
                              setNewPassword("");
                            }}
                            disabled={admin.isProtected}
                          >
                            Reset Password
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDemotingStaffId(admin.staffId)}
                            disabled={admin.isProtected}
                          >
                            Demote
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            Showing {(page - 1) * pageSize + (sortedAdmins.length ? 1 : 0)} to{" "}
            {Math.min(page * pageSize, sortedAdmins.length)} of{" "}
            {sortedAdmins.length} admins
          </div>
          <div className="flex items-center gap-2">
            <select
              className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
              value={String(pageSize)}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
            >
              <option value="5">5 / page</option>
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="px-2">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border bg-background p-6">
        <div>
          <h2 className="text-lg font-semibold">Admin Audit Log</h2>
          <p className="text-sm text-muted-foreground">
            Riwayat 20 aksi terakhir untuk pembuatan, perubahan login, reset
            password, dan demote admin.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-muted/50">
                <tr className="border-b text-left text-sm">
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Actor</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Target Staff</th>
                  <th className="px-4 py-3 font-medium">Target Login</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {isAuditLoading ? (
                  <tr>
                    <td
                      className="px-4 py-8 text-sm text-muted-foreground"
                      colSpan={6}
                    >
                      Loading audit logs...
                    </td>
                  </tr>
                ) : auditLogs.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-8 text-sm text-muted-foreground"
                      colSpan={6}
                    >
                      Belum ada audit log admin.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="border-b text-sm">
                      <td className="px-4 py-3">
                        {new Date(log.createdAt).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">{log.actorEmail}</td>
                      <td className="px-4 py-3">{log.action}</td>
                      <td className="px-4 py-3">
                        {log.targetStaffName ?? "-"}
                      </td>
                      <td className="px-4 py-3">
                        {log.targetAdminEmail ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {log.details ?? "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Dialog
        open={Boolean(editingStaffId)}
        onOpenChange={(open) => {
          if (!open && !updateEmailMutation.isPending) {
            setEditingStaffId(null);
            setEditedEmail("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin Login Email</DialogTitle>
            <DialogDescription>
              Ubah email login untuk {editingAdmin?.staffName ?? "admin"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Login</label>
            <Input
              type="email"
              value={editedEmail}
              onChange={(event) => setEditedEmail(event.target.value)}
              placeholder="Masukkan email login admin"
              disabled={updateEmailMutation.isPending}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingStaffId(null);
                setEditedEmail("");
              }}
              disabled={updateEmailMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!editingStaffId) return;
                updateEmailMutation.mutate({
                  staffId: editingStaffId,
                  email: editedEmail,
                });
              }}
              disabled={updateEmailMutation.isPending || !editedEmail.trim()}
            >
              {updateEmailMutation.isPending ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(resettingStaffId)}
        onOpenChange={(open) => {
          if (!open && !resetPasswordMutation.isPending) {
            setResettingStaffId(null);
            setNewPassword("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Admin Password</DialogTitle>
            <DialogDescription>
              Set password baru untuk {resettingAdmin?.staffName ?? "admin"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password Baru</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Minimal 8 karakter"
              autoComplete="new-password"
              disabled={resetPasswordMutation.isPending}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResettingStaffId(null);
                setNewPassword("");
              }}
              disabled={resetPasswordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!resettingStaffId) return;
                resetPasswordMutation.mutate({
                  staffId: resettingStaffId,
                  password: newPassword,
                });
              }}
              disabled={
                resetPasswordMutation.isPending || newPassword.trim().length < 8
              }
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(demotingStaffId)}
        onOpenChange={(open) => {
          if (!open && !demoteMutation.isPending) {
            setDemotingStaffId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Demote Admin</AlertDialogTitle>
            <AlertDialogDescription>
              {`Akun login admin untuk ${demotingAdmin?.staffName ?? "staff"} akan dinonaktifkan dan role akan kembali menjadi staff.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={demoteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={demoteMutation.isPending}
              onClick={(event) => {
                event.preventDefault();
                if (!demotingStaffId) return;
                demoteMutation.mutate({ staffId: demotingStaffId });
              }}
            >
              {demoteMutation.isPending ? "Processing..." : "Demote"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminList;
