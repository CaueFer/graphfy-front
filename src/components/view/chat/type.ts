import { type Message } from "ai/react";
import { chartColumns } from "@/components/ui/charts/chart.type";

export interface ChatMessage extends Omit<Message, "role"> {
  role:
    | "system"
    | "user"
    | "assistant"
    | "graph"
    | "function"
    | "data"
    | "tool"
    | "error"
    | "loading";
  graphTitle?: string;
  columns?: chartColumns;
}

export interface IReadSelectedCellsProps {
  classList: "add" | "remove";
}
