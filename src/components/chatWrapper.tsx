"use client";

import { Message, useChat } from "ai/react";
import { Messages } from "./Messages";
import { ChatInput } from "./ui/ChatInput";
import NavLeftBar from "./NavLeftBar";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const ChatWrapper = ({
  sessionId,
  initialMessages,
}: {
  sessionId: string;
  initialMessages: Message[];
}) => {
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [isInicialLoading, setIsInicialLoading] = useState(true);

  const [disableChatInput, setDisableChatInput] = useState(false);

  const [formattedMessages, setFormattedMessages] = useState<Message[]>([]);

  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const [error, setError] = useState<Error>();

  useEffect(() => {
    setMessages((prev) => {
      if (initialMessages.length > 0) setIsInicialLoading(false);
      return (prev = initialMessages);
    });
  }, [initialMessages]);

  const handleSubmitInterceptor = () => {
    setIsLoadingMessage(true);

    setMessages((prev: Message[]) => [
      ...prev,
      {
        content: input,
        role: "user",
        id: uuidv4(),
      },
    ]);

    const inputWithInstruction = input + " responda tudo em pt-br.";
    generateQuestion(inputWithInstruction);
  };

  const generateQuestion = async (prompt: string) => {
    try {
      await new Promise((resolver) => {
        setTimeout(() => {
          resolver(true);
        }, 2000);
      });

      setMessages((prev: Message[]) => [
        ...prev,
        {
          content: "recebi a mensagem!",
          role: "assistant",
          id: Math.random().toString(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);

      setMessages((prev: Message[]) => [
        ...prev,
        {
          content: "Erro ao processar sua mensagem. Tente novamente.",
          role: "error",
          id: Math.random().toString(),
        },
      ]);
    } finally {
      setIsLoadingMessage(false);
    }
  };

  useEffect(() => {
    if (messages.at(-1)?.role !== "user") setIsLoadingMessage(false);

    const formatted = messages.map((message) => {
      let content = message.content
        .replace(/\*\*(.*?)\*\*/g, "<h2>$1</h2>")
        .replace(/\n/g, "<br>")
        .replace(/\*(.*?)\*/g, "<strong>$1</strong>");

      return { ...message, content: content };
    });

    setFormattedMessages(formatted);
  }, [messages]);

  useEffect(() => {
    if (error) {
      setIsLoadingMessage(false);
      setDisableChatInput(true);

      setMessages((prev: Message[]) => [
        ...prev,
        {
          content: "Limite diário atingido!",
          role: "error",
          id: uuidv4(),
        },
      ]);
    } else setDisableChatInput(false);
  }, [error]);

  useEffect(() => {
    setDisableChatInput(false);
  }, []);

  return (
    <div className="flex min-h-full min-w-screen">
      <div className="min-h-full w-[285px]  relative">
        <NavLeftBar />
      </div>

      <div className="relative min-h-full flex-grow bg-zinc-900 flex divide-y divide-zinc-700 flex-col justify-between gap-2">
        <div className="flex-1 text-white bg-zinc-900 justify-between flex flex-col">
          <Messages
            messages={formattedMessages}
            isLoadingMessage={isLoadingMessage}
            isInicialLoading={isInicialLoading}
          />
        </div>

        <ChatInput
          input={input}
          handleInputChange={(
            e:
              | React.ChangeEvent<HTMLInputElement>
              | React.ChangeEvent<HTMLTextAreaElement>
          ) => {
            setInput(e.target.value);
          }}
          handleSubmit={handleSubmitInterceptor}
          setInput={setInput}
          disable={disableChatInput}
        />
      </div>
    </div>
  );
};
