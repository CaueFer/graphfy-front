import { type Message } from "ai/react";

export interface ChatMessage extends Omit<Message, "role"> {
  role:
    | "system"
    | "user"
    | "assistant"
    | "function"
    | "data"
    | "tool"
    | "error"
    | "loading";
}
