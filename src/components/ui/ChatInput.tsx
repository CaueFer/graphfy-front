"use client";

import { Button, Textarea } from "@nextui-org/react";
import { Send } from "lucide-react";
import { type useChat } from "ai/react";

type HandleInputChange = ReturnType<typeof useChat>["handleInputChange"];
type HandleSubmit = ReturnType<typeof useChat>["handleSubmit"];
type SetInput = ReturnType<typeof useChat>["setInput"];

interface ChatInputProps {
  input: string;
  handleInputChange: HandleInputChange;
  handleSubmit: HandleSubmit;
  setInput: SetInput;
  disable: boolean;
  customPlaceholder?: string;
}

export const ChatInput = ({
  handleInputChange,
  handleSubmit,
  input,
  setInput,
  customPlaceholder,
  disable = false,
}: ChatInputProps) => {
  const handleSubmitInterceptor = () => {
    if (input.length <= 0) return;

    handleSubmit();
  };

  return (
    <div className="z-10 bg-zinc-900 absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <form onSubmit={handleSubmit} className="relative">
              <Textarea
                onChange={handleInputChange}
                value={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();

                    handleSubmitInterceptor();
                    setInput("");
                  }
                }}
                minRows={4}
                autoFocus
                placeholder={
                  customPlaceholder ? customPlaceholder : "Faça sua pergunta..."
                }
                className="resize-none bg-zinc-800 hover:bg-zinc-900 rounded-xl text-base"
                disabled={disable}
              />

              <Button
                size="sm"
                type="button"
                className="absolute z-10 border border-border bg-zinc-900 right-2 bottom-2"
                disabled={disable}
                onClick={(e) => {
                  e.preventDefault();

                  handleSubmitInterceptor();
                  setInput("");
                }}
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
