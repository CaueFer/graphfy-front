import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

import { Input } from "@nextui-org/react";
import { letterToNumber, numberToLetter } from "@/lib/defaultConstants";

interface SheetRangeInputProps {
  size: "sm" | "md" | "lg";
  label?: string;
  labelPlacement?: "inside" | "outside-left" | "outside";
  placeholder?: string;
  disabled: boolean;
  selectedRange: {
    row?: number;
    col?: number;
  } | null;
  setSelectedRange: Dispatch<
    SetStateAction<{
      initialRow?: number;
      initialCol?: number;
      finalRow?: number;
      finalCol?: number;
    } | null>
  >;
  isInitial: boolean;
}
export function SheetRangeInput({
  label,
  size = "sm",
  disabled = false,
  labelPlacement = "inside",
  placeholder,
  selectedRange,
  setSelectedRange,
  isInitial = false,
}: SheetRangeInputProps) {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.toUpperCase();
    const cleanedValue = rawValue.replace(/[^A-Z0-9:]/g, "");

    // EMPTY
    if (cleanedValue.length === 0) {
      if (isInitial) {
        setSelectedRange((prev) => ({
          initialCol: undefined,
          initialRow: undefined,
          ...prev,
        }));
      } else {
        setSelectedRange((prev) => ({
          finalCol: undefined,
          finalRow: undefined,
          ...prev,
        }));
      }
    }

    // ONLY COL
    if (cleanedValue.length === 1 && /^[A-Z]$/.test(cleanedValue)) {
      const col = cleanedValue;

      if (isInitial) {
        setSelectedRange((prev) => ({
          initialCol: letterToNumber[col],
          ...prev,
        }));
      } else {
        setSelectedRange((prev) => ({
          initialCol: letterToNumber[col],
          ...prev,
        }));
      }
      return;
    }

    const match = cleanedValue.match(/^([A-Z])(:)?([0-9]*)$/);
    if (match) {
      const letter = match[1];
      const hasColon = match[2] === ":";
      const numbers = match[3] || "";

      if (isInitial) {
        setSelectedRange((prev) => ({
          initialCol: letterToNumber[letter],
          initialRow: Number(numbers),
          ...prev,
        }));
      } else {
        setSelectedRange((prev) => ({
          initialCol: letterToNumber[letter],
          initialRow: Number(numbers),
          ...prev,
        }));
      }

      return;
    }

    // setValue(rawValue.slice(0, -1));
  };

  const getInputData = (col: number | undefined, row: number | undefined) => {
    if (col == null || row == null) return "";

    return `${numberToLetter[col]}:${selectedRange?.row}`;
  };

  return (
    <Input
      label={label}
      size={size}
      labelPlacement={labelPlacement}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e)}
      value={getInputData(selectedRange?.col, selectedRange?.row)}
    />
  );
}
