"use client";

import ShareButton from "@/components/primitive/share-button";
import { useStaff } from "@/hooks/use-staff";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu";
import { Archive, EllipsisVertical, Eye } from "lucide-react";
import { usePathname } from "next/navigation";

interface StaffOptionsProps {
  staffId: string;
}

const StaffOptions: React.FC<StaffOptionsProps> = ({
  staffId,
}) => {
  const { archiveStaff, unArchive, staffs, toggleUnpublish, togglePublish } =
    useStaff();
  const pathname = usePathname();

  const handleArchive = async (id: string) => {
    if(id) {
      archiveStaff(id)
    }
  };
  const handleUnArchive = async (id: string) => {
    if(id) {
      unArchive(id)
    }
  };
  const handleToggleMarkAsPublished = async (id: string) => {
    if(id) {
      togglePublish(id)
    }
  };
  const handleToggleMarkAsUnPublished = async (id: string) => {
    if(id) {
      toggleUnpublish(id)
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-max">
        <DropdownMenuGroup>
          {pathname !== `/staff/archive` && (
            <ShareButton url={`${window.location.origin}/nfc/${staffId}`} />
          )}
          {pathname !== `/staff/archive` &&
            (staffs.find((s) => s.id === staffId)?.isPublished ? (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleToggleMarkAsUnPublished(staffId)}
              >
                <Eye />
                Unpublish
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => handleToggleMarkAsPublished(staffId)}
              >
                <Eye />
                Publish
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {pathname === `/staff/archive` ? (
            <DropdownMenuItem
              onClick={() => handleUnArchive(staffId)}
            >
              <Archive />
              Unarchive
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem variant="destructive" onClick={() => handleArchive(staffId)}>
              <Archive />
              Archive
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default StaffOptions;
