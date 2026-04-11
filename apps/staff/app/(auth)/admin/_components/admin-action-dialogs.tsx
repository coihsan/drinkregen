"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Info,
  InfoIcon,
  MoreHorizontal,
  PencilLine,
  RotateCcwKey,
  ShieldX,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  demoteAdminToStaffAction,
  resetAdminPasswordAction,
  type AdminStaffItem,
  updateAdminLoginEmailAction,
} from "@/action/admin.action";
import ModalCustom from "@/components/primitive/modal-custom";
import { ActiveModal } from "@/types/app.types";
import PasswordVisible from "@/components/primitive/password-visible";
import PasswordRequirement from "@/components/primitive/password-requirement";
import WarningBox from "@/components/warning-box";
import Image from "next/image";

type AdminActionDialogsProps = {
  admin: AdminStaffItem;
};

const AdminActionDialogs = ({ admin }: AdminActionDialogsProps) => {
  const queryClient = useQueryClient();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [editedEmail, setEditedEmail] = useState(admin.adminEmail);
  const [newPassword, setNewPassword] = useState("");

  const closeModal = () => {
    setActiveModal(null);
    setEditedEmail(admin.adminEmail);
    setNewPassword("");
  };

  const updateEmailMutation = useMutation({
    mutationFn: updateAdminLoginEmailAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "staff-list"],
      });
      await queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
      toast.success(`Email login ${admin.staffName} berhasil diperbarui.`);
      closeModal();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : `Gagal memperbarui email login ${admin.staffName}.`,
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetAdminPasswordAction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
      toast.success(`Password ${admin.staffName} berhasil direset.`);
      closeModal();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : `Gagal reset password ${admin.staffName}.`,
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
      await queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
      toast.success(`${admin.staffName} berhasil diturunkan menjadi staff.`);
      closeModal();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : `Gagal menurunkan ${admin.staffName}.`,
      );
    },
  });

  const isBusy =
    updateEmailMutation.isPending ||
    resetPasswordMutation.isPending ||
    demoteMutation.isPending;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <MoreHorizontal />
            <span className="sr-only">Buka aksi admin</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel className="space-y-1">
            <div className="font-medium text-foreground">{admin.staffName}</div>
            <div className="text-[11px] font-normal text-muted-foreground">
              {admin.adminEmail}
            </div>
          </DropdownMenuLabel>
          {admin.isProtected ? (
            <>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <Badge variant="secondary">Protected account</Badge>
              </div>
            </>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setEditedEmail(admin.adminEmail);
              setActiveModal("edit-login");
            }}
            disabled={admin.isProtected}
          >
            <PencilLine />
            Change email login
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setNewPassword("");
              setActiveModal("reset-password");
            }}
            disabled={admin.isProtected}
          >
            <RotateCcwKey />
            Reset password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setActiveModal("demote")}
            disabled={admin.isProtected}
          >
            <ShieldX />
            Demote
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalCustom
        open={activeModal === "edit-login"}
        onOpenChange={(open) => {
          if (!open && !isBusy) {
            closeModal();
          }
        }}
        onCancel={closeModal}
        title={`Change Email Login ${admin.staffName}.`}
        onAction={() =>
          updateEmailMutation.mutate({
            staffId: admin.staffId,
            email: editedEmail,
          })
        }
        actionLabel={
          updateEmailMutation.isPending ? (
            <>
              <Spinner />
              Saving...
            </>
          ) : (
            "Simpan"
          )
        }
        actionDisabled={isBusy || !editedEmail.trim()}
      >
        <div className="space-y-2">
          <Input
            type="email"
            value={editedEmail}
            onChange={(event) => setEditedEmail(event.target.value)}
            placeholder="Masukkan email login admin"
            disabled={isBusy}
            autoFocus
          />
          <WarningBox boxColor="amber" icon={InfoIcon}>
            Email ini akan dipakai{" "}
            <span className="font-bold text-amber-500">{admin.staffName}</span>{" "}
            untuk masuk ke sistem.
          </WarningBox>
        </div>
      </ModalCustom>

      <ModalCustom
        open={activeModal === "reset-password"}
        onOpenChange={(open) => {
          if (!open && !isBusy) {
            closeModal();
          }
        }}
        onCancel={closeModal}
        title={`Reset Password ${admin.staffName}.`}
        onAction={() =>
          resetPasswordMutation.mutate({
            staffId: admin.staffId,
            password: newPassword,
          })
        }
        actionLabel={
          resetPasswordMutation.isPending ? (
            <>
              <Spinner />
              Saving...
            </>
          ) : (
            "Reset password"
          )
        }
        actionDisabled={isBusy || newPassword.trim().length < 12}
      >
        <div className="space-y-2">
          <PasswordRequirement
            disabled={isBusy}
            placeholder="Minimal 12 karakter"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
          <WarningBox boxColor="amber" icon={InfoIcon}>
            Setelah reset, sesi login aktif{" "}
            <span className="font-bold text-amber-500">{admin.staffName}</span>{" "}
            akan dicabut.
          </WarningBox>
        </div>
      </ModalCustom>

      <ModalCustom
        open={activeModal === "demote"}
        onOpenChange={(open) => {
          if (!open && !isBusy) {
            closeModal();
          }
        }}
        onCancel={closeModal}
        title="Turunkan Admin"
        description={`Akun login admin untuk ${admin.staffName} akan dinonaktifkan dan role akan kembali menjadi staff.`}
        onAction={() => demoteMutation.mutate({ staffId: admin.staffId })}
        actionLabel={
          demoteMutation.isPending ? "Memproses..." : "Turunkan admin"
        }
        actionDisabled={isBusy}
        actionVariant="destructive"
      >
        <WarningBox boxColor="pink" icon={TriangleAlert}>
          Aksi ini akan menghapus sesi aktif{" "}
          <span className="font-bold text-pink-700">{admin.staffName}</span> dan
          memutus relasi akun login dari staff.
        </WarningBox>
      </ModalCustom>
    </>
  );
};

export default AdminActionDialogs;
