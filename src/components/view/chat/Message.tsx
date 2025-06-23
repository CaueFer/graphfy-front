import { Bot, ShieldX, User } from "lucide-react";

import { ChartContainer } from "@/components/ui/charts/chartContainer";
import { DotsLoader } from "@/components/ui/loader/dotsLoader";

import { cn } from "@/lib/utils";
import { chartColumns } from "@/components/ui/charts/chart.type";

interface MessageProps {
  content: string;
  graphTitle?: string;
  columns?: chartColumns;
  isUserMessage?: boolean;
  isErrorMessage?: boolean;
  isGraphMessage?: boolean;
}

export const Message = ({
  content,
  graphTitle,
  columns,
  isUserMessage = false,
  isErrorMessage = false,
  isGraphMessage = false,
}: MessageProps) => {
  const formatedContent = content
    ?.replace("```jsx", "")
    ?.replace("```", "")
    ?.trim();

  // console.log(isGraphMessage, graphTitle, columns);
  return (
    <div className="p-6">
      <div
        className={cn("max-w-3xl mx-auto flex items-start gap-2.5", {
          "flex-row-reverse": isUserMessage,
        })}
      >
        <div
          className={cn(
            "size-10 shrink-0 aspect-square rounded-full border border-zinc-700 bg-zinc-900 flex justify-center items-center",
            {
              "bg-blue-950 border-blue-700 text-zinc-200": isUserMessage,
            }
          )}
        >
          {isUserMessage ? (
            <User className="size-5" />
          ) : isErrorMessage ? (
            <ShieldX className="size-5 text-red-500" />
          ) : (
            <Bot className="size-5 text-white" />
          )}
        </div>

        <div
          className={cn("relative flex flex-col justify-end w-full p-4", {
            "items-end mr-6 bg-muted/50 rounded-md": isUserMessage,
            "items-start ml-6": !isUserMessage,
          })}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {isUserMessage ? "Você" : "GRAPHFY IA"}
            </span>
          </div>

          <div className="font-normal py-2.5 text-gray-900 dark:text-white w-full">
            {content === "loading" && <DotsLoader />}

            {content !== "loading" && (
              <>
                <div
                  className={cn("prose chatResponseText", {
                    "text-right": isUserMessage,
                  })}
                >
                  <span dangerouslySetInnerHTML={{ __html: formatedContent }} />
                </div>
                {isGraphMessage && graphTitle && columns && (
                  <ChartContainer title={graphTitle} columns={columns} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
