import { ComponentPropsWithoutRef } from "react";
import { Ellipsis } from "lucide-react";

import { ChatItemModal } from "./chatItemModal";
import { Chat } from "@/lib/global.types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ChatItemProps extends ComponentPropsWithoutRef<"div"> {
  chat: Chat;
  activeChatId: string | undefined;
}

export function ChatItem({ activeChatId, chat, ...props }: ChatItemProps) {
  const router = useRouter();

  const handleChatClick = () => {
    if (activeChatId === String(chat.id)) return;
    router.push(`/chat/${chat.id}`);
  };

  return (
    <div
      key={chat.id}
      id={String(chat.id)}
      className={cn(
        "flex flex-row gap-2 items-center justify-between w-full sm:px-2 md:px-4 py-2 rounded-lg hover:bg-muted/30 cursor-pointer",
        {
          "bg-muted/30": activeChatId === String(chat.id),
        }
      )}
      onClick={() => handleChatClick()}
      {...props}
    >
      <span>{chat.name}</span>

      <ChatItemModal>
        <Ellipsis />
      </ChatItemModal>
    </div>
  );
}
