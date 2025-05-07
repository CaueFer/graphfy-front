"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@nextui-org/react";
import classNames from "classnames";
import ExcelJS from "exceljs";

import { PreviewContainer } from "./table/previewContainer";
import SpinnerSvg from "@/components/svgs/spinner";
import { DefaultDropzone } from "../../ui/Dropzone";
import { Message } from "./Message";
import { ChatMessage } from "./type";

interface ChatContentProps {
  file: File | null;
  messageStatus: string;
  fileUpload: () => void;
  messages: ChatMessage[];
  isFileUploading: boolean;
  isLoadingMessage: boolean;
  isInicialLoading: boolean;
  setFile: Dispatch<SetStateAction<File | null>>;
  setSmallMenu: Dispatch<SetStateAction<boolean>>;
}

export const ChatContent = ({
  messages,
  file,
  setFile,
  fileUpload,
  messageStatus,
  isFileUploading,
  isLoadingMessage,
  isInicialLoading = false,
  setSmallMenu,
}: ChatContentProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const [isRender, setIsRender] = useState(true);
  const [isLoadingPrewiew, setIsLoadingPreview] = useState(false);

  const [workbook, setWorkbook] = useState<ExcelJS.Workbook | null>(null);
  const [workbookTotalSheets, setWorkbookTotalSheets] = useState<number>(0);
  const [workbookSheets, setWorkbookSheets] = useState<string[] | null>(null);
  const [previewTable, setPreviewTable] = useState<string[][] | null>(null);

  const [selectedSheet, setSelectedSheet] = useState<number>(0);

  useEffect(() => {
    if (dropzoneRef?.current != null) {
      dropzoneRef.current.focus();
    }

    setIsRender(false);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    renderWorksheet();
  }, [workbook]);

  const handleLoadPreviewTable = useCallback(() => {
    if (!file) return;
    setIsLoadingPreview(true);

    setWorkbook(null);
    setWorkbookSheets(null);
    setPreviewTable(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const buffer = reader.result as ArrayBuffer;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      setWorkbook(workbook);

      setWorkbookTotalSheets(workbook.worksheets.length - 1);

      // PRIMEIRO LER A PRIMEIRA PAGINA
      const firstPage = workbook.worksheets[0];
      setWorkbookSheets([firstPage.name]);

      // DEPOIS LER AS OUTRAS DE FORMA ASYNC
      setTimeout(async () => {
        const remainingSheets = workbook.worksheets.slice(1);
        const sheetNames = remainingSheets.map((worksheet) => worksheet.name);

        setWorkbookSheets((prev) =>
          prev ? [...prev, ...sheetNames] : [...sheetNames]
        );
      }, 0);

      setTimeout(async () => setWorkbookTotalSheets(0), 0);
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  const renderWorksheet = (worksheetNumber: number = 0) => {
    if (workbook == null) return;
    setIsLoadingPreview(true);

    const worksheet = workbook.worksheets[worksheetNumber]; // pega a aba
    const rows: string[][] = [];

    worksheet.eachRow((row) => {
      if (Array.isArray(row.values)) {
        const notEmptyArray = Array.from(row.values); // transforme os itens EMPTY em undefined para o map reconhecer
        const stringifyArray: string[] = notEmptyArray.map((cell) =>
          cell == null ? "" : String(cell)
        );

        rows.push(stringifyArray.slice(1)); // remove o índice 0 q eh undefined por padrao
      }
    });

    setIsLoadingPreview(false);
    setSmallMenu(true);

    // DADOS PARA O COMPONENT DA TABELA
    setPreviewTable(rows);
  };

  return (
    <div
      ref={containerRef}
      className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col overflow-y-auto scroll-smooth"
    >
      {/* Messages */}
      {messages.length > 0 && (
        <>
          {messages.map((message) => (
            <>
              <Message
                key={message.id}
                content={message.content}
                isUserMessage={message.role === "user"}
                isErrorMessage={message.role === "error"}
                isLoadingMessage={message.role === "loading"}
              />
            </>
          ))}
          {isLoadingMessage && (
            <>
              {messageStatus != "" && (
                <div className="px-6 ">
                  <div className="max-w-3xl mx-auto flex items-start">
                    <h2 className=" statusTextGradient">{messageStatus}</h2>
                  </div>
                </div>
              )}
              <Message
                key={`loading-${Date.now()}`}
                content={"loading"}
                isUserMessage={false}
              />
            </>
          )}
        </>
      )}

      {/* DROPZONE */}
      {messages.length < 1 && previewTable == null && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="size-10 text-blue-500" />
          <h3 className="font-semibold text-2xl text-white">Tudo pronto!</h3>
          <p className="text-zinc-500 text-xl text-center">
            Envie sua planilha para gerar seus primeiros gráficos.
          </p>

          <div className="w-full flex flex-col justify-center items-center gap-5 mt-5">
            <DefaultDropzone
              ref={dropzoneRef}
              setFile={setFile}
              file={file}
              disabled={isRender}
            />

            {file && (
              <Button
                color="primary"
                variant="flat"
                onClick={() => handleLoadPreviewTable()}
                className={classNames(" bg-blue-600  ease-in-out ", {
                  "opacity-0 -translate-y-2 ": !file,
                  "opacity-1 translate-y-5 ": file,
                  "animate-pulse": isLoadingPrewiew,
                })}
                disabled={isLoadingPrewiew}
              >
                {!isLoadingPrewiew ? (
                  "Carregar Planilha"
                ) : (
                  <>
                    Carregando
                    <SpinnerSvg />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table Preview */}
      {messages.length < 1 && previewTable != null && (
        <PreviewContainer
          file={file}
          previewTable={previewTable}
          selectedSheet={selectedSheet}
          workbookSheets={workbookSheets}
          isFileUploading={isFileUploading}
          renderWorksheet={renderWorksheet}
          setSelectedSheet={setSelectedSheet}
          workbookTotalSheets={workbookTotalSheets}
        />
      )}
    </div>
  );
};
