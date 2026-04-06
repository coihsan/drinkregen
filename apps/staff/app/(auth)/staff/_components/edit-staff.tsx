import * as React from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import StaffForm from "../../../../components/staff-form";
import { StaffTypes } from "@/types/staff.types";
import { ScrollArea, ScrollBar } from "@workspace/ui/components/scroll-area";

interface EditStaffProps {
  staff: StaffTypes;
}

const EditStaff = ({ staff }: EditStaffProps) => {
  const [open, setOpen] = React.useState(false);
  const isArchived = staff.isArchived === true;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button disabled={isArchived} variant="default">
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="h-dvh">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            {isArchived
              ? "Archived staff cannot be edited until they are restored."
              : "Make changes to your profile here. Click save when you&apos;re done."}
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full px-4 h-full overflow-y-auto">
          {!isArchived && (
            <StaffForm initialData={staff} onSuccess={() => setOpen(false)} />
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
export default EditStaff;
