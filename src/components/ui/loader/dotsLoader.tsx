import { cn } from "@/lib/utils";

export function DotsLoader({ isUserMessage }: { isUserMessage: boolean }) {
  return (
    <div
      className={cn("flex", {
        "justify-end": isUserMessage,
        "justify-start": !isUserMessage,
      })}
    >
      <div className="dots-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}
