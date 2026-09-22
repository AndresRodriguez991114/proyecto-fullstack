import PDFDocument from "pdfkit";

function generarPDF(res, titulo, columnas, datos) {
  const isWideReport = columnas.length > 6;
  const margin = isWideReport ? 30 : 40;
  const doc = new PDFDocument({
    margin,
    size: "A4",
    layout: isWideReport ? "landscape" : "portrait"
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${titulo.replace(/\s+/g, "_")}.pdf`);

  doc.pipe(res);

  const contentWidth = doc.page.width - margin * 2;

  // Título del reporte
  doc.fontSize(18).font("Helvetica-Bold").text(titulo, { align: "center" });
  doc.moveDown(0.5);

  // Fecha de generación
  doc.fontSize(10).font("Helvetica").text(`Generado: ${new Date().toLocaleString("es-ES")}`, { align: "center", opacity: 0.7 });
  doc.moveDown();

  // Línea separadora
  doc.strokeColor("#cccccc").moveTo(margin, doc.y).lineTo(doc.page.width - margin, doc.y).stroke();
  doc.moveDown(0.5);

  // Las tablas anchas necesitan proporciones para conservar legibilidad.
  const weightForColumn = (column) => {
    const header = column.header.toLowerCase();
    if (header === "id") return 0.55;
    if (header === "s/n") return 0.75;
    if (header.includes("observ")) return 1.35;
    if (header.includes("depart")) return 1.25;
    if (header.includes("fecha")) return 1.05;
    return 1;
  };

  const totalWeight = columnas.reduce((total, column) => total + weightForColumn(column), 0);
  const columnWidths = columnas.map((column) => contentWidth * weightForColumn(column) / totalWeight);
  const tableX = margin;
  const drawTableLine = () => {
    doc.strokeColor("#e0e0e0").moveTo(tableX, doc.y).lineTo(doc.page.width - margin, doc.y).stroke();
  };

  const drawHeader = () => {
    let xPosition = tableX;
    const headerY = doc.y;

    doc.fontSize(isWideReport ? 7 : 10).font("Helvetica-Bold").fillColor("#000000");
    columnas.forEach((col, index) => {
      doc.text(col.header, xPosition, headerY, {
        width: columnWidths[index] - 4,
        ellipsis: true,
        lineBreak: false
      });
      xPosition += columnWidths[index];
    });

    doc.y = headerY + (isWideReport ? 13 : 16);
    drawTableLine();
    doc.moveDown(0.3);
  };

  drawHeader();

  // Datos de la tabla
  const rowHeight = isWideReport ? 14 : 16;
  doc.fontSize(isWideReport ? 6.5 : 9).font("Helvetica").fillColor("#333333");
  let rowIndex = 0;

  datos.forEach((row) => {
    if (doc.y + rowHeight > doc.page.height - margin - 35) {
      doc.addPage();
      drawHeader();
      doc.fontSize(isWideReport ? 6.5 : 9).font("Helvetica").fillColor("#333333");
    }

    let xPosition = tableX;
    const rowY = doc.y;

    // Color alterno para filas
    if (rowIndex % 2 === 0) {
      doc.rect(tableX, rowY - 2, contentWidth, rowHeight).fill("#f9f9f9");
    }

    columnas.forEach((col, index) => {
      const value = (row[col.key] ?? "").toString();
      doc.fillColor("#333333").text(value, xPosition, rowY, {
        width: columnWidths[index] - 4,
        ellipsis: true,
        lineBreak: false
      });
      xPosition += columnWidths[index];
    });

    doc.y = rowY + rowHeight;
    rowIndex++;
  });

  // Línea final
  drawTableLine();
  doc.moveDown();

  // Pie de página
  doc.fontSize(8).fillColor("#999999").text(`Total de registros: ${datos.length}`, { align: "center", opacity: 0.7 });
  doc.text("Cloud + Inventory © 2025", { align: "center", opacity: 0.7 });

  doc.end();
}

export default generarPDF;
