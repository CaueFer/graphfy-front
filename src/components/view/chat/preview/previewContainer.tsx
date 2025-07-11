"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { MoveLeft, TableProperties } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import classNames from "classnames";

import { SheetRangeInput } from "@/components/ui/inputs/rangeInput";
import { Button as ButtonSd } from "@/components/ui/button";
import SpinnerSvg from "@/components/svg/spinner";
import { PreviewTable } from "./previewTable";

import { selectedCellColor } from "@/lib/defaultConstants";
import { post } from "@/lib/helpers/fetch.helper";
import { useToast } from "@/lib/hooks/use-toast";
import { IReadSelectedCellsProps } from "../type";

interface PreviewContaineProps {
  previewTable: string[][];
  workbookSheets: string[] | null;
  renderWorksheet: (worksheetNumber?: number) => void;
  setSelectedSheet: (value: SetStateAction<number>) => void;
  selectedSheet: number;
  fileName: string;
  workbookTotalSheets: number;
}
export function PreviewContainer({
  previewTable,
  workbookSheets,
  renderWorksheet,
  setSelectedSheet,
  selectedSheet,
  fileName,
  workbookTotalSheets,
}: PreviewContaineProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedRange, setSelectedRange] = useState<{
    initialRow?: number;
    initialCol?: number;
    finalRow?: number;
    finalCol?: number;
  } | null>(null);

  const [isFileUploading, setIsFileUploading] = useState(false);
  const [sended, setSended] = useState(false);

  const readSelectedCells = useCallback(
    ({ classList }: IReadSelectedCellsProps) => {
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

        // PASSA POR TODO O SELECTED RANGE
        for (let i = startRow; i <= endRow; i++) {
          for (let j = startCol; j <= endCol; j++) {
            const cell = document.getElementById(`col${j}-row${i}`);

            if (classList === "add") cell?.classList.add(...selectedCellColor);
            else cell?.classList.remove(...selectedCellColor);
          }
        }
      }
    },
    [selectedRange]
  );

  useEffect(() => {
    readSelectedCells({ classList: "add" });
  }, [readSelectedCells, selectedRange]);

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

      sendWorksheetRangeToApi(rangeCells);
    }
  };

  const sendWorksheetRangeToApi = (worksheetRange: string[]) => {
    setIsFileUploading(true);
    post("/chat/upload-spreadsheet", {
      worksheetRange,
    })
      .then(async (response) => {
        const data = await response.json();

        if (data.success) {
          setSended(true);
          toast({
            description: "Chat iniciado, redirecionando...",
            variant: "default",
          });
          router.push(`/chat/${data.chat_id}`);
        }

        if (data.error || data.detail) {
          const erro = data.error || data.detail;
          console.log(erro);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsFileUploading(false));
  };

  return (
    <div className="relative flex-1 flex flex-row items-center justify-center p-10 overflow-hidden">
      <div className="flex flex-col items-start justify-center gap-2">
        <ButtonSd variant="link" className="p-1 mb-4">
          <MoveLeft />
          voltar
        </ButtonSd>
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
              "animate-pulse": isFileUploading,
            }
          )}
          onClick={() => getWorksheetRange()}
          disabled={isFileUploading || sended}
        >
          {!isFileUploading ? (
            "Enviar Intervalo"
          ) : (
            <>
              Enviando
              <SpinnerSvg className="size-2" />
            </>
          )}
        </Button>
      </div>

      {/* SEPARATOR */}
      <div className="w-[2px] h-[50%] bg-muted mx-4" />

      <PreviewTable
        fileName={fileName}
        previewTable={previewTable}
        setSelectedRange={setSelectedRange}
        selectedRange={selectedRange}
        readSelectedCells={readSelectedCells}
      />
    </div>
  );
}
