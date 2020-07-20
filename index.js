const XLSX = require("xlsx");
const fs = require("fs");

const workbook = XLSX.readFile("data/excel_input.xlsx");
const input = JSON.parse(fs.readFileSync("data/arb_input.arb"));
const list = JSON.parse(fs.readFileSync("data/list.json"));

const sheets = workbook.Sheets;
const sheetName = workbook.SheetNames[0];

const data = XLSX.utils.sheet_to_json(sheets[sheetName]);

function makesome(selector) {
  let index = 0;

  return Object.entries(input)
    .map(([key, value]) => {
      const row = data[index];
      if (
        typeof value === "string" &&
        key !== "@@last_modified" &&
        row !== undefined
      ) {
        index++;
        return [key, row[selector]];
      }
      return [key, value];
    })
    .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {});
}

for (let config of list) {
  fs.writeFileSync(
    `build/intl_${config.name}.arb`,
    JSON.stringify(makesome(config.key))
  );
}
