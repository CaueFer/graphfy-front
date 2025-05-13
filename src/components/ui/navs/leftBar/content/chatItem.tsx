import { ComponentPropsWithoutRef, useState } from "react";
import { Ellipsis } from "lucide-react";

import { ChatItemModal } from "./chatItemModal";
import { Chat } from "@/lib/global.types";

interface ChatItemProps extends ComponentPropsWithoutRef<"div"> {
  chat: Chat;
}

export function ChatItem({ chat, ...props }: ChatItemProps) {
  const [openOptions, setOpenOptions] = useState(false);
  return (
    <>
      <div
        key={chat.id}
        className="flex flex-row gap-2 items-center justify-start"
        {...props}
      >
        <span>{chat.name}</span>

        <Ellipsis onClick={() => setOpenOptions((prev) => !prev)} />
      </div>

      {openOptions && (
        <ChatItemModal open={openOptions} setOpen={setOpenOptions} />
      )}
    </>
  );
}
