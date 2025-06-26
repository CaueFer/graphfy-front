"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ComponentPropsWithoutRef } from "react";
import { chartColumns } from "./chart.type";

const chartConfig = {
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface AreaChartCardProps extends ComponentPropsWithoutRef<"div"> {
  title: string;
  columns: chartColumns;
}
export function AreaChartCard({
  title,
  columns,
  ...props
}: AreaChartCardProps) {
  return (
    <Card
      className="bg-zinc-950/30 shadow-md max-w-[450px] truncate"
      {...props}
    >
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
        {/* <CardDescription>exemplo gráfico</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={columns}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="x"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => String(value).slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="y"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Crescimeno de 5%{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Janeiro - Junho 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
