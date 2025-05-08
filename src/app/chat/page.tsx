"use client";

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ChatContainer } from "@/components/view/chat/chatContainer";
import { ChatMessage } from "@/components/view/chat/type";
import { getClientCookie } from "@/lib/hooks/getClientCookie";

const ChatPage = () => {
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      getInitialMessages();

      const token = getClientCookie("token");
      if (token) setToken(token);
    } catch (error) {
      console.error("Erro get sessionId:", error);
    }
  }, []);

  const getInitialMessages = async () => {
    try {
      // buscar no backend se tem messagem
      // setInitialMessages((prev: Message[]) => [
      //   ...prev,
      //   {
      //     content:
      //       "Olá bem vindo! Envie sua planilha para eu gerar os gráficos e tirar suas dúvidas.",
      //     role: "assistant",
      //     id: uuidv4(),
      //   },
      // ]);

      setInitialMessages([]);
    } catch (error) {
      console.error("Erro ao gerar resumo:", error);
      setInitialMessages((prev: ChatMessage[]) => [
        ...prev,
        {
          content: "Erro ao processar sua mensagem. Tente novamente.",
          role: "error",
          id: uuidv4(),
        },
      ]);
    }
  };

  return (
    <ChatContainer
      key={token}
      token={token}
      initialMessages={initialMessages}
    />
  );
};

export default ChatPage;
