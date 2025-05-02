import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleSlash2 } from "lucide-react";

interface PreviewTableProps {
  fileName: string;
  previewTable: string[][] | null;
}
export default function PreviewTable({
  fileName,
  previewTable,
}: PreviewTableProps) {
  return (
    <div className="relative flex flex-col h-full w-[60%]">
      {previewTable?.[0] != null ? (
        <>
          <div className="flex flex-col h-full overflow-hidden border-1 border-b-gray-500 rounded-xl">
            <Table>
              <TableHeader className="sticky top-0 bg-zinc-900 z-50">
                <TableRow>
                  {previewTable[0].map((cell, i) => (
                    <TableHead key={`head-${i}`}>{cell}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="relative overflow-scroll">
                {previewTable != null &&
                  previewTable.slice(1).map((row, i) => (
                    <TableRow key={`tableRow-${i}`}>
                      {row.map((cell, j) => (
                        <TableCell key={`tableCell-${j}-row-${i}`}>
                          {cell}
                        </TableCell>
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
