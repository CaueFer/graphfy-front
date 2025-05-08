"use client";

import {
  Dispatch,
  Fragment,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { numberToLetter } from "@/lib/defaultConstants";
import { IReadSelectedCellsProps } from "../type";

interface PreviewTableProps {
  fileName: string;
  previewTable: string[][] | null;
  selectedRange: {
    initialRow?: number;
    initialCol?: number;
    finalRow?: number;
    finalCol?: number;
  } | null;
  setSelectedRange: Dispatch<
    SetStateAction<{
      initialRow?: number;
      initialCol?: number;
      finalRow?: number;
      finalCol?: number;
    } | null>
  >;
  readSelectedCells: ({ classList }: IReadSelectedCellsProps) => void;
}
export function PreviewTable({
  fileName,
  previewTable,
  selectedRange,
  setSelectedRange,
  readSelectedCells,
}: PreviewTableProps) {
  const tableBodyScroll = useRef<HTMLTableElement>(null);
  const [activeRows, setActiveRows] = useState(previewTable?.slice(0, 15));

  const [isDragging, setIsDragging] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadMoreRows = useCallback(() => {
    if (!previewTable) return;
    setActiveRows((prev) => {
      if (!prev) return;
      const currentLength = prev.length;
      const nextRows = previewTable.slice(currentLength, currentLength + 15);
      return [...prev, ...nextRows];
    });
  }, [previewTable]);

  useEffect(() => {
    const tableBody = tableBodyScroll.current;
    if (!tableBody) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = tableBody;

      if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreRows();
      }
    };

    tableBody.addEventListener("scroll", handleScroll);
    return () => tableBody.removeEventListener("scroll", handleScroll);
  }, [activeRows, loadMoreRows]);

  useEffect(() => {
    setActiveRows(previewTable?.slice(0, 15));
  }, [previewTable]);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const updateLastSeletedCell = (lastCell: HTMLTableCellElement) => {
    if (isDragging) {
      const table = tableBodyScroll.current;
      if (!table) return;

      const [cellCol, cellRow] = lastCell.id
        .split("-")
        .map((vl) => Number(vl.replace(/[^0-9]/g, "")));

      const [initialRow, initialCol, finalRow, finalCol] = [
        selectedRange?.initialRow ?? 0,
        selectedRange?.initialCol ?? 0,
        selectedRange?.finalRow ?? 0,
        selectedRange?.finalCol ?? 0,
      ];

      const startRow = Math.min(initialRow, cellRow);
      const startCol = Math.min(initialCol, cellCol);

      const endRow = Math.max(initialRow, Math.max(cellRow, finalRow));
      const endCol = Math.max(initialCol, Math.max(cellCol, finalCol));

      setSelectedRange((prev) => ({
        ...prev,
        initialRow: startRow,
        initialCol: startCol,
        finalRow: endRow,
        finalCol: endCol,
      }));
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      const cell = e.target.closest("td") || e.target.closest("th");
      if (cell) {
        if (cell.id.includes("first")) {
          setIsDragging(false);
          return;
        }

        setIsDragging(true);
        readSelectedCells({ classList: "remove" });

        const [col, row] = cell.id.match(/\d+/g) || [];

        setSelectedRange({
          initialCol: Number(col),
          initialRow: Number(row),
          finalCol: Number(col),
          finalRow: Number(row),
        });
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        const td = e.target.closest("td");
        if (td) {
          updateLastSeletedCell(td);
        }
      }
    }, 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <div className="relative flex flex-col h-full w-[60%]">
      {previewTable?.[0] != null ? (
        <>
          <div className="flex flex-col h-full overflow-hidden border-1 border-b-gray-500 rounded-xl select-none">
            <Table
              ref={tableBodyScroll}
              onMouseDown={(e) => handleMouseDown(e)}
              onMouseMove={(e) => handleMouseMove(e)}
              onDragEnd={() => handleMouseUp()}
              className="select-none"
            >
              <TableHeader className="sticky top-0 bg-zinc-900 z-50">
                {/* COLUMNS LETTER */}
                <TableRow className="bg-zinc-800 ">
                  {previewTable[0].map((_cell, i) => (
                    <Fragment key={`fragment-col-letter${i}`}>
                      {i == 0 && (
                        <TableHead key={`head-letter`} className="p-0" />
                      )}
                      <TableHead key={`head-letter-${numberToLetter[i]}`}>
                        {numberToLetter[i]}
                      </TableHead>
                    </Fragment>
                  ))}
                </TableRow>

                {/* COLUMNS LABELS */}
                <TableRow>
                  {previewTable[0].map((cell, i) => (
                    <Fragment key={`fragment-col-label${i}`}>
                      {i == 0 && (
                        <TableHead
                          key={`head-first-label-${i}`}
                          id={`col${i}-row${0}-first`}
                          className="bg-zinc-800 p-0 text-center"
                        >
                          1
                        </TableHead>
                      )}
                      <TableHead key={`head-label-${i}`} id={`col${i}-row${1}`}>
                        {cell}
                      </TableHead>
                    </Fragment>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="relative overflow-scroll">
                {activeRows != null &&
                  activeRows.slice(1).map((row, i) => (
                    <TableRow key={`bodyRow-${i + 2}`}>
                      {row.map((cell, j) => (
                        <Fragment key={`fragment-rows${i}-col${j}`}>
                          {/* ROWS NUMBERS */}
                          {j === 0 && (
                            <TableCell
                              id={`colfirst-row${i + 2}`}
                              className="bg-zinc-800 p-0 text-center"
                              key={`row-number-${j}-row-${i + 2}`}
                            >
                              {i + 2}
                            </TableCell>
                          )}

                          {/* ROWS ITEMS */}
                          <TableCell
                            id={`col${j}-row${i + 2}`}
                            key={`tableCell-${j}-row-${i + 2}`}
                          >
                            {cell}
                          </TableCell>
                        </Fragment>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <span className="mt-4 text-sm text-muted-foreground text-left">
            Pré visualização - {fileName}
          </span>
        </>
      ) : (
        <div className="flex flex-col items-start my-auto">
          <h3 className="flex-1 font-semibold text-2xl text-white">
            Página da planila está vazia
          </h3>
          <span className="mt-4 text-sm text-muted-foreground text-left">
            Pré visualização - {fileName}
          </span>
        </div>
      )}
    </div>
  );
}
