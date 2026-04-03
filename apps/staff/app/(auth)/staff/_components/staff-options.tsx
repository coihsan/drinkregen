"use client";

import ShareButton from "@/components/primitive/share-button";
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

interface StaffOptionsProps {
  staffId: string;
  onArchive?: (staffId: string) => Promise<void> | void;
  onTogglePublish?: (staffId: string) => Promise<void> | void;
}

const StaffOptions: React.FC<StaffOptionsProps> = ({
  staffId,
  onArchive,
  onTogglePublish,
}) => {
  const handleArchive = async (id: string) => {
    try {
      if (!id) {
        console.error("staff id is missing, aborting archive request");
        return;
      }
      if (onArchive) return await onArchive(id);
      const res = await fetch(`/api/staff/${id}/archive`, { method: "POST" });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Failed to archive staff: ${body}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMarkAsPublished = async (id: string) => {
    try {
      if (!id) {
        console.error("staff id is missing, aborting toggle-publish request");
        return;
      }
      if (onTogglePublish) return await onTogglePublish(id);
      const res = await fetch(`/api/staff/${id}/toggle-publish`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Failed to toggle publish state: ${body}`);
      }
    } catch (err) {
      console.error(err);
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
          <ShareButton url={`${window.location.origin}/staff/${staffId}`} />
          <DropdownMenuItem
            onClick={() => handleToggleMarkAsPublished(staffId)}
          >
            <Eye />
            Mark as Published
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => handleArchive(staffId)}
          >
            <Archive />
            <span className="font-semibold">Mark as Archived</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default StaffOptions;
