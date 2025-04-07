import type { Metadata } from "next";
import { Inter, Montserrat, Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import "../styles/globals.scss";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "GRAPHFY IA - Gere gráficos com  IA",
  description: "Gere gráficos com IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(roboto.className, "min-h-screen antialiased")}>
        <Providers>
          <main className="max-w-screen h-screen dark text-foreground bg-background relative ">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
