import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ChatMessage } from "@/components/view/chat/type";

export function useMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (message: string, role: ChatMessage["role"]) => {
    setMessages((prev: ChatMessage[]) => [
      ...prev,
      {
        content:
          message.trim() != ""
            ? message
            : "Erro ao processar mensagem. Tente novamente.",
        role,
        id: `${role}-${uuidv4()}`,
      },
    ]);
  };

  return { messages, setMessages, addMessage };
}
