import { useEffect, useRef, useState } from "react";
import { BookCopy, MessageSquare } from "lucide-react";

import DefaultDropzone from "../ui/Dropzone";
import { ChatMessage } from "./type";
import { Message } from "./Message";

interface MessagesProps {
  messages: ChatMessage[];
  isLoadingMessage: boolean;
  isInicialLoading: boolean;
}

export const Messages = ({
  messages,
  isLoadingMessage,
  isInicialLoading = false,
}: MessagesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const [file, setFile] = useState<any>(null);

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
              Envie sua planilha para gerar seus primeiros gráficos.
            </p>

            <div className="w-full flex justify-center items-center gap-10 mt-5">
              <DefaultDropzone
                ref={dropzoneRef}
                className=""
                setFile={setFile}
                file={file}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
