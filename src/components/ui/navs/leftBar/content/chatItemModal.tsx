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
      <DropdownMenuContent className="dark bg-zinc-900 shadow-lg" {...props}>
        <DropdownMenuItem>
          <Pencil /> Renomear
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-400">
          <Trash /> Apagar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
