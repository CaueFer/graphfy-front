"use client";
import { useRouter } from "next/navigation";

import { DiamondPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface BtnNewChatProps {
  smallMenu: boolean;
}
export function BtnNewChat({ smallMenu }: BtnNewChatProps) {
  const router = useRouter();

  const handleNewChat = () => {
    router.push("/chat");
  };

  return (
    <span
      className={cn(
        "group flex flex-row justify-center items-center gap-2 p-2  mt-[44px] rounded-md border border-muted hover:bg-muted/20 cursor-pointer shadow select-none transition-width duration-200 ease-in-out",
        {
          "min-w-[170px] mt-0 px-4 py-2": !smallMenu,
        }
      )}
      onClick={() => handleNewChat()}
    >
      <DiamondPlus
        className={cn(
          "w-5 h-4 group-hover:rotate-90 transition-transform duration-700 ease-in-out",
          {
            "w-6 h-5": smallMenu,
          }
        )}
      />
      {!smallMenu && "Nova conversa"}
    </span>
  );
}
