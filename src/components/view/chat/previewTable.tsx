"use client";

import {
  Dispatch,
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

const selectedRowColor = ["bg-muted/50", "hover:bg-muted/50"];

interface PreviewTableProps {
  fileName: string;
  previewTable: string[][] | null;
  setSelectedRange: Dispatch<
    SetStateAction<{
      initialRow?: number;
      initialCol?: number;
      finalRow?: number;
      finalCol?: number;
    } | null>
  >;
}
export default function PreviewTable({
  fileName,
  previewTable,
  setSelectedRange,
}: PreviewTableProps) {
  const tableBodyScroll = useRef<HTMLTableElement>(null);
  const [activeRows, setActiveRows] = useState(previewTable?.slice(0, 15));

  const [isDragging, setIsDragging] = useState(false);
  const startCellRef = useRef<HTMLTableCellElement | null>(null);
  const [selectedCells, setSelectedCell] = useState<Record<string, any>[]>([]);
  const selectedCellsRefs = useRef<HTMLTableCellElement[]>([]);

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

  useEffect(() => {
    if (selectedCells.length > 0) {
      const initialRow = selectedCells[0].row;
      const initialCol = selectedCells[0].col;

      const finalRow = selectedCells[selectedCells.length - 1].row;
      const finalCol = selectedCells[selectedCells.length - 1].col;

      setSelectedRange({
        initialRow,
        initialCol,
        finalRow,
        finalCol,
      });
    }
  }, [selectedCells]);

  const loadMoreRows = () => {
    setActiveRows((prev) => {
      if (!prev || !previewTable) return;

      const currentLength = prev.length;
      const nextRows = previewTable.slice(currentLength, currentLength + 15);
      return [...prev, ...nextRows];
    });
  };

  const clearSelection = () => {
    selectedCellsRefs.current.forEach((cell) => {
      cell.classList.remove(...selectedRowColor);
    });

    setSelectedCell([]);
    selectedCellsRefs.current = [];
  };

  const selectCellsInRange = (
    startCell: HTMLTableCellElement,
    endCell: HTMLTableCellElement
  ) => {
    clearSelection();

    const table = tableBodyScroll.current;
    if (!table) return;

    // PEGAS AS LINHAS DA TABELA
    const rows = Array.from(table.querySelectorAll("tr"));

    // CALCULA X E Y DA CELULA
    const getCellPosition = (cell: HTMLTableCellElement) => {
      const row = cell.parentElement as HTMLTableRowElement;
      const rowIndex = rows.indexOf(row);
      const cellIndex = Array.from(row.cells).indexOf(cell);
      return { rowIndex, cellIndex };
    };

    const startPos = getCellPosition(startCell);
    const endPos = getCellPosition(endCell);

    const minRow = Math.min(startPos.rowIndex, endPos.rowIndex);
    const maxRow = Math.max(startPos.rowIndex, endPos.rowIndex);
    const minCol = Math.min(startPos.cellIndex, endPos.cellIndex);
    const maxCol = Math.max(startPos.cellIndex, endPos.cellIndex);

    for (let i = minRow; i <= maxRow; i++) {
      const row = rows[i];
      const cells = Array.from(row.cells);
      for (let j = minCol; j <= maxCol; j++) {
        const cell = cells[j];
        if (cell) {
          cell.classList.add(...selectedRowColor);
          selectedCellsRefs.current.push(cell);

          const newCell = {
            cell: cell,
            row: i,
            col: j - 1,
          };
          setSelectedCell((prev) => [...prev, newCell]);
        }
      }
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      const td = e.target.closest("td");
      if (td) {
        setIsDragging(true);
        clearSelection();

        const [col, row] = td.id.match(/\d+/g) || [];

        startCellRef.current = td;
        td.classList.add(...selectedRowColor);
        const newCell = {
          cell: td,
          row: Number(row) + 2,
          col: Number(col),
        };

        setSelectedCell((prev) => [...prev, newCell]);
        selectedCellsRefs.current.push(td);
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
        if (td && startCellRef.current) {
          selectCellsInRange(startCellRef.current, td);
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
                    <>
                      {i == 0 && (
                        <TableHead key={`head-0`} className="p-0"></TableHead>
                      )}
                      <TableHead key={`head-${numberToLetter[i]}`}>
                        {numberToLetter[i]}
                      </TableHead>
                    </>
                  ))}
                </TableRow>

                {/* COLUMNS LABELS */}
                <TableRow>
                  {previewTable[0].map((cell, i) => (
                    <>
                      {i == 0 && (
                        <TableHead
                          key={`head-first-${numberToLetter[i]}`}
                          className="bg-zinc-800 p-0 text-center"
                        >
                          1
                        </TableHead>
                      )}
                      <TableHead key={`head-${i}`}>{cell}</TableHead>
                    </>
                  ))}
                </TableRow>
              </TableHeader>
              
              <TableBody className="relative overflow-scroll">
                {activeRows != null &&
                  activeRows.slice(1).map((row, i) => (
                    <TableRow key={`tableRow-${i}`}>
                      {row.map((cell, j) => (
                        <>
                          {/* ROWS NUMBERS */}
                          {j === 0 && (
                            <TableCell
                              id={`collumn${j}-row${i}`}
                              className="bg-zinc-800 p-0 text-center"
                              key={`tableCell-first-${j}-row-${i}`}
                            >
                              {i + 2}
                            </TableCell>
                          )}

                          {/* ROWS ITEMS */}
                          <TableCell
                            id={`collumn${j}-row${i}`}
                            key={`tableCell-${j}-row-${i}`}
                          >
                            {cell}
                          </TableCell>
                        </>
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
