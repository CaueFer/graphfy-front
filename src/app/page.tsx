"use client";
import { useState } from "react";

import NavTopBar from "@/components/ui/navs/NavTopBar";
import { HeroSection } from "@/components/view/heroSection/HeroSection";

import HeroTransition from "../components/view/heroSection/HeroTransition";

export default function Home() {
  const [redirect, setRedirected] = useState(false);
  return (
    <>
      <NavTopBar />
      <section className="flex min-h-screen max-w-screen flex-col items-center justify-center bg-black relative overflow-x-clip">
        <HeroSection id="scrollDiv" setRedirected={setRedirected} />

        <HeroTransition redirect={redirect} />
      </section>
    </>
  );
}
