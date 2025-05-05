"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MessageSquare, TableProperties } from "lucide-react";
import { Button, Input } from "@nextui-org/react";
import classNames from "classnames";
import ExcelJS from "exceljs";

import { DefaultDropzone } from "../../ui/Dropzone";
import PreviewTable from "./previewTable";
import { Message } from "./Message";
import { Button as ButtonSd } from "@/components/ui/button";
import { SheetRangeInput } from "@/components/ui/inputs/rangeInput";

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
        const stringifyArray: string[] = row.values.map((cell) => String(cell));

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
                    <svg
                      className="size-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Table Preview */}
      {messages.length < 1 && previewTable != null && (
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
              />
              :
              <SheetRangeInput
                label="Fim"
                size="sm"
                labelPlacement="inside"
                placeholder="Z:50"
                disabled={previewTable?.[0] == null}
              />
            </div>

            {/* SHEETS */}
            <div className="flex flex-col justify-start items-start gap-3 mt-6">
              <p className="text-zinc-500 text-xl text-left">
                Selecionar página —
              </p>
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
                    <svg
                      className="size-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
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
              onClick={() => null}
              disabled={isFileUploading}
            >
              {!isFileUploading ? (
                "Enviar Intervalo"
              ) : (
                <>
                  Enviando
                  <svg
                    className="size-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </>
              )}
            </Button>
          </div>

          <div className="w-[2px] h-[50%] bg-muted mx-4" />

          <PreviewTable
            fileName={file?.name as string}
            previewTable={previewTable}
          />
        </div>
      )}
    </div>
  );
};
