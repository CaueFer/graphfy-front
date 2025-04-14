const acceptPlanilhas = {
  "application/vnd.ms-excel": [".xls"], // Excel 97-2003
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ], // Excel moderno
  "application/vnd.ms-excel.sheet.macroEnabled.12": [".xlsm"], // Excel com macros
  "text/csv": [".csv"], // Planilhas CSV
};

const timeoutHeroTransition = 700;

export { acceptPlanilhas, timeoutHeroTransition };
