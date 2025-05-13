"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@nextui-org/react";

import { LeftBarBottom } from "./bottom/leftBarBottom";
import { LeftBarContent } from "./content/leftBarContent";
import { TopContent } from "./top/topContent";

import { clientCookie } from "@/lib/hooks/getClientCookie";
import { decodeJWT } from "@/lib/helpers/jwt.helper";
import { get } from "@/lib/helpers/fetch.helper";
import { Chat, User } from "@/lib/global.types";

interface NavLeftBar {
  setSmallMenu: React.Dispatch<React.SetStateAction<boolean>>;
  smallMenu: boolean;
  chatId: string | undefined;
}
export default function NavLeftBar({
  setSmallMenu,
  smallMenu,
  chatId,
}: NavLeftBar) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const token = clientCookie().get("token");

    const getTokenPayload = async (token: string) => {
      const payload = await decodeJWT(token);

      if (payload) setUser(payload.user as User);
    };

    if (token) {
      getTokenPayload(token);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    const getChatsHistory = async () => {
      get(`/chat/get-user-chats?user_id=${user?.id}`)
        .then((res) => res.json())
        .then((data) => setChats(data?.chats))
        .catch((err) => console.log(err));
    };

    getChatsHistory();
  }, [user]);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        base: [
          `relative w-full h-full items-start bg-gradient-to-tr from-zinc-950 to-zinc-900 transition-all duration-400 `,
        ],
        wrapper: ["py-4 h-full flex flex-col justify-between items-center"],
      }}
    >
      <TopContent
        setSmallMenu={setSmallMenu}
        smallMenu={smallMenu}
        isMenuOpen={isMenuOpen}
      />

      {/* NAV CONTENT */}
      <LeftBarContent
        chatId={chatId}
        chats={chats}
        setChats={setChats}
        user={user}
        smallMenu={smallMenu}
      />

      {/* BOTTOM */}
      <LeftBarBottom user={user} smallMenu={smallMenu} />
    </Navbar>
  );
}
