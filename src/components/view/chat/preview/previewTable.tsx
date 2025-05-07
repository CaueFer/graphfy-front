"use client";

import {
  Dispatch,
  Fragment,
  MouseEvent,
  SetStateAction,
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
  }, [activeRows]);

  useEffect(() => {
    setActiveRows(previewTable?.slice(0, 15));
  }, [previewTable]);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const loadMoreRows = () => {
    setActiveRows((prev) => {
      if (!prev || !previewTable) return;

      const currentLength = prev.length;
      const nextRows = previewTable.slice(currentLength, currentLength + 15);
      return [...prev, ...nextRows];
    });
  };

  const updateLastSeletedCell = (lastCell: HTMLTableCellElement) => {
    const table = tableBodyScroll.current;
    if (!table) return;

    const [col, row] = lastCell.id
      .split("-")
      .map((vl) => Number(vl.replace(/[^0-9]/g, "")));

    const [initialRow, initialCol] = [
      selectedRange?.initialRow ?? 0,
      selectedRange?.initialCol ?? 0,
    ];

    const lastSelectedItem = row + col;
    const firstSelectedItem = initialRow + initialCol;

    setSelectedRange((prev) => ({
      ...prev,
      ...(lastSelectedItem > firstSelectedItem
        ? { finalRow: row, finalCol: col }
        : { initialRow: row, initialCol: col }),
    }));
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      const td = e.target.closest("td");
      if (td) {
        setIsDragging(true);
        readSelectedCells({ classList: "remove" });

        const [col, row] = td.id.match(/\d+/g) || [];

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
              onMouseUp={() => handleMouseUp()}
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
                          className="bg-zinc-800 p-0 text-center"
                        >
                          1
                        </TableHead>
                      )}
                      <TableHead key={`head-label-${i}`}>{cell}</TableHead>
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
