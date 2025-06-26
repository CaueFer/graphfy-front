import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ChatMessage } from "@/components/view/chat/type";
import { chartColumns } from "@/components/ui/charts/chart.type";

export function useMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (
    message: string,
    role: ChatMessage["role"],
    graphTitle?: string,
    columns?: chartColumns
  ) => {
    setMessages((prev: ChatMessage[]) => [
      ...prev,
      {
        content:
          message || message?.trim() != ""
            ? message
            : "Erro ao processar mensagem. Tente novamente.",
        graphTitle,
        columns,
        role,
        id: `${role}-${uuidv4()}`,
      },
    ]);
  };

  return { messages, setMessages, addMessage };
}
