import { NextApiRequest, NextApiResponse } from "next";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

type ExcelRow = [string, string, string];
type ExcelData = { col2: string; col3: string };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.resolve("public", "data.xlsx");
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
  });

  const map = new Map<string, ExcelData[]>();

  jsonData.forEach((row, index) => {
    if (index > 0) {
      const key = row[0];
      //   const value = { term: row[1], description: row[2] };
      const value = { term: row[1] };
      if (map.has(key)) {
        map.get(key)!.push(value);
      } else {
        map.set(key, [value]);
      }
    }
  });

  res.status(200).json([...map]);
}
