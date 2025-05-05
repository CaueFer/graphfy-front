"use client";

import { useEffect, useRef, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { numberToLetter } from "@/lib/defaultConstants";

interface PreviewTableProps {
  fileName: string;
  previewTable: string[][] | null;
}
export default function PreviewTable({
  fileName,
  previewTable,
}: PreviewTableProps) {
  const tableBodyScroll = useRef<HTMLTableElement>(null);
  const [activeRows, setActiveRows] = useState(previewTable?.slice(0, 15));

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

  const loadMoreRows = () => {
    setActiveRows((prev) => {
      if (!prev || !previewTable) return;

      const currentLength = prev.length;
      const nextRows = previewTable.slice(currentLength, currentLength + 15);
      return [...prev, ...nextRows];
    });
  };

  return (
    <div className="relative flex flex-col h-full w-[60%]">
      {previewTable?.[0] != null ? (
        <>
          <div className="flex flex-col h-full overflow-hidden border-1 border-b-gray-500 rounded-xl">
            <Table ref={tableBodyScroll}>
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
                              className="bg-zinc-800 p-0 text-center"
                              key={`tableCell-first-${j}-row-${i}`}
                            >
                              {i + 2}
                            </TableCell>
                          )}

                          {/* ROWS ITEMS */}
                          <TableCell key={`tableCell-${j}-row-${i}`}>
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
