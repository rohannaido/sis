import * as XLSX from "xlsx";

export function downloadExcelWithData(data: any[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `books_sample.xlsx`);
}

export function getExcelOutputDataExceptHeader(excelFileData: Uint8Array) {
  const workbook = XLSX.read(excelFileData, { type: "array" });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const keys: any = jsonData?.shift();
  const data = jsonData?.map((row: any) => {
    const obj: any = {};
    for (let i = 0; i < row.length; i++) {
      obj[keys[i]] = row[i];
    }
    return obj;
  });
  return data;
}
