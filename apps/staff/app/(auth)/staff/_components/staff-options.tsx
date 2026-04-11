"use client";

import ModalCustom from "@/components/primitive/modal-custom";
import { useStaff } from "@/hooks/use-staff";
import { ActiveModal } from "@/types/app.types";
import { ROOT_PATH } from "@/types/path.types";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import {
  Archive,
  EllipsisVertical,
  Eye,
  EyeOff,
  Power,
  Share,
  Trash,
  UserCog,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface StaffOptionsProps {
  staffId: string;
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

const StaffOptions: React.FC<StaffOptionsProps> = ({ staffId, variant }) => {
  const {
    archiveStaff,
    deleteStaff,
    fetchStaffArchived,
    isDeletingStaff,
    unArchive,
    staffs,
    toggleUnpublish,
    togglePublish,
    updateActiveStatus,
  } = useStaff();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const isArchivedPath =
    pathname === "/staff-archived" || pathname === "/staff/archive";
  const currentStaff =
    staffs.find((s) => s.id === staffId) ??
    fetchStaffArchived.find((s) => s.id === staffId);
  const [copy, setCopy] = useState(`${ROOT_PATH}/nfc/${currentStaff?.id}`);

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleArchive = async (id: string, name: string | "") => {
    if (id) {
      archiveStaff(id, {
        onSuccess: () => {
          toast.success(`${name} archived successfully`);
          closeModal();
        },
      });
    }
  };
  const handleUnArchive = async (id: string, name: string | "") => {
    if (id) {
      unArchive(id, {
        onSuccess: () => {
          toast.success(`${name} has been unarchived`);
          closeModal();
        },
      });
    }
  };
  const handleToggleMarkAsPublished = async (id: string, name: string | "") => {
    if (id) {
      togglePublish(id, {
        onSuccess: () => {
          toast.success(`${name} has been public NFC successfully`);
          closeModal();
        },
      });
    }
  };
  const handleToggleMarkAsUnPublished = async (
    id: string,
    name: string | "",
  ) => {
    if (id) {
      toggleUnpublish(id, {
        onSuccess: () => {
          toast.success(`${name} has been private NFC successfully`);
          closeModal();
        },
      });
    }
  };

  const handleInActiveStaff = (id: string, data: boolean) => {
    if (id) {
      updateActiveStatus(id, data);
      closeModal();
    }
  };

  const handleDelete = async (id: string, name: string | "") => {
    if (id) {
      deleteStaff(id, {
        onSuccess: () => {
          toast.success(`${name} has been deleted successfully`);
          closeModal();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : `Failed to delete ${name}.`,
          );
        },
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(copy)
      .then(() => {
        setCopy("Copied!");
        setLoading(true);
        toast.success("Copy successfuly");
        console.log("success");
        setTimeout(() => {
          setCopy(copy);
          setLoading(false);
        }, 1000);
      })
      .catch(() => {
        setCopy("Failed to copy!");
        setTimeout(() => {
          setCopy(copy);
          setLoading(false);
        }, 2000);
      });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-max">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserCog />
              Detail
            </DropdownMenuItem>
            {!isArchivedPath && (
              <DropdownMenuItem onClick={() => setActiveModal("share-button")}>
                <Share />
                Share
              </DropdownMenuItem>
            )}
            {!isArchivedPath &&
              (currentStaff?.isPublished ? (
                <DropdownMenuItem
                  onClick={() =>
                    handleToggleMarkAsUnPublished(
                      staffId,
                      currentStaff?.name ?? "",
                    )
                  }
                >
                  <EyeOff />
                  Set Private
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() =>
                    handleToggleMarkAsPublished(
                      staffId,
                      currentStaff?.name ?? "",
                    )
                  }
                >
                  <Eye />
                  Set Public
                </DropdownMenuItem>
              ))}
            {pathname !== `/staff/archive` &&
              (currentStaff?.activeStatus ? (
                <DropdownMenuItem
                  onClick={() => setActiveModal("private-staff")}
                >
                  <Power />
                  Set Inactive
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleInActiveStaff(staffId, true)}
                >
                  <Power />
                  Set Active
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
          {pathname === "/staff/archive" ? null : <DropdownMenuSeparator />}
          <DropdownMenuGroup>
            {isArchivedPath ? (
              <>
                <DropdownMenuItem
                  onClick={() =>
                    handleUnArchive(staffId, currentStaff?.name ?? "")
                  }
                >
                  <Archive />
                  Unarchive
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setActiveModal("delete")}
                >
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setActiveModal("archive-staff")}
              >
                <Archive />
                Archive
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <ModalCustom
        open={activeModal === "private-staff"}
        onOpenChange={() => closeModal()}
        onCancel={closeModal}
        title="Are you sure?"
        description={`${currentStaff?.name} will be private NFC, and any device have this link cannot view content`}
        onAction={() => handleInActiveStaff(staffId, false)}
        actionLabel="Yes"
      >
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-red-500">
          This action will be.{" "}
          <span className="font-bold">{currentStaff?.name}</span> inactive and
          private NFC.
        </div>
      </ModalCustom>
      <ModalCustom
        open={activeModal === "archive-staff"}
        onOpenChange={() => closeModal()}
        onCancel={closeModal}
        title="Are you sure?"
        description="This staff will be move to archived"
        actionLabel="Yes"
        onAction={() => handleArchive(staffId, currentStaff?.name ?? "")}
      >
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-red-500">
          This action will be.{" "}
          <span className="font-bold">{currentStaff?.name}</span> inactive and
          private NFC.
        </div>
      </ModalCustom>
      <ModalCustom
        open={activeModal === "share-button"}
        onOpenChange={() => closeModal()}
        onCancel={closeModal}
        title="Share this profile"
        description={`Anyone with this link can view this profile page`}
        actionLabel={`${loading ? "Copied" : "Copy"}`}
        onAction={() => {
          handleCopy();
        }}
      >
        <Input
          value={`${ROOT_PATH}/${currentStaff?.id}`}
          readOnly
          type="text"
        />
      </ModalCustom>
      <ModalCustom
        open={activeModal === "delete"}
        onOpenChange={() => {
          if (!isDeletingStaff) {
            closeModal();
          }
        }}
        onCancel={closeModal}
        title="Delete staff"
        description={`Data staff ${currentStaff?.name ?? ""} akan dihapus permanen.`}
        actionLabel={isDeletingStaff ? "Deleting..." : "Delete"}
        actionVariant="destructive"
        actionDisabled={isDeletingStaff}
        onAction={() => handleDelete(staffId, currentStaff?.name ?? "")}
      >
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-red-500">
          This action cannot be undone.{" "}
          <span className="font-bold">{currentStaff?.name}</span> will
          permanently remove from our database.
        </div>
      </ModalCustom>
    </>
  );
};
export default StaffOptions;
