"use client";

import { type Message as TMessage } from "ai/react";
import { Message } from "./Message";
import { BookCopy, BookOpenText, MessageSquare } from "lucide-react";
import { useEffect, useRef } from "react";

interface MessagesProps {
  messages: TMessage[];
  isLoadingMessage: boolean;
  isInicialLoading: boolean;
}

export const Messages = ({
  messages,
  isLoadingMessage,
  isInicialLoading,
}: MessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col overflow-y-auto scroll-smooth"
    >
      {messages.length ? (
        <>
          {messages.map((message, i) => (
            <Message
              key={i}
              content={message.content}
              isUserMessage={message.role === "user"}
              isErrorMessage={message.role === "error"}
              isLoadingMessage={message.role === "loading"}
            />
          ))}
          {isLoadingMessage && (
            <Message
              key={"loading"}
              content={"loading"}
              isUserMessage={false}
            />
          )}
        </>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <MessageSquare className="size-10 text-blue-500" />
            <h3 className="font-semibold text-2xl text-white">Tudo pronto!</h3>
            <p className="text-zinc-500 text-xl text-center">
              Faça sua primeira pergunta para começar.
            </p>
            <p className="text-zinc-500 text-xl text-center">
              Ou selecione umas da opções abaixo.
            </p>

            <div className="w-full flex justify-center items-center gap-10 mt-5">
              <div className="p-4 flex flex-col justify-center gap-4 rounded-lg border border-blue-400 w-[160px] hover:bg-blue-400/[0.05] h-[120px] text-white text-sm cursor-pointer">
                <BookOpenText size={20} />
                GERAR RESUMO DO SITE.
              </div>
              <div className="p-4 flex flex-col justify-center gap-4 rounded-lg border border-blue-400 w-[160px] hover:bg-blue-400/[0.05] h-[120px] text-white text-sm cursor-pointer">
                <BookCopy size={20} />
                FAZER TÓPICOS DO SITE.
              </div>
            </div>
          </div>
          <div className="flex  flex-1 flex-col overflow-y-auto scroll-smooth">
            {isInicialLoading && (
              <Message
                key={"loading"}
                content={"loading"}
                isUserMessage={false}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
