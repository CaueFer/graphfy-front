"use client";
import { NavbarItem } from "@nextui-org/navbar";
import { Tooltip } from "@nextui-org/react";

import { Button as ButtonSd } from "@/components/ui/button";
import { BtnNewChat } from "./btnNewChat";
import { ChatItem } from "./chatItem";

import { Chat, User } from "@/lib/global.types";

interface LeftBarContentProps {
  smallMenu: boolean;
  user: User | null;
  chats?: Chat[];
}
export async function LeftBarContent({
  smallMenu,
  user,
  chats,
}: LeftBarContentProps) {
  return (
    <NavbarItem className="max-w-full flex flex-col text-center justify-center items-center truncate gap-4">
      <Tooltip
        content={
          <p className="text-black text-md text-pretty">
            Suas conversas.
            {!user && (
              <span>
                Faça
                <ButtonSd
                  variant="link"
                  role="link"
                  className="cursor-pointer px-1"
                >
                  LOGIN
                </ButtonSd>
                para ver histórico.
              </span>
            )}
          </p>
        }
        placement="right"
      >
        <GalleryVerticalEnd className="size-10 text-white" />
      </Tooltip>

      {!smallMenu && (
        <h3 className="font-semibold text-xl text-white ">Suas conversas</h3>
      )}

      {/* FACA LOGIN PARA VER CHATS */}
      {!smallMenu && !user && (
        <>
          <p className="text-zinc-400 text-md text-pretty">
            Faça
            <ButtonSd
              variant="link"
              role="link"
              className="cursor-pointer px-1"
            >
              LOGIN
            </ButtonSd>
            para ver histórico.
          </p>
        </>
      )}

      {/* BTN NOVA CONVERSA */}
      {!smallMenu && user && <BtnNewChat />}

      {/* CHATS */}
      {!smallMenu &&
        user &&
        chats &&
        chats?.length > 0 &&
        chats.map((chat) => <ChatItem key={chat.id} chat={chat} />)}
    </NavbarItem>
  );
}
