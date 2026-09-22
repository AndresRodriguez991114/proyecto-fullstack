import ExcelJS from "exceljs";

async function generarExcel(res, titulo, columnas, datos) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(titulo.substring(0, 31));

  // Configurar columnas
  sheet.columns = columnas.map((col) => ({
    header: col.header,
    key: col.key,
    width: Math.max(14, col.header.length + 4),
    alignment: { horizontal: "left", vertical: "center", wrapText: true }
  }));

  // Agregar datos
  datos.forEach((row) => sheet.addRow(row));

  // Formato del encabezado
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" } };
  headerRow.alignment = { horizontal: "center", vertical: "center" };

  // Formato alterno para filas
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      if (rowNumber % 2 === 0) {
        row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2F2F2" } };
      }
      row.alignment = { horizontal: "left", vertical: "center", wrapText: true };
    }
  });

  // Congelar la fila de encabezado
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  // Agregar información del reporte al inicio
  sheet.insertRow(1, []);
  sheet.insertRow(1, [titulo]);
  const titleRow = sheet.getRow(1);
  titleRow.font = { bold: true, size: 14 };
  sheet.mergeCells("A1:Z1");

  sheet.insertRow(2, []);
  sheet.insertRow(3, [`Generado: ${new Date().toLocaleString("es-ES")}`]);
  const dateRow = sheet.getRow(3);
  dateRow.font = { italic: true, size: 10, color: { argb: "FF666666" } };

  // Headers HTTP
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=${titulo.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
}

export default generarExcel;
