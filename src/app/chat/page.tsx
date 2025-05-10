"use client";

import React, { useEffect, useState } from "react";

import { ChatLayout } from "@/components/view/chat/chatLayout";
import { clientCookie } from "@/lib/hooks/getClientCookie";

const ChatPage = () => {
  const cookie = clientCookie();

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = cookie.get("token");
      if (token) setToken(token);
    } catch (error) {
      console.error("Erro get token:", error);
    }
  }, [cookie]);

  return <ChatLayout key={token} token={token} />;
};

export default ChatPage;
