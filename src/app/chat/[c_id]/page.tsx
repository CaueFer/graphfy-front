"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { ChatLayout } from "@/components/view/chat/chatLayout";
import { post } from "@/lib/helpers/fetch.helper";

export default async function ChatInterceptor({
  params,
}: {
  params: { c_id: string };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value ?? null;

  if (params?.c_id) {
    try {
      const res = await post("/chat/get-chat", {
        chat_id: params?.c_id,
      });

      const data = await res.json();

      if (!data.success) {
        redirect("/chat");
      }
    } catch (err) {
      console.log("Erro ao validar id do chat: ", err);
      redirect("/chat");
    }
  }

  return <ChatLayout key={token} token={token} chatId={params?.c_id} />;
}
