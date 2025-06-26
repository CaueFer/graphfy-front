"use client";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

import {
  AlignEndHorizontal,
  AlignEndVertical,
  AlignStartVertical,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "../button";
import { AreaChartCard } from "./areaChart";

import { cn } from "@/lib/utils";
import { chartColumns } from "./chart.type";

type Align = "start" | "center" | "end";

interface ChartContainerModalProps {
  children: ReactNode;
  align: Align;
  setAlign: Dispatch<SetStateAction<Align>>;
}
const ChartContainerModal = ({
  children,
  align,
  setAlign,
}: ChartContainerModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger asChild>
        <button
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="focus-visible:outline-none"
        >
          {children}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="dark z-[999] flex gap-1 bg-zinc-950/90 shadow-md"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Button
          variant="ghost"
          className={cn("hover:bg-muted/70", {
            "bg-muted/70": align === "start",
          })}
          onClick={() => setAlign("start")}
        >
          <AlignStartVertical />
        </Button>
        <Button
          variant="ghost"
          className={cn("hover:bg-muted/70", {
            "bg-muted/70": align === "center",
          })}
          onClick={() => setAlign("center")}
        >
          <AlignEndHorizontal />
        </Button>
        <Button
          variant="ghost"
          className={cn("hover:bg-muted/70", {
            "bg-muted/70": align === "end",
          })}
          onClick={() => setAlign("end")}
        >
          <AlignEndVertical />
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ChartContainerProps {
  title: string;
  columns: chartColumns;
}
export function ChartContainer({ title, columns }: ChartContainerProps) {
  const [align, setAlign] = useState<Align>("start");

  return (
    <div className="w-full mt-6">
      <div
        className={cn("relative max-w-3xl mx-auto flex", {
          "justify-start": align === "start",
          "justify-center": align === "center",
          "justify-end": align === "end",
        })}
      >
        <ChartContainerModal align={align} setAlign={setAlign}>
          <AreaChartCard title={title} columns={columns} />
        </ChartContainerModal>
      </div>
    </div>
  );
}
