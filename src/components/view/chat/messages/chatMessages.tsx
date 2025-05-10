"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { Message } from "../Message";

import { post } from "@/lib/helpers/fetch.helper";
import { ChatMessage } from "../type";
import SpinnerSvg from "@/components/svg/spinner";

interface ChatMessageProps {
  isLoadingMessage: boolean;
  setIsLoadingMessage: Dispatch<SetStateAction<boolean>>;
  messageStatus: string;
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  chatId: string;
}
export function ChatMessages({
  isLoadingMessage,
  messageStatus,
  messages,
  setMessages,
  chatId,
}: ChatMessageProps) {
  const msgContainerRef = useRef<HTMLDivElement>(null);
  const [isLoadingInitialMsgs, setIsLoadingInitialMsgs] = useState(false);

  useEffect(() => {
    const getInitialMessages = async () => {
      setIsLoadingInitialMsgs(true);
      post("/chat/get-chat-messages", {
        chat_id: chatId,
      })
        .then(async (res) => await res.json())
        .then((data) => {
          const msgs = data.msgs;

          console.log(msgs);
          setMessages([...msgs]);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoadingInitialMsgs(false);
        });
    };

    getInitialMessages();
  }, [chatId, setMessages]);

  useEffect(() => {
    const container = msgContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={msgContainerRef}
      className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col overflow-y-auto scroll-smooth"
    >
      {/* Messages */}
      {messages.length > 0 && !isLoadingInitialMsgs && (
        <>
          {messages.map((message) => (
            <>
              <Message
                key={message.id}
                content={message.content}
                isUserMessage={message.role === "user"}
                isErrorMessage={message.role === "error"}
                isLoadingMessage={message.role === "loading"}
              />
            </>
          ))}
          {isLoadingMessage && (
            <>
              {messageStatus != "" && (
                <div className="px-6 ">
                  <div className="max-w-3xl mx-auto flex items-start">
                    <h2 className="statusTextGradient">{messageStatus}</h2>
                  </div>
                </div>
              )}
              <Message
                key={`loading-${Date.now()}`}
                content={"loading"}
                isUserMessage={false}
              />
            </>
          )}
        </>
      )}

      {/* LOADER MSGS */}
      {isLoadingInitialMsgs && <SpinnerSvg className="size-4" />}
    </div>
  );
}
