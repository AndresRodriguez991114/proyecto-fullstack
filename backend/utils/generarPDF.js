const PDFDocument = require("pdfkit");

function generarPDF(res, titulo, columnas, datos) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${titulo}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(18).text(titulo, { align: "center" });
  doc.moveDown();

  doc.fontSize(10).text(columnas.map(c => c.header).join(" | "));
  doc.moveDown();

  datos.forEach(row => {
    doc.text(
      columnas.map(c => row[c.key] ?? "").join(" | ")
    );
  });

  doc.end();
}

module.exports = generarPDF;
