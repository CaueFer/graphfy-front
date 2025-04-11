"use client";

import NavTopBar from "@/components/NavTopBar";
import { HeroSection } from "@/components/view/heroSection/HeroSection";

export default function Home() {
  return (
    <>
      <NavTopBar />
      <section className="flex min-h-screen max-w-screen flex-col items-center justify-center bg-black relative overflow-x-clip">
        <HeroSection id="scrollDiv" />

        <div className="relative w-full z-50 flex flex-col justify-center">
          <div
            id="targetDiv"
            className="w-full flex flex-col justify-start gap-4 h-[100vh] px-14 py-[3.25rem] md:py-14 bg-transparent absolute bottom-0 z-50 bg-black backdrop-blur-sm snap-center"
          >
            {/* <div className="w-full flex justify-center items-center ">
              <Button onClick={redirect}>Gerar Gráficos</Button>
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
}
