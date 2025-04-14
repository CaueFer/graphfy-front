"use client";
import { useState } from "react";

import NavTopBar from "@/components/NavTopBar";
import { HeroSection } from "@/app/view/heroSection/HeroSection";

import HeroTransition from "./view/heroSection/HeroTransition";

export default function Home() {
  const [redirect, setRedirected] = useState(false);
  return (
    <>
      <NavTopBar />
      <section className="flex min-h-screen max-w-screen flex-col items-center justify-center bg-black relative overflow-x-clip">
        <HeroSection id="scrollDiv"  setRedirected={setRedirected} />

        <HeroTransition redirect={redirect}/>
      </section>
    </>
  );
}
