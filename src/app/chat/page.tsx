"use client";

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ChatContainer } from "@/components/view/chat/chatContainer";
import { ChatMessage } from "@/components/view/chat/type";
import useCookies from "@/lib/hooks/useCookies";

interface ChatPageProps {}

const ChatPage = ({}: ChatPageProps) => {
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);

  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    try {
      getInitialMessages();

      const getSessionId = async () => {
        setSessionId(await useCookies("sessionId"));
      };
      
      getSessionId();
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
      key={sessionId}
      sessionId={sessionId}
      initialMessages={initialMessages}
    />
  );
};

export default ChatPage;
