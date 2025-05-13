"use client";
import { useRouter } from "next/router";

import { DiamondPlus } from "lucide-react";

export function BtnNewChat() {
  const router = useRouter();

  const handleNewChat = () => {
    router.push("/chat");
  };
  return (
    <span
      className="group flex flex-row justify-center items-center px-4 py-2 rounded-md border border-muted hover:bg-muted/20 cursor-pointer shadow min-w-[170px] select-none"
      onClick={() => handleNewChat()}
    >
      <DiamondPlus className="w-5 h-4 mr-2 group-hover:rotate-90 transition-transform duration-700 ease-in-out" />
      Nova conversa
    </span>
  );
}
