"use client";

import { Dispatch, RefObject, useCallback, useState } from "react";

import { FileUp, Sheet, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import classNames from "classnames";

import { acceptPlanilhas } from "@/lib/defaultConstants";

interface DefaultDropzoneProps {
  className?: string;
  ref?: RefObject<HTMLDivElement>;
  setFile: Dispatch<any>;
  file: any;
}
export default function DefaultDropzone({
  className,
  ref,
  setFile,
  file,
}: DefaultDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: any[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      onDrop,
      accept: acceptPlanilhas,
    });

  return (
    <div
      ref={ref}
      className={classNames(
        "relative p-4 flex justify-center items-center rounded-lg w-[550px] h-[160px] border border-blue-400  hover:bg-blue-400/[0.05]  text-white text-sm  select-none",
        {}
      )}
    >
      {file == null ? (
        <>
          <div
            {...getRootProps()}
            className="absolute inset-0 w-full flex justify-center items-center cursor-pointer"
          >
            <div className="flex flex-col justify-center items-center gap-4 cursor-pointer">
              <FileUp size={32} />
              <input {...getInputProps()} />
              <p className="text-center text-md">
                Arraste e solte sua planilha aqui, ou clique para selecionar.
              </p>
            </div>
            {fileRejections.length > 0 && (
              <div className="absolute top-[-10px] w-[200px] h-[30px] rounded-md bg-danger-400 text-white flex justify-center items-center">
                <p className="text-center">Tipo de arquivo inválido!</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center gap-4">
            <Sheet size={34} />
            <p className="text-center">{file.name}</p>
          </div>

          <div className="absolute top-4 right-3">
            <X
              className="cursor-pointer"
              size={22}
              onClick={() => setFile(null)}
            />
          </div>
        </>
      )}
    </div>
  );
}
