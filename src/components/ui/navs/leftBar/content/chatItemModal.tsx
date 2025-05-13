"use client";

import { type ComponentPropsWithoutRef } from "react";
import { Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ChatItemModal({
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent {...props}>
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
