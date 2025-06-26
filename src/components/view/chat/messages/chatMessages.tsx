"use client";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import SpinnerSvg from "@/components/svg/spinner";
import { Message } from "../Message";

import { post } from "@/lib/helpers/fetch.helper";
import { ChatMessage } from "../type";

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
        .then(async (res) => {
          // DELAY FAKE - SIMULAR NETWORK RUIM
          await new Promise<void>((resolve) => setTimeout(resolve, 2000));

          return await res.json();
        })
        .then((data) => {
          const msgs = data.msgs;
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
            <Message
              key={message.id}
              content={message.content}
              graphTitle={message.graphTitle}
              columns={message.columns}
              isUserMessage={message.role === "user"}
              isErrorMessage={message.role === "error"}
              isGraphMessage={message.role === "graph"}
            />
          ))}

          {isLoadingMessage && (
            <Fragment key={`loading-${Date.now()}`}>
              {messageStatus != "" && (
                <div className="px-6  ">
                  <div className="max-w-3xl mx-auto flex items-start justify-start">
                    <h2 className="statusTextGradient">{messageStatus}</h2>
                  </div>
                </div>
              )}
              <Message content={"loading"} isUserMessage={false} />
            </Fragment>
          )}
        </>
      )}

      {/* LOADER INITIAL MSGS */}
      {isLoadingInitialMsgs && (
        <div className="w-full h-full flex justify-center items-center">
          <SpinnerSvg className="size-6" />
        </div>
      )}
    </div>
  );
}
