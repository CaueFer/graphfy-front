"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { ChatLayout } from "@/components/view/chat/chatLayout";

export default async function ChatInterceptor({
  params,
}: {
  params: { c_id: string };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value ?? null;

  if (params?.c_id) {
    try {
      const res = await fetch("/chat/get-chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chat_id: params?.c_id }),
      });

      const data = await res.json();
      if (!data.success) {
        console.error(data.detail || data.error);
        redirect("/chat");
      }
    } catch (err) {
      console.log("Erro ao validar id do chat: ", err);
      redirect("/chat");
    }
  }

  return <ChatLayout key={token} token={token} chatId={params?.c_id} />;
}
