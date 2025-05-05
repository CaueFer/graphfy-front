"use client";

import { useEffect, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";

import { ChatInput } from "@/components/ui/ChatInput";
import NavLeftBar from "@/components/ui/navs/NavLeftBar";
import { useMessages } from "@/lib/hooks/useMessages";
import { ChatContent } from "./chatContent";

import { ChatMessage } from "./type";

interface ChatContainerProps {
  sessionId: string | null;
  initialMessages: ChatMessage[];
}
export const ChatContainer = ({
  sessionId,
  initialMessages,
}: ChatContainerProps) => {
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [isInicialLoading, setIsInicialLoading] = useState(true);
  const [isFileUploading, setIsFileUploading] = useState(false);

  const [leftBarOpen, setLeftBarOpen] = useState(false);
  const [smallMenu, setSmallMenu] = useState(false);

  const [disableChatInput, setDisableChatInput] = useState(false);
  const [input, setInput] = useState<string>("");

  const [formattedMessages, setFormattedMessages] = useState<ChatMessage[]>([]);
  const {messages, setMessages, setErrorMessage } = useMessages();
  const [messageStatus, setMessageStatus] = useState<string>("");

  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState<Error>();

  useEffect(() => {
    if (initialMessages.length > 0) setIsInicialLoading(false);
    setMessages((prev) => initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const message = messages.at(-1);

    if (message != null) {
      if (messages.at(-1)?.role !== "user") setIsLoadingMessage(false);

      const content = message.content
        .replace(/\*\*(.*?)\*\*/g, "<h2>$1</h2>")
        .replace(/\n/g, "<br />")
        .replace(/\*(.*?)\*/g, "<strong>$1</strong>");
      const formattedMessage = { ...message, content };

      setFormattedMessages((prev) => [...prev, formattedMessage]);
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      setIsLoadingMessage(false);
      setDisableChatInput(true);

      setMessages((prev: ChatMessage[]) => [
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

    const timer = setTimeout(() => setLeftBarOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const fileUpload = async () => {
    setIsFileUploading(true);

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("range", "0, 20");
      formData.append("sessionId", sessionId ?? "");

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload-spreadsheet`, {
        method: "POST",
        body: formData,
      })
        .then(async (response) => {
          const data = await response.json();

          if (data.success === true) {
            setMessages((prev: ChatMessage[]) => [
              ...prev,
              {
                content: `${data.message} \n\n ⛳ Dica: ${data.instructions}`,
                role: "assistant",
                id: Math.random().toString(),
              },
            ]);
          }
        })
        .finally(() => setIsFileUploading(false));
    } else setIsFileUploading(false);
  };

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
        body: JSON.stringify({ prompt, sessionId }),
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
              else if (data?.error != null) setErrorMessage(data.error);
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

      setErrorMessage();
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
          <ChatContent
            isLoadingMessage={isLoadingMessage}
            isInicialLoading={isInicialLoading}
            isFileUploading={isFileUploading}
            messageStatus={messageStatus}
            messages={formattedMessages}
            fileUpload={fileUpload}
            setFile={setFile}
            file={file}
            setSmallMenu={setSmallMenu}
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
