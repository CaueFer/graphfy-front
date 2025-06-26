"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { ChatLayout } from "@/components/view/chat/chatLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default async function ChatInterceptor({
  params,
}: {
  params: { c_id: string };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value ?? null;

  if (params?.c_id) {
    try {
      const res = await fetch(API_URL + "/chat/get-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

  return <ChatLayout key={token} chatId={params?.c_id} />;
}
