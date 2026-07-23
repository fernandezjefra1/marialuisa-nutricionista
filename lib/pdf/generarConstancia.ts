import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fs from "fs";
import path from "path";

// TODO: Reemplazar public/images/firma-marialuisa.png con la firma escaneada real de la clienta
// TODO: Reemplazar CNP N° [PENDIENTE] con el número real de colegiatura de María Luisa

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatFechaLarga(fecha: Date): string {
  const dia = fecha.getDate();
  const mes = MESES[fecha.getMonth()];
  const anio = fecha.getFullYear();
  return `${dia} de ${mes} de ${anio}, Lima – Perú`;
}

function leerImagenSiExiste(relPath: string): Buffer | null {
  const absPath = path.join(process.cwd(), "public", relPath);
  if (!fs.existsSync(absPath)) return null;
  return fs.readFileSync(absPath);
}

function envolverTexto(texto: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const palabras = texto.split(" ");
  const lineas: string[] = [];
  let lineaActual = "";

  for (const palabra of palabras) {
    const candidata = lineaActual ? `${lineaActual} ${palabra}` : palabra;
    if (font.widthOfTextAtSize(candidata, size) > maxWidth && lineaActual) {
      lineas.push(lineaActual);
      lineaActual = palabra;
    } else {
      lineaActual = candidata;
    }
  }
  if (lineaActual) lineas.push(lineaActual);
  return lineas;
}

function dibujarParrafo(
  page: PDFPage,
  texto: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lineas = envolverTexto(texto, font, size, maxWidth);
  let cursorY = y;
  for (const linea of lineas) {
    page.drawText(linea, { x, y: cursorY, font, size, color: rgb(0.1, 0.1, 0.1) });
    cursorY -= lineHeight;
  }
  return cursorY;
}

