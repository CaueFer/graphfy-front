import { ChatMessage } from "@/app/view/type";
import { useState } from "react";

export default function () {
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
        id: Math.random().toString(),
      },
    ]);
  };

  return { messages, setMessages, setErrorMessage };
}
