"use client";

import { Dispatch, SetStateAction } from "react";
import { Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface ChatItemModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export function ChatItemModal({ open, setOpen }: ChatItemModalProps) {
  return (
    <DropdownMenu open={open} onOpenChange={(open) => setOpen(open)}>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Pencil /> Renomear
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash /> Apagar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
