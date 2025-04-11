"use client";

import React, { useEffect, useMemo, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { ChatWrapper } from "@/components/view/chatWrapper";
import { ChatMessage } from "@/components/view/type";

interface ChatbotPageProps {}

const ChatbotPage = ({}: ChatbotPageProps) => {
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);

  const sessionId = useMemo(() => uuidv4().replace(/\//g, ""), []);

  useEffect(() => {
    try {
      generateIAResume();
    } catch (error) {
      console.error("Erro ao reconstruir a URL:", error);
    }
  }, []);

  useEffect(() => {
    //console.log(initialMessages)
  }, [initialMessages]);

  const generateIAResume = async () => {
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
    <ChatWrapper
      key={sessionId}
      sessionId={sessionId}
      initialMessages={initialMessages}
    />
  );
};

export default ChatbotPage;