export async function generarConstancia(data: {
  nombre: string;
  dni: string;
  empresa: string;
  motivo: string;
  imc: number;
  categoria: string;
  peso_kg: number;
  altura_cm: number;
  fecha: Date;
  solicitud_id: string;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 vertical
  const { width } = page.getSize();
  const marginX = 56;
  const contentWidth = width - marginX * 2;

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let y = 780;

  // ── Encabezado: logo + fecha ──────────────────────────────────────────
  const logoBytes = leerImagenSiExiste("images/logoNutricion.png");
  if (logoBytes) {
    const logoImg = await pdfDoc.embedPng(logoBytes);
    const logoDim = logoImg.scale(48 / logoImg.width);
    page.drawImage(logoImg, { x: marginX, y: y - 12, width: logoDim.width, height: logoDim.height });
  }

  const fechaTexto = formatFechaLarga(data.fecha);
  const fechaWidth = fontRegular.widthOfTextAtSize(fechaTexto, 10);
  page.drawText(fechaTexto, { x: width - marginX - fechaWidth, y: y + 10, font: fontRegular, size: 10, color: rgb(0.35, 0.35, 0.35) });

  y -= 60;

  // ── Título ──────────────────────────────────────────────────────────
  const titulo = "CONSTANCIA NUTRICIONAL";
  const tituloWidth = fontBold.widthOfTextAtSize(titulo, 20);
  page.drawText(titulo, { x: (width - tituloWidth) / 2, y, font: fontBold, size: 20, color: rgb(0.1, 0.35, 0.15) });
  y -= 40;

  // ── Párrafo formal ──────────────────────────────────────────────────
  const parrafoIntro =
    `Yo, Lic. María Luisa Peña Valdivia, Nutricionista Colegiada, hago constar que el(la) Sr(a). ` +
    `${data.nombre}, identificado(a) con DNI N° ${data.dni}, ha realizado una evaluación de su ` +
    `Índice de Masa Corporal (IMC) con los siguientes resultados:`;
  y = dibujarParrafo(page, parrafoIntro, marginX, y, fontRegular, 11, contentWidth, 16) - 20;

  // ── Tabla de resultados ───────────────────────────────────────────────
  const filas: [string, string][] = [
    ["Peso", `${data.peso_kg.toFixed(2)} kg`],
    ["Altura", `${data.altura_cm} cm`],
    ["IMC", data.imc.toFixed(2)],
    ["Categoría", data.categoria],
  ];
  const tablaX = marginX;
  const tablaWidth = contentWidth;
  const filaAltura = 26;
  const colEtiquetaWidth = tablaWidth * 0.4;

  page.drawRectangle({
    x: tablaX, y: y - filaAltura * filas.length,
    width: tablaWidth, height: filaAltura * filas.length,
    borderColor: rgb(0.7, 0.85, 0.75), borderWidth: 1,
  });

  filas.forEach(([etiqueta, valor], i) => {
    const filaY = y - filaAltura * i - filaAltura + 8;
    if (i > 0) {
      page.drawLine({
        start: { x: tablaX, y: filaY + filaAltura - 8 },
        end: { x: tablaX + tablaWidth, y: filaY + filaAltura - 8 },
        thickness: 0.5, color: rgb(0.85, 0.85, 0.85),
      });
    }
    page.drawText(etiqueta, { x: tablaX + 12, y: filaY, font: fontBold, size: 11, color: rgb(0.1, 0.35, 0.15) });
    page.drawText(valor, { x: tablaX + colEtiquetaWidth, y: filaY, font: fontRegular, size: 11, color: rgb(0.1, 0.1, 0.1) });
  });

  y -= filaAltura * filas.length + 24;

  // ── Conclusión ─────────────────────────────────────────────────────
  const conclusion =
    "Los resultados obtenidos indican un estado nutricional dentro de los rangos considerados " +
    "saludables por la Organización Mundial de la Salud (OMS), apto para las actividades laborales regulares.";
  y = dibujarParrafo(page, conclusion, marginX, y, fontRegular, 11, contentWidth, 16) - 20;

  // ── Motivo y empresa ──────────────────────────────────────────────────
  y = dibujarParrafo(page, `Motivo de la constancia: ${data.motivo}`, marginX, y, fontBold, 11, contentWidth, 16) - 8;
  y = dibujarParrafo(
    page,
    `Emitida a solicitud del(la) interesado(a) para presentar ante: ${data.empresa}`,
    marginX, y, fontRegular, 11, contentWidth, 16
  ) - 40;

  // ── Firma y sello ─────────────────────────────────────────────────────
  const firmaY = Math.max(y, 200);
  const firmaBytes = leerImagenSiExiste("images/firma-marialuisa.png");
  if (firmaBytes) {
    const firmaImg = await pdfDoc.embedPng(firmaBytes);
    const firmaDim = firmaImg.scale(120 / firmaImg.width);
    page.drawImage(firmaImg, { x: marginX, y: firmaY, width: firmaDim.width, height: firmaDim.height });
  }
  page.drawLine({
    start: { x: marginX, y: firmaY - 4 },
    end: { x: marginX + 200, y: firmaY - 4 },
    thickness: 1, color: rgb(0.3, 0.3, 0.3),
  });
  page.drawText("Lic. María Luisa Peña Valdivia", { x: marginX, y: firmaY - 18, font: fontBold, size: 10, color: rgb(0.1, 0.1, 0.1) });
  page.drawText("Nutricionista Colegiada", { x: marginX, y: firmaY - 30, font: fontRegular, size: 9, color: rgb(0.3, 0.3, 0.3) });
  page.drawText("CNP N° [PENDIENTE]", { x: marginX, y: firmaY - 42, font: fontRegular, size: 9, color: rgb(0.3, 0.3, 0.3) });

  // Sello placeholder (círculo punteado)
  const selloX = width - marginX - 70;
  const selloY = firmaY - 20;
  page.drawEllipse({
    x: selloX, y: selloY, xScale: 45, yScale: 45,
    borderColor: rgb(0.6, 0.6, 0.6), borderWidth: 1,
    borderDashArray: [4, 3],
  });
  page.drawText("SELLO", { x: selloX - 15, y: selloY + 6, font: fontRegular, size: 8, color: rgb(0.6, 0.6, 0.6) });
  page.drawText("COLEGIO DE", { x: selloX - 26, y: selloY - 4, font: fontRegular, size: 7, color: rgb(0.6, 0.6, 0.6) });
  page.drawText("NUTRICIONISTAS", { x: selloX - 32, y: selloY - 14, font: fontRegular, size: 7, color: rgb(0.6, 0.6, 0.6) });
  page.drawText("DEL PERÚ", { x: selloX - 20, y: selloY - 24, font: fontRegular, size: 7, color: rgb(0.6, 0.6, 0.6) });

  // ── Footer ───────────────────────────────────────────────────────────
  const codigoVerificacion = data.solicitud_id.replace(/-/g, "").slice(0, 8).toUpperCase();
  const footerY = 70;
  page.drawLine({
    start: { x: marginX, y: footerY + 30 },
    end: { x: width - marginX, y: footerY + 30 },
    thickness: 0.5, color: rgb(0.85, 0.85, 0.85),
  });
  page.drawText(`Código de verificación: ${codigoVerificacion}`, {
    x: marginX, y: footerY + 14, font: fontBold, size: 9, color: rgb(0.3, 0.3, 0.3),
  });
  page.drawText("Documento válido solo con firma digital verificada.", {
    x: marginX, y: footerY, font: fontItalic, size: 8, color: rgb(0.45, 0.45, 0.45),
  });
  page.drawText("nutricionistamarialuisa.vercel.app", {
    x: marginX, y: footerY - 14, font: fontRegular, size: 8, color: rgb(0.45, 0.45, 0.45),
  });

  return pdfDoc.save();
}
