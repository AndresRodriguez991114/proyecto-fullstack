    const ExcelJS = require("exceljs");

async function generarExcel(res, titulo, columnas, datos) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(titulo);

  sheet.columns = columnas;

  datos.forEach(row => sheet.addRow(row));

  sheet.getRow(1).font = { bold: true };

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${titulo}.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
}

module.exports = generarExcel;
