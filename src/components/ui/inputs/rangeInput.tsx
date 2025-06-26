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
      setSelectedRange((prev) => ({
        ...prev,
        ...(isInitial
          ? { initialCol: undefined, initialRow: undefined }
          : { finalCol: undefined, finalRow: undefined }),
      }));
    }

    // ONLY COLLUMN
    if (cleanedValue.length === 1 && /^[a-z]$/gi.test(cleanedValue)) {
      const col = cleanedValue;

      setSelectedRange((prev) => ({
        ...prev,
        ...(isInitial
          ? { initialCol: letterToNumber[col] }
          : {
              finalCol: letterToNumber[col],
            }),
      }));

      return;
    }

    const match = cleanedValue.match(/^([A-Z])(:)?([0-9]*)$/);
    if (match) {
      const letter = match[1];
      const numbers = match[3] || "";
      const col = letter ? letterToNumber[letter] : undefined;
      const row = numbers ? Number(numbers) : undefined;

      setSelectedRange((prev) => ({
        ...prev,
        ...(isInitial
          ? { initialCol: col, initialRow: row }
          : { finalCol: col, finalRow: row }),
      }));

      return;
    }
  };

  const getInputData = (col: number | undefined, row: number | undefined) => {
    if (col == null) return "";

    return `${col != null ? numberToLetter[col] : ""}${row != null ? ":" + selectedRange?.row : ""}`;
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
