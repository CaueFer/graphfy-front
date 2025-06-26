"use client";

import { Dispatch, SetStateAction, type ComponentPropsWithoutRef } from "react";
import { Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { delet } from "@/lib/helpers/fetch.helper";
import { Chat } from "@/lib/global.types";
import { useRouter } from "next/navigation";

interface ChatItemModalProps extends ComponentPropsWithoutRef<"div"> {
  activeChatId: string | undefined;
  chatId: number;
  setChats: Dispatch<SetStateAction<Chat[]>>;
}
export function ChatItemModal({
  activeChatId,
  chatId,
  setChats,
  children,
  ...props
}: ChatItemModalProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!chatId) return;
    delet(`/chat?chat_id=${chatId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setChats((prev) => prev.filter((chat) => chat.id !== chatId));

          if (activeChatId === String(chatId)) {
            router.push("/chat");
          }
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="dark bg-zinc-900 shadow-lg" {...props}>
        <DropdownMenuItem>
          <Pencil /> Renomear
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-400"
          onClick={() => handleDelete()}
        >
          <Trash /> Apagar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
