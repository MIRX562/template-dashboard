"use client";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { ResponsiveDialog } from "./dialog-responsive";

interface ReusableDialogProps {
  title: string;
  description?: string;
  children: ReactNode;
  triggerText: string;
}

export function ResponsiveDialogButton({
  title,
  description,
  children,
  triggerText,
}: ReusableDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>{triggerText}</Button>
      <ResponsiveDialog
        title={title}
        description={description}
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        {children}
      </ResponsiveDialog>
    </>
  );
}
