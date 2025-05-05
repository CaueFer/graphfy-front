import { ChangeEvent, useState } from "react";

import { Input } from "@nextui-org/react";

interface SheetRangeInputProps {
  size: "sm" | "md" | "lg";
  label?: string;
  labelPlacement?: "inside" | "outside-left" | "outside";
  placeholder?: string;
  disabled: boolean;
}
export function SheetRangeInput({
  label,
  size = "sm",
  disabled = false,
  labelPlacement = "inside",
  placeholder,
}: SheetRangeInputProps) {
  const [value, setValue] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.toUpperCase();
    const cleanedValue = rawValue.replace(/[^A-Z0-9:]/g, "");

    // EMPTY
    if (cleanedValue.length === 0) {
      setValue("");
      return;
    }

    //
    if (cleanedValue.length === 1 && /^[A-Z]$/.test(cleanedValue)) {
      setValue(cleanedValue);
      return;
    }

    const match = cleanedValue.match(/^([A-Z])(:)?([0-9]*)$/);
    if (match) {
      const letter = match[1];
      const hasColon = match[2] === ":";
      const numbers = match[3] || "";
      setValue(hasColon || numbers ? `${letter}:${numbers}` : letter);
      return;
    }

    setValue(rawValue.slice(0, -1));
  };

  return (
    <Input
      label={label}
      size={size}
      labelPlacement={labelPlacement}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(e) => onChange(e)}
      value={value}
    />
  );
}
