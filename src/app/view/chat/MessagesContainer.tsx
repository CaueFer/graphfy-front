"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@nextui-org/react";
import classNames from "classnames";

import DefaultDropzone from "../../../components/ui/Dropzone";
import { Message } from "./Message";

import { ChatMessage } from "../type";

interface MessagesContainerProps {
  file: File | null;
  messageStatus: string;
  fileUpload: () => void;
  messages: ChatMessage[];
  isFileUploading: boolean;
  isLoadingMessage: boolean;
  isInicialLoading: boolean;
  setFile: Dispatch<SetStateAction<File | null>>;
}

export const MessagesContainer = ({
  messages,
  file,
  setFile,
  fileUpload,
  messageStatus,
  isFileUploading,
  isLoadingMessage,
  isInicialLoading = false,
}: MessagesContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dropzoneRef?.current != null) {
      dropzoneRef.current.focus();
    }
  }, []);

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
            <>
              <Message
                key={i}
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
                    <h2 className=" statusTextGradient">{messageStatus}</h2>
                  </div>
                </div>
              )}
              <Message
                key={"loading"}
                content={"loading"}
                isUserMessage={false}
              />
            </>
          )}
        </>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <MessageSquare className="size-10 text-blue-500" />
            <h3 className="font-semibold text-2xl text-white">Tudo pronto!</h3>
            <p className="text-zinc-500 text-xl text-center">
              Envie sua planilha para gerar seus primeiros gráficos.
            </p>

            <div className="w-full flex flex-col justify-center items-center gap-5 mt-5">
              <DefaultDropzone
                ref={dropzoneRef}
                setFile={setFile}
                file={file}
              />

              {(file || isFileUploading) && (
                <Button
                  color="primary"
                  variant="flat"
                  onClick={() => fileUpload()}
                  className={classNames(
                    " bg-blue-600 duration-1000 ease-in-out ",
                    {
                      "opacity-0 -translate-y-2 ": !file,
                      "opacity-1 translate-y-5 ": file,
                      "animate-pulse": isFileUploading,
                    }
                  )}
                  disabled={file == null || isFileUploading}
                >
                  Enviar Planilha
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
