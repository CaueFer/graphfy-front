"use client";

import { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";

import { ChatInput } from "@/components/ui/ChatInput";
import NavLeftBar from "@/components/ui/navs/leftBar/NavLeftBar";
import { ChatMessages } from "./messages/chatMessages";
import { NewChatPage } from "./newChatPage";

import { useMessages } from "@/lib/hooks/useMessages";
import { ChatMessage } from "./type";

interface ChatLayoutProps {
  token: string | null;
  chatId?: string;
}
export const ChatLayout = ({ token, chatId }: ChatLayoutProps) => {
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  const [leftBarOpen, setLeftBarOpen] = useState(false);
  const [smallMenu, setSmallMenu] = useState(false);

  const [disableChatInput, setDisableChatInput] = useState(false);
  const [input, setInput] = useState<string>("");

  const [formattedMessages, setFormattedMessages] = useState<ChatMessage[]>([]);
  const { messages, setMessages, addMessage } = useMessages();
  const [messageStatus, setMessageStatus] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setDisableChatInput(false);

    const timer = setTimeout(() => setLeftBarOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const message = messages.at(-1);

    if (message != null) {
      if (message?.role !== "user") setIsLoadingMessage(false);

      const content = message.content
        .replace(/\*\*(.*?)\*\*/g, "<h2>$1</h2>")
        .replace(/\n/g, "<br />")
        .replace(/\*(.*?)\*/g, "<strong>$1</strong>");
      const formattedMessage = { ...message, content };

      setFormattedMessages((prev) => [...prev, formattedMessage]);
    }
  }, [messages]);

  // ATUALIZA FRONT
  const handleSendMessageInitial = () => {
    setMessages((prev: ChatMessage[]) => [
      ...prev,
      {
        content: input,
        role: "user",
        id: uuidv4(),
      },
    ]);

    handleSendMessageFinal(input);
  };

  // Chama API
  const handleSendMessageFinal = async (prompt: string) => {
    setIsLoadingMessage(true);
    try {
      // DELAY FAKE
      await new Promise((resolve) =>
        setTimeout(resolve, 10000 * Math.random())
      );

      await fetch(process.env.NEXT_PUBLIC_API_URL + "/start-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, sessionId: token }),
      }).then((response) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");

        const read = () => {
          reader?.read().then(({ done, value }) => {
            if (done) {
              setMessageStatus("");
              return;
            }

            const chunk = decoder.decode(value, { stream: true });

            const status = chunk.split("\n").filter((c) => c.trim() != "");

            status.forEach((s) => {
              const data = JSON.parse(s);

              if (data?.status != null) setMessageStatus(data.status);
              else if (data?.error != null) addMessage(data.error, "error");
              //FAZER UM TOAST PARA O ERRO

              if (data?.success) {
                setMessages((prev: ChatMessage[]) => [
                  ...prev,
                  {
                    content: "recebi a mensagem!",
                    role: "assistant",
                    id: Math.random().toString(),
                  },
                ]);
              }
            });

            read();
          });
        };

        read();
      });
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);

      addMessage("Erro ao enviar mensagem!", "error");
    } finally {
      setIsLoadingMessage(false);
    }
  };

  return (
    <div className="flex min-h-full min-w-screen bg-zinc-900">
      {/* LEFT BAR */}
      <div
        className={classNames(
          "min-h-full relative transition-all duration-500 ease-out -translate-x-[100%] bg-zinc-900 shadow z-20",
          {
            "translate-x-0 ": leftBarOpen,
            "w-[10vh]": smallMenu,
            "w-[285px] ": !smallMenu,
          }
        )}
      >
        <NavLeftBar setSmallMenu={setSmallMenu} smallMenu={smallMenu} />
      </div>

      <div className="relative min-h-full flex-grow bg-zinc-900 flex divide-y divide-zinc-700 flex-col justify-between gap-2 ">
        <div className="flex-1 text-white bg-zinc-900 justify-between flex flex-col">
          {!chatId && (
            <NewChatPage
              setFile={setFile}
              file={file}
              setSmallMenu={setSmallMenu}
            />
          )}

          {chatId && (
            <ChatMessages
              isLoadingMessage={isLoadingMessage}
              setIsLoadingMessage={setIsLoadingMessage}
              messageStatus={messageStatus}
              messages={formattedMessages}
              setMessages={setMessages}
              chatId={chatId}
            />
          )}
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
          handleSubmit={handleSendMessageInitial}
          setInput={setInput}
          customPlaceholder={
            formattedMessages.length < 1
              ? "Envie sua planilha para iniciar o chat!"
              : "Pergunte ao Graphfy..."
          }
          disable={disableChatInput || formattedMessages.length < 1}
        />
      </div>
    </div>
  );
};
