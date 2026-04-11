"use client";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import React from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onAction?: () => void;
  onCancel?: () => void;
  actionLabel: React.ReactNode;
  actionDisabled?: boolean;
  cancelLabel?: string;
  actionVariant?: "default" | "destructive";
};

const ModalCustom = ({
  children,
  open,
  onOpenChange,
  onCancel,
  description,
  title,
  onAction,
  actionLabel,
  actionDisabled = false,
  cancelLabel = "Batal",
  actionVariant = "default",
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-auto rounded-xl bg-card md:max-h-[700px] md:h-fit">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={actionVariant} onClick={onAction} disabled={actionDisabled}>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCustom;
