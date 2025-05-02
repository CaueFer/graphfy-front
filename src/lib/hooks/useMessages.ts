import { ChatMessage } from "@/components/view/chat/type";
import { useState } from "react";

export function useMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const setErrorMessage = (message: string = "") => {
    setMessages((prev: ChatMessage[]) => [
      ...prev,
      {
        content:
          message.trim() != ""
            ? message
            : "Erro ao processar sua mensagem. Tente novamente.",
        role: "error",
        id: `error-${Math.random()}`,
      },
    ]);
  };

  return { messages, setMessages, setErrorMessage };
}
