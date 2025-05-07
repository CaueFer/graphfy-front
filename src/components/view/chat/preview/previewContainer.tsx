"use client";

import { SetStateAction, useEffect, useState } from "react";
import { TableProperties } from "lucide-react";
import { Button } from "@nextui-org/react";
import classNames from "classnames";

import { SheetRangeInput } from "@/components/ui/inputs/rangeInput";
import { Button as ButtonSd } from "@/components/ui/button";
import SpinnerSvg from "@/components/svgs/spinner";
import { PreviewTable } from "./previewTable";
import { selectedCellColor } from "@/lib/defaultConstants";

import { IReadSelectedCellsProps } from "../type";

interface PreviewContaineProps {
  previewTable: string[][];
  workbookSheets: string[] | null;
  renderWorksheet: (worksheetNumber?: number) => void;
  setSelectedSheet: (value: SetStateAction<number>) => void;
  selectedSheet: number;
  file: File | null;
  isFileUploading: boolean;
  workbookTotalSheets: number;
}
export function PreviewContainer({
  previewTable,
  workbookSheets,
  renderWorksheet,
  setSelectedSheet,
  selectedSheet,
  file,
  isFileUploading,
  workbookTotalSheets,
}: PreviewContaineProps) {
  const [selectedRange, setSelectedRange] = useState<{
    initialRow?: number;
    initialCol?: number;
    finalRow?: number;
    finalCol?: number;
  } | null>(null);

  useEffect(() => {
    readSelectedCells({ classList: "add" });
  }, [selectedRange]);

  const readSelectedCells = ({ classList }: IReadSelectedCellsProps) => {
    if (
      selectedRange?.initialRow != null &&
      selectedRange?.initialCol != null
    ) {
      const startRow = selectedRange?.initialRow ?? 0;
      const endRow =
        selectedRange?.finalRow != null ? selectedRange?.finalRow : startRow;

      const startCol = selectedRange?.initialCol ?? 0;
      const endCol = selectedRange?.finalCol
        ? selectedRange?.finalCol
        : startCol;

      // PASSA POR TODO O SELECTED RANGE E FAZ ALGO
      for (let i = startRow; i <= endRow; i++) {
        for (let j = startCol; j <= endCol; j++) {
          const cell = document.getElementById(`col${j}-row${i}`);

          if (classList === "add") cell?.classList.add(...selectedCellColor);
          else cell?.classList.remove(...selectedCellColor);
        }
      }
    }
  };

  const getWorksheetRange = () => {
    if (
      previewTable &&
      selectedRange &&
      selectedRange.initialRow != null &&
      selectedRange.initialCol != null &&
      selectedRange.finalRow != null &&
      selectedRange.finalCol != null
    ) {
      const rangeCells: string[] = [];

      for (
        let row = selectedRange.initialRow;
        row <= selectedRange.finalRow;
        row++
      ) {
        for (
          let col = selectedRange.initialCol;
          col <= selectedRange.finalCol;
          col++
        ) {
          const cell = previewTable[row - 1][col];
          rangeCells.push(cell);
        }
      }

      console.log(rangeCells);
    }
  };

  return (
    <div className="relative flex-1 flex flex-row items-center justify-center p-10 overflow-hidden">
      <div className="flex flex-col items-start justify-center gap-2">
        <TableProperties className="size-10 text-blue-500" />
        <h3 className="font-semibold text-2xl text-white">
          Pré visualização da Planilha
        </h3>
        <p className="text-zinc-500 text-xl text-left mt-2">
          Selecione o intervalo dos dados.
        </p>

        {/* RANGE INPUTS */}
        <div className="flex flex-row gap-2 justify-center items-center">
          <SheetRangeInput
            label="Inicio"
            size="sm"
            labelPlacement="inside"
            placeholder="A:1"
            disabled={previewTable?.[0] == null}
            selectedRange={{
              col: selectedRange?.initialCol,
              row: selectedRange?.initialRow,
            }}
            setSelectedRange={setSelectedRange}
            isInitial={true}
          />
          :
          <SheetRangeInput
            label="Fim"
            size="sm"
            labelPlacement="inside"
            placeholder="Z:50"
            disabled={previewTable?.[0] == null}
            selectedRange={{
              col: selectedRange?.finalCol,
              row: selectedRange?.finalRow,
            }}
            setSelectedRange={setSelectedRange}
            isInitial={false}
          />
        </div>

        {/* SHEETS */}
        <div className="flex flex-col justify-start items-start gap-3 mt-6">
          <p className="text-zinc-500 text-xl text-left">Selecionar página —</p>
          {workbookSheets != null &&
            workbookSheets.map((sheetNum, i) => (
              <ButtonSd
                key={`sheet-${sheetNum}-${i}`}
                onClick={() => {
                  renderWorksheet(i);
                  setSelectedSheet(i);
                }}
                variant="link"
                className="w-full justify-start"
                disabled={selectedSheet == i}
              >
                {sheetNum} - ({i + 1})
              </ButtonSd>
            ))}

          {/*  LOADERS */}
          {workbookTotalSheets > 0 &&
            Array.from(
              { length: workbookTotalSheets },
              (_, index) => index
            ).map((_, i) => (
              <ButtonSd
                key={`sheet-loader-${i}`}
                onClick={() => {
                  renderWorksheet(i);
                  setSelectedSheet(i);
                }}
                variant="link"
                className="w-full justify-start"
              >
                Lendo página
                <SpinnerSvg />
              </ButtonSd>
            ))}
        </div>

        <Button
          color="primary"
          variant="flat"
          size="lg"
          className={classNames(
            "w-[200px] bg-blue-600 ease-in-out mx-auto mt-10 ",
            {
              "opacity-0 -translate-y-2 ": !file,
              "opacity-1 translate-y-5 ": file,
              "animate-pulse": isFileUploading,
            }
          )}
          onClick={() => getWorksheetRange()}
          disabled={isFileUploading}
        >
          {!isFileUploading ? (
            "Enviar Intervalo"
          ) : (
            <>
              Enviando
              <SpinnerSvg />
            </>
          )}
        </Button>
      </div>

      <div className="w-[2px] h-[50%] bg-muted mx-4" />

      <PreviewTable
        fileName={file?.name as string}
        previewTable={previewTable}
        setSelectedRange={setSelectedRange}
        selectedRange={selectedRange}
        readSelectedCells={readSelectedCells}
      />
    </div>
  );
}
