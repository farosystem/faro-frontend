import { PDFDocument, rgb } from 'pdf-lib';
import faroLight from '../assets/images/faro-light.png';
import dejavuFont from '../assets/fonts/DejaVuSans.ttf';
import dejavuBoldFont from '../assets/fonts/DejaVuSans-Bold.ttf';
import dejavuCondensedFont from '../assets/fonts/DejaVuSerifCondensed.ttf';
import { getSimboloMoneda } from '../helpers/helpers';
import fontkit from '@pdf-lib/fontkit';

export async function generarPDFCierreParcial(datos) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const [mainBytes, boldBytes, symbolBytes] = await Promise.all([
    fetch(dejavuCondensedFont).then((res) => res.arrayBuffer()),
    fetch(dejavuBoldFont).then((res) => res.arrayBuffer()),
    fetch(dejavuFont).then((res) => res.arrayBuffer())
  ]);
  const fontMain = await pdfDoc.embedFont(mainBytes);
  const fontBold = await pdfDoc.embedFont(boldBytes);
  const fontSymbols = await pdfDoc.embedFont(symbolBytes);

  const logoBuffer = await fetch(faroLight).then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBuffer);

  let page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const margin = 40;
  let y = height - 100;

  const checkSpace = (neededSpace) => {
    if (y - neededSpace < 80) {
      drawFooter(page);
      page = pdfDoc.addPage([595, 842]);
      y = height - 100;
      drawHeader(page);
      return true;
    }
    return false;
  };

  const drawHeader = (p) => {
    p.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.09, 0.17, 0.28) });
    const logoDims = logoImage.scale(0.25);
    p.drawImage(logoImage, {
      x: margin,
      y: height - 30 - logoDims.height,
      width: logoDims.width,
      height: logoDims.height
    });
    p.drawText('CIERRE PARCIAL DE CAJA', {
      x: width / 2 - 100,
      y: height - 60,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1)
    });
  };

  const drawFooter = (p) => {
    const year = new Date().getFullYear();
    p.drawLine({
      start: { x: margin, y: 60 },
      end: { x: width - margin, y: 60 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });
    p.drawText(`Sistema de Gestión FARO - ${year}`, {
      x: width / 2 - 80,
      y: 40,
      size: 10,
      font: fontMain,
      color: rgb(0.5, 0.5, 0.5)
    });
  };

  const drawSectionTitle = (title) => {
    checkSpace(40);
    page.drawText(title, {
      x: margin,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0.09, 0.17, 0.28)
    });
    y -= 24;
  };

  const drawField = (label, value) => {
    checkSpace(20);
    page.drawText(`${label}:`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontBold
    });
    page.drawText(value, {
      x: margin + 120,
      y,
      size: 12,
      font: fontMain
    });
    y -= 20;
  };

  const drawAmount = (x, yVal, monto, moneda, fontValue = fontMain, color = rgb(0, 0, 0)) => {
    const simbolo = getSimboloMoneda(moneda) || '';
    const formatted = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(monto));

    page.drawText(simbolo, {
      x,
      y: yVal,
      size: 12,
      font: fontSymbols,
      color
    });
    page.drawText(` ${formatted}`, {
      x: x + 12,
      y: yVal,
      size: 12,
      font: fontValue,
      color
    });
  };

  const drawSignatures = () => {
    checkSpace(120);
    y -= 20;
    drawSectionTitle('AUTORIZACIONES');

    const lineY = y - 30;
    const lineWidth = 200;

    page.drawLine({
      start: { x: margin, y: lineY },
      end: { x: margin + lineWidth, y: lineY },
      thickness: 1,
      color: rgb(0, 0, 0)
    });
    page.drawText('Firma del Cajero', {
      x: margin + 40,
      y: lineY - 15,
      size: 11,
      font: fontMain
    });

    const xRight = width - margin - lineWidth;
    page.drawLine({
      start: { x: xRight, y: lineY },
      end: { x: xRight + lineWidth, y: lineY },
      thickness: 1,
      color: rgb(0, 0, 0)
    });
    page.drawText('Firma del Encargado', {
      x: xRight + 30,
      y: lineY - 15,
      size: 11,
      font: fontMain
    });

    y = lineY - 50;
  };

  drawHeader(page);
  y -= 20;

  drawSectionTitle('DATOS GENERALES');
  [
    ['Caja', datos.caja?.nombre || datos.caja],
    ['Usuario', datos.usuario.nombre],
    ['Cédula', datos.usuario.cedula],
    ['Fecha', datos.fecha],
    ['Hora Apertura', datos.hora_apertura],
    ['Hora Cierre', datos.hora_cierre]
  ].forEach(([label, value]) => drawField(label, String(value)));

  y -= 30;

  drawSectionTitle('MONTOS INICIALES');
  datos.datos_inicio_usuario.forEach((moneda) => {
    checkSpace(20);
    const monto = moneda.detalles?.[0]?.monto ?? moneda.monto ?? 0;
    page.drawText(`• ${moneda.moneda}`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontBold
    });
    drawAmount(width - margin - 100, y, monto, moneda.moneda, fontMain, rgb(0, 0.5, 0));
    y -= 20;
  });

  y -= 30;

  datos.cierrePorMoneda.forEach((moneda) => {
    const spaceNeeded = 40 + moneda.detalles.length * 20 + 30;
    if (checkSpace(spaceNeeded)) {
      drawSectionTitle(`DETALLES DE ${moneda.moneda.toUpperCase()}`);
    } else {
      drawSectionTitle(`DETALLES DE ${moneda.moneda.toUpperCase()}`);
    }

    moneda.detalles.forEach((detalle) => {
      checkSpace(20);
      page.drawText(`• ${detalle.metodo}`, {
        x: margin + 20,
        y,
        size: 12,
        font: fontMain
      });
      drawAmount(width - margin - 100, y, detalle.monto, moneda.moneda, fontMain);
      y -= 20;
    });

    checkSpace(30);
    page.drawText(`Total:`, {
      x: width - margin - 180,
      y,
      size: 12,
      font: fontBold
    });
    drawAmount(width - margin - 100, y, moneda.total, moneda.moneda, fontBold, rgb(0, 0.5, 0));
    y -= 30;
  });

  drawSectionTitle('TOTALES GENERALES');
  Object.entries(datos.totalesPorMoneda).forEach(([moneda, total]) => {
    checkSpace(20);
    page.drawText(`• Total ${moneda}:`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontBold
    });
    drawAmount(width - margin - 100, y, total, moneda, fontMain, rgb(0, 0, 0.7));
    y -= 20;
  });

  y -= 30;

  drawSectionTitle('TOTALES GENERALES');
  Object.entries(datos.totalesPorMoneda).forEach(([moneda, total]) => {
    checkSpace(20);
    page.drawText(`• Total ${moneda}:`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontBold
    });
    drawAmount(width - margin - 100, y, total, moneda, fontMain, rgb(0, 0, 0.7));
    y -= 20;
  });

  y -= 30;

  drawSectionTitle('MONTOS A ENVIAR (EFECTIVO)');
  datos.montos_apertura.forEach((apertura) => {
    const moneda = apertura.moneda;
    const montoInicialEfectivo = apertura.monto;
    const cierreMoneda = datos.cierrePorMoneda.find((c) => c.moneda === moneda);

    const detalleEfectivo = cierreMoneda?.detalles?.find((d) => d.metodo === 'Efectivo');
    const montoEfectivoUsuario = detalleEfectivo?.monto || 0;

    const excedente = montoEfectivoUsuario - montoInicialEfectivo;

    checkSpace(50);
    page.drawText(`• Monto inicial en efectivo (${moneda}):`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontMain
    });
    drawAmount(width - margin - 100, y, montoInicialEfectivo, moneda, fontMain);
    y -= 20;

    page.drawText(`• Efectivo reportado (${moneda}):`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontMain
    });
    drawAmount(width - margin - 100, y, montoEfectivoUsuario, moneda, fontMain);
    y -= 20;

    page.drawText(`• Excedente/Déficit (${moneda}):`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontBold
    });

    let color = excedente > 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0);
    drawAmount(width - margin - 100, y, Math.abs(excedente), moneda, fontBold, color);

    y -= 20;
    if (excedente > 0) {
      page.drawText(`(Enviar excedente: ${excedente} | Dejar ${montoInicialEfectivo} en caja)`, {
        x: margin + 30,
        y,
        size: 10,
        font: fontMain,
        color: rgb(0, 0.5, 0)
      });
    } else {
      page.drawText(`(No enviar nada | Mantener todo el efectivo en caja)`, {
        x: margin + 30,
        y,
        size: 10,
        font: fontMain,
        color: rgb(0.8, 0, 0)
      });
    }
    y -= 30;
  });

  y -= 30;

  drawSectionTitle('COMPARACIÓN CON SISTEMA');
  Object.entries(datos.totalesPorMoneda).forEach(([moneda, totalUsuario]) => {
    const montoInicial =
      datos.datos_inicio_usuario.find((m) => m.moneda === moneda)?.detalles?.[0]?.monto || 0;
    const movimientosSistema = datos.totalesSistemaPorMoneda[moneda] - montoInicial;

    const totalSistema = datos.totalesSistemaPorMoneda[moneda] || 0;
    const diferencia = totalUsuario - totalSistema;

    checkSpace(100);

    page.drawText(`• Monto inicial (${moneda}):`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontMain
    });
    drawAmount(width - margin - 100, y, montoInicial, moneda, fontMain);
    y -= 20;

    page.drawText(`• Movimientos sistema (${moneda}):`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontMain
    });
    drawAmount(width - margin - 100, y, movimientosSistema, moneda, fontMain);
    y -= 20;

    page.drawText(`• Total sistema calculado (${moneda}):`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontBold
    });
    drawAmount(width - margin - 100, y, totalSistema, moneda, fontBold);
    y -= 20;

    page.drawText(`• Total usuario (${moneda}):`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontMain
    });
    drawAmount(width - margin - 100, y, totalUsuario, moneda, fontMain);
    y -= 20;

    let colorDiferencia =
      diferencia === 0 ? rgb(0, 0, 0.8) : diferencia > 0 ? rgb(0.8, 0, 0) : rgb(0, 0.5, 0);

    page.drawText(`• Diferencia (${moneda}):`, {
      x: margin + 10,
      y,
      size: 12,
      font: fontBold
    });
    drawAmount(width - margin - 100, y, Math.abs(diferencia), moneda, fontBold, colorDiferencia);
    y -= 20;

    const nota =
      diferencia === 0
        ? '(Balance exacto)'
        : diferencia > 0
          ? '(Usuario tiene más)'
          : '(Sistema tiene más)';

    page.drawText(nota, {
      x: margin + 150,
      y,
      size: 10,
      font: fontMain,
      color: colorDiferencia
    });
    y -= 30;
  });

  drawSignatures();

  drawFooter(page);

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function generarPDFResumenCierre(datos) {
  const resumenCierre = datos.resumenCierre || [];
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const [mainBytes, boldBytes, symbolBytes] = await Promise.all([
    fetch(dejavuCondensedFont).then((res) => res.arrayBuffer()),
    fetch(dejavuBoldFont).then((res) => res.arrayBuffer()),
    fetch(dejavuFont).then((res) => res.arrayBuffer())
  ]);

  const fontMain = await pdfDoc.embedFont(mainBytes);
  const fontBold = await pdfDoc.embedFont(boldBytes);
  const fontSymbols = await pdfDoc.embedFont(symbolBytes);

  const logoBuffer = await fetch(faroLight).then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBuffer);

  const pageSize = [595, 842];
  let page = pdfDoc.addPage(pageSize);
  const { width, height } = page.getSize();
  const margin = 40;
  let y = height - 100;

  const drawHeader = (p) => {
    p.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.09, 0.17, 0.28) });
    const logoDims = logoImage.scale(0.25);
    p.drawImage(logoImage, {
      x: margin,
      y: height - 30 - logoDims.height,
      width: logoDims.width,
      height: logoDims.height
    });
    p.drawText('RESUMEN DE CIERRE DE CAJA', {
      x: width / 2 - 120,
      y: height - 60,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1)
    });
  };

  const drawFooter = (p) => {
    const year = new Date().getFullYear();
    p.drawLine({
      start: { x: margin, y: 60 },
      end: { x: width - margin, y: 60 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });
    p.drawText(`Sistema de Gestión FARO - ${year}`, {
      x: width / 2 - 80,
      y: 40,
      size: 10,
      font: fontMain,
      color: rgb(0.5, 0.5, 0.5)
    });
  };

  const checkNewPage = (spaceNeeded = 100) => {
    if (y - spaceNeeded < 80) {
      drawFooter(page);
      page = pdfDoc.addPage(pageSize);
      y = height - 100;
      drawHeader(page);
    }
  };

  const drawSectionTitle = (title) => {
    checkNewPage(40);
    page.drawText(title, {
      x: margin,
      y,
      size: 14,
      font: fontBold,
      color: rgb(0.09, 0.17, 0.28)
    });
    y -= 25;
  };

  const drawAmount = (x, yPos, monto, moneda, fontValue = fontMain, color = rgb(0, 0, 0)) => {
    const simbolo = getSimboloMoneda(moneda) || '';
    const formatted = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
      Number(monto)
    );
    page.drawText(simbolo, { x, y: yPos, size: 12, font: fontSymbols, color });
    page.drawText(` ${formatted}`, { x: x + 12, y: yPos, size: 12, font: fontValue, color });
  };

  const drawMonedaBox = (monedaData) => {
    checkNewPage(200);

    page.drawText(`MONEDA: ${monedaData.moneda.toUpperCase()}`, {
      x: margin,
      y,
      size: 12,
      font: fontBold,
      color: rgb(0.09, 0.17, 0.28)
    });
    y -= 20;

    page.drawText('CONCEPTO', { x: margin, y, size: 11, font: fontBold });
    page.drawText('MONTO', { x: width - margin - 120, y, size: 11, font: fontBold });
    y -= 18;

    const conceptos = [
      ['Monto Inicial', monedaData.montoInicial ?? 0, rgb(0, 0, 0)],
      ['Ingresos Sistema', monedaData.ingresosSistema ?? 0, rgb(0, 0.5, 0)],
      ['Egresos Sistema', monedaData.egresosSistema ?? 0, rgb(0.7, 0, 0)],
      ['Total Sistema', monedaData.totalSistema ?? 0, rgb(0, 0, 0.7)],
      ['Total Usuario', monedaData.totalUsuario ?? 0, rgb(0.3, 0.3, 0.3)],
      [
        'Diferencia',
        monedaData.diferencia ?? 0,
        (monedaData.diferencia ?? 0) < 0 ? rgb(0.7, 0, 0) : rgb(0, 0.5, 0)
      ]
    ];

    conceptos.forEach(([label, value, color]) => {
      page.drawText(label, { x: margin + 10, y, size: 11, font: fontMain });
      drawAmount(width - margin - 120, y, value, monedaData.moneda, fontMain, color);
      y -= 16;
    });

    y -= 10;

    page.drawText('MÉTODOS DE PAGO:', { x: margin, y, size: 11, font: fontBold });
    y -= 18;

    monedaData.metodosPago.forEach((metodo) => {
      checkNewPage(50);

      const ingresoLabelX = margin + 180;
      const ingresoMontoX = ingresoLabelX + 70;
      const egresoLabelX = ingresoMontoX + 120;
      const egresoMontoX = egresoLabelX + 60;

      const usuarioLabelX = ingresoLabelX;
      const usuarioMontoX = usuarioLabelX + 70;

      page.drawText(`• ${metodo.metodo}`, {
        x: margin + 10,
        y,
        size: 11,
        font: fontMain
      });

      page.drawText('Ingresos:', {
        x: ingresoLabelX,
        y,
        size: 11,
        font: fontMain
      });
      drawAmount(
        ingresoMontoX,
        y,
        metodo.ingresos ?? 0,
        monedaData.moneda,
        fontMain,
        rgb(0, 0.5, 0)
      );

      page.drawText('Egresos:', {
        x: egresoLabelX,
        y,
        size: 11,
        font: fontMain
      });
      drawAmount(egresoMontoX, y, metodo.egresos ?? 0, monedaData.moneda, fontMain, rgb(0.7, 0, 0));

      y -= 16;

      page.drawText('Usuario:', {
        x: usuarioLabelX,
        y,
        size: 11,
        font: fontMain
      });
      drawAmount(
        usuarioMontoX,
        y,
        metodo.totalUsuario ?? 0,
        monedaData.moneda,
        fontMain,
        rgb(0.3, 0.3, 0.3)
      );

      y -= 16;
    });

    y -= 20;
  };

  const drawSignatures = () => {
    checkNewPage(120);
    drawSectionTitle('FIRMAS Y AUTORIZACIONES');

    const lineY = y - 30;
    const lineWidth = 200;

    page.drawLine({
      start: { x: margin, y: lineY },
      end: { x: margin + lineWidth, y: lineY },
      thickness: 1,
      color: rgb(0, 0, 0)
    });
    page.drawText('Firma del Cajero', { x: margin + 40, y: lineY - 15, size: 11, font: fontMain });

    const xRight = width - margin - lineWidth;
    page.drawLine({
      start: { x: xRight, y: lineY },
      end: { x: xRight + lineWidth, y: lineY },
      thickness: 1,
      color: rgb(0, 0, 0)
    });
    page.drawText('Firma del Encargado', {
      x: xRight + 40,
      y: lineY - 15,
      size: 11,
      font: fontMain
    });

    y = lineY - 40;
  };

  drawHeader(page);
  y -= 10;

  drawSectionTitle('DATOS GENERALES');
  [
    ['Caja', datos.caja?.nombre || datos.caja],
    ['Usuario', datos.usuario.nombre],
    ['Cédula', datos.usuario.cedula],
    ['Administrador', datos.administrador?.nombre],
    ['Cédula Admin', datos.administrador?.cedula],
    ['Fecha', datos.fecha],
    ['Hora Apertura', datos.hora_apertura],
    ['Hora Cierre', datos.hora_cierre]
  ].forEach(([label, value]) => {
    checkNewPage(20);
    page.drawText(`${label}:`, { x: margin + 10, y, size: 12, font: fontBold });
    page.drawText(String(value || 'N/A'), { x: margin + 130, y, size: 12, font: fontMain });
    y -= 18;
  });

  y -= 15;

  resumenCierre.forEach((mon) => drawMonedaBox(mon));

  if (datos.observaciones) {
    drawSectionTitle('OBSERVACIONES');
    datos.observaciones.split('\n').forEach((line) => {
      checkNewPage(20);
      page.drawText(line, { x: margin + 10, y, size: 11, font: fontMain });
      y -= 16;
    });
    y -= 10;
  }

  drawSectionTitle('BALANCE DE EFECTIVO');

  datos.resumenCierre.forEach((monedaData) => {
    const moneda = monedaData.moneda;
    const metodoEfectivo = monedaData.metodosPago.find((m) => m.metodo === 'Efectivo');

    if (metodoEfectivo) {
      const montoInicial = datos.montos_apertura.find((m) => m.moneda === moneda)?.monto || 0;
      const ingresos = metodoEfectivo.ingresos || 0;
      const egresos = metodoEfectivo.egresos || 0;
      const totalSistema = montoInicial + ingresos - egresos;
      const excedenteEsperado = totalSistema - montoInicial;
      const totalUsuario = metodoEfectivo.totalUsuario || 0;
      const totalUsuarioAjustado = totalUsuario + montoInicial;
      const diferencia = totalUsuarioAjustado - totalSistema;
      let enviadoPorUsuario = totalUsuario - montoInicial;
      if (enviadoPorUsuario <= 0) enviadoPorUsuario = 0;

      checkNewPage(120);

      page.drawText(`• ${moneda.toUpperCase()}`, {
        x: margin + 10,
        y,
        size: 12,
        font: fontBold,
        color: rgb(0.09, 0.17, 0.28)
      });
      y -= 20;

      page.drawText(`  Monto inicial:`, { x: margin + 20, y, size: 11, font: fontMain });
      drawAmount(width - margin - 100, y, montoInicial, moneda, fontMain);
      y -= 18;

      page.drawText(`  Ingresos sistema:`, { x: margin + 20, y, size: 11, font: fontMain });
      drawAmount(width - margin - 100, y, ingresos, moneda, fontMain);
      y -= 18;

      page.drawText(`  Egresos sistema:`, { x: margin + 20, y, size: 11, font: fontMain });
      drawAmount(width - margin - 100, y, egresos, moneda, fontMain);
      y -= 18;

      page.drawText(`  ------------------------------`, {
        x: margin + 20,
        y,
        size: 11,
        font: fontMain
      });
      y -= 15;

      let colorSistema =
        totalSistema < 0 ? rgb(0.8, 0, 0) : totalSistema === 0 ? rgb(0, 0, 0.8) : rgb(0, 0.5, 0);
      page.drawText(`  Total sistema: `, {
        x: margin + 20,
        y,
        size: 11,
        font: fontMain
      });
      drawAmount(width - margin - 100, y, totalSistema, moneda, fontBold, colorSistema);
      y -= 18;
      if (excedenteEsperado > 0) {
        page.drawText(`  Excedente esperado: `, {
          x: margin + 20,
          y,
          size: 11,
          font: fontMain
        });
        drawAmount(width - margin - 100, y, excedenteEsperado, moneda, fontMain);
        y -= 18;
      } else {
        page.drawText(`  Reponer en caja: `, {
          x: margin + 20,
          y,
          size: 11,
          font: fontMain
        });
        drawAmount(width - margin - 100, y, montoInicial - totalSistema, moneda, fontMain);
        y -= 18;
      }

      page.drawText(`  ------------------------------`, {
        x: margin + 20,
        y,
        size: 11,
        font: fontMain
      });
      y -= 15;

      page.drawText(`  Total usuario reportado: `, { x: margin + 20, y, size: 11, font: fontMain });
      drawAmount(width - margin - 100, y, totalUsuario, moneda, fontMain);
      y -= 18;

      page.drawText(`  Enviado por usuario: `, {
        x: margin + 20,
        y,
        size: 11,
        font: fontMain
      });
      drawAmount(width - margin - 100, y, enviadoPorUsuario, moneda, fontMain);
      y -= 22;

      y -= 30;
    }
  });

  y -= 30;

  drawSignatures();
  drawFooter(page);

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function generarPDFMovimientosCaja(filteredData, cajaSeleccionada) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const [mainBytes, boldBytes, symbolBytes] = await Promise.all([
    fetch(dejavuCondensedFont).then((res) => res.arrayBuffer()),
    fetch(dejavuBoldFont).then((res) => res.arrayBuffer()),
    fetch(dejavuFont).then((res) => res.arrayBuffer())
  ]);

  const fontMain = await pdfDoc.embedFont(mainBytes);
  const fontBold = await pdfDoc.embedFont(boldBytes);
  const fontSymbols = await pdfDoc.embedFont(symbolBytes);

  const logoBuffer = await fetch(faroLight).then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBuffer);

  const pageSize = [842, 595];
  let page = pdfDoc.addPage(pageSize);
  const { width, height } = page.getSize();
  let y = height - 100;
  const margin = 40;

  const columnWidths = {
    index: 25,
    fecha: 60,
    hora: 90,
    tipo: 70,
    desc: 200,
    metodo: 130,
    moneda: 60,
    monto: 100,
    usuario: 50
  };

  const positions = {};
  let currentX = margin;
  Object.entries(columnWidths).forEach(([key, w]) => {
    positions[key] = currentX;
    currentX += w;
  });

  function splitTextIntoLines(text, maxWidth, font, size) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  const drawHeader = () => {
    page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.09, 0.17, 0.28) });
    const logoDims = logoImage.scale(0.25);
    page.drawImage(logoImage, {
      x: margin,
      y: height - 30 - logoDims.height,
      width: logoDims.width,
      height: logoDims.height
    });
    page.drawText('MOVIMIENTOS DE CAJA', {
      x: width / 2 - 110,
      y: height - 60,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1)
    });
  };

  const drawFooter = () => {
    const year = new Date().getFullYear();
    page.drawLine({
      start: { x: margin, y: 60 },
      end: { x: width - margin, y: 60 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });
    page.drawText(`Sistema de Gestión FARO - ${year}`, {
      x: width / 2 - 80,
      y: 40,
      size: 10,
      font: fontMain,
      color: rgb(0.5, 0.5, 0.5)
    });
  };

  const checkNewPage = (spaceNeeded = 20) => {
    if (y - spaceNeeded < 80) {
      drawFooter();
      page = pdfDoc.addPage(pageSize);
      y = height - 100;
      drawHeader();
      drawTableHeader();
    }
  };

  const drawTableHeader = () => {
    Object.keys(columnWidths).forEach((key) => {
      const label = {
        index: '#',
        fecha: 'Fecha',
        hora: 'Hora',
        tipo: 'Tipo',
        desc: 'Descripción',
        metodo: 'Método Pago',
        moneda: 'Moneda',
        monto: 'Monto',
        usuario: 'Usuario'
      }[key];
      page.drawText(label, { x: positions[key], y, size: 10, font: fontBold });
    });

    y -= 14;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7)
    });
    y -= 8;
  };

  const formatFechaHora = (timestamp) => {
    const date = new Date(Number(timestamp));
    const fecha = date.toLocaleDateString('es-CR');
    const hora = date.toLocaleTimeString('es-CR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    return { fecha, hora };
  };

  drawHeader();
  y -= 10;

  page.drawText('Caja:', { x: margin + 10, y, size: 12, font: fontBold });
  page.drawText(
    cajaSeleccionada?.nombre + ' ' + cajaSeleccionada?.numero + ' - ' + cajaSeleccionada.modulo ||
      'Sin nombre',
    { x: margin + 60, y, size: 12, font: fontMain }
  );
  y -= 20;

  drawTableHeader();

  let counter = 1;
  const lineHeight = 12;
  const rowPadding = 4;

  filteredData.forEach(({ gestion, movimientos }) => {
    movimientos.forEach((mov) => {
      const { fecha, hora } = formatFechaHora(mov.fecha);
      const descripcion = mov.observaciones || '-';
      const descMaxWidth = columnWidths.desc - 5;

      const lines = splitTextIntoLines(descripcion, descMaxWidth, fontMain, 10);
      const rowHeight = lines.length * lineHeight + rowPadding * 3;

      checkNewPage(rowHeight);

      if (counter % 2 !== 0) {
        page.drawRectangle({
          x: margin,
          y: y - rowHeight + 16,
          width: width - 1.5 * margin + 7,
          height: rowHeight + 2,
          color: rgb(0.95, 0.95, 0.95)
        });
      }

      const color = mov.tipo === 'SALIDA' ? rgb(0.8, 0, 0) : rgb(0, 0.6, 0);

      page.drawText(String(counter++), { x: positions.index, y, size: 10, font: fontMain });
      page.drawText(fecha, { x: positions.fecha, y, size: 10, font: fontMain });
      page.drawText(hora, { x: positions.hora, y, size: 10, font: fontMain });
      page.drawText(mov.tipo, { x: positions.tipo, y, size: 10, font: fontMain });
      page.drawText(mov.medioPago || '-', { x: positions.metodo, y, size: 10, font: fontMain });
      page.drawText(mov.codigoMoneda || '-', { x: positions.moneda, y, size: 10, font: fontMain });

      const signo = mov.tipo === 'SALIDA' ? '-' : '+';
      const simbolo = getSimboloMoneda(mov.codigoMoneda) || '';
      const formatted = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(
        Number(mov.monto)
      );

      const widthSigno = fontMain.widthOfTextAtSize(signo + ' ', 10);
      const widthSimbolo = fontSymbols.widthOfTextAtSize(simbolo + ' ', 7);
      const widthMonto = fontMain.widthOfTextAtSize(formatted, 10);

      const totalWidth = widthSigno + widthSimbolo + widthMonto;

      let xStart = positions.monto;

      page.drawText(signo + ' ', {
        x: xStart,
        y,
        size: 10,
        font: fontMain,
        color
      });
      xStart += widthSigno;

      page.drawText(simbolo + ' ', {
        x: xStart,
        y,
        size: 10,
        font: fontSymbols,
        color
      });
      xStart += widthSimbolo;

      page.drawText(formatted, {
        x: xStart,
        y,
        size: 10,
        font: fontMain,
        color
      });

      page.drawText(gestion.usuario?.nombre || 'Sistema', {
        x: positions.usuario,
        y,
        size: 10,
        font: fontMain
      });

      let descY = y;
      lines.forEach((line) => {
        page.drawText(line, { x: positions.desc, y: descY, size: 10, font: fontMain });
        descY -= lineHeight;
      });

      y -= rowHeight;
    });
  });

  drawFooter();

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function generarPDFReporteInventario(filteredData, filters) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const [mainBytes, boldBytes] = await Promise.all([
    fetch(dejavuCondensedFont).then((res) => res.arrayBuffer()),
    fetch(dejavuBoldFont).then((res) => res.arrayBuffer())
  ]);

  const fontMain = await pdfDoc.embedFont(mainBytes);
  const fontBold = await pdfDoc.embedFont(boldBytes);

  const logoBuffer = await fetch(faroLight).then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBuffer);

  const pageSize = [842, 595];
  let page = pdfDoc.addPage(pageSize);
  const { width, height } = page.getSize();
  let y = height - 100;
  const margin = 40;

  const columnWidths = {
    index: 25,
    nombre: 300,
    pais: 150,
    existencias: 100,
    unidad: 100
  };

  const positions = {};
  let currentX = margin;
  Object.entries(columnWidths).forEach(([key, w]) => {
    positions[key] = currentX;
    currentX += w;
  });

  function splitTextIntoLines(text, maxWidth, font, size) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth < maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  const drawHeader = () => {
    page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.09, 0.17, 0.28) });
    const logoDims = logoImage.scale(0.25);
    page.drawImage(logoImage, {
      x: margin,
      y: height - 30 - logoDims.height,
      width: logoDims.width,
      height: logoDims.height
    });
    page.drawText('REPORTE DE INVENTARIO', {
      x: width / 2 - 110,
      y: height - 60,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1)
    });
  };

  const drawFooter = () => {
    const year = new Date().getFullYear();
    page.drawLine({
      start: { x: margin, y: 60 },
      end: { x: width - margin, y: 60 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });
    page.drawText(`Sistema de Gestión FARO - ${year}`, {
      x: width / 2 - 80,
      y: 40,
      size: 10,
      font: fontMain,
      color: rgb(0.5, 0.5, 0.5)
    });
  };

  const checkNewPage = (spaceNeeded = 20) => {
    if (y - spaceNeeded < 80) {
      drawFooter();
      page = pdfDoc.addPage(pageSize);
      y = height - 100;
      drawHeader();
      drawTableHeader();
    }
  };

  const drawTableHeader = () => {
    Object.keys(columnWidths).forEach((key) => {
      const label = {
        index: '#',
        nombre: 'Nombre',
        pais: 'País',
        existencias: 'Existencias',
        unidad: 'Unidad'
      }[key];
      page.drawText(label, { x: positions[key], y, size: 10, font: fontBold });
    });

    y -= 18;
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 0.5,
      color: rgb(0.7, 0.7, 0.7)
    });
    y -= 12;
  };

  drawHeader();
  y -= 20;
  const filterLabels = {
    unidadMedida: 'Unidad',
    nivelMinimo: 'Mínimo',
    nivelMaximo: 'Máximo',
    proveedor: 'Proveedor'
  };

  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => value && filterLabels[key])
    .map(([key, value]) => ({
      label: filterLabels[key],
      value: value.label || value
    }));

  if (activeFilters.length > 0) {
    let filterX = margin + 10;
    const filterY = y;
    const filterSpacing = 15;

    page.drawText('Filtros aplicados:', {
      x: filterX,
      y: filterY,
      size: 10,
      font: fontBold
    });
    filterX += 115;

    activeFilters.forEach((filter, index) => {
      const filterText = `${filter.label}: ${filter.value}`;
      const textWidth = fontMain.widthOfTextAtSize(filterText, 10);

      if (filterX + textWidth > width - margin) {
        y -= 15;
        filterX = margin + 90;
      }

      page.drawText(filterText, {
        x: filterX,
        y: y,
        size: 10,
        font: fontMain
      });

      if (index < activeFilters.length - 1) {
        page.drawText('|', {
          x: filterX + textWidth + 5,
          y: y,
          size: 10,
          font: fontMain,
          color: rgb(0.5, 0.5, 0.5)
        });
      }

      filterX += textWidth + filterSpacing;
    });

    y -= 25;
  }

  drawTableHeader();

  let counter = 1;
  const lineHeight = 12;
  const rowPadding = 10;

  filteredData.forEach((item) => {
    checkNewPage();
    if (counter % 2 !== 0) {
      page.drawRectangle({
        x: margin,
        y: y - lineHeight + 4,
        width: width - 2 * margin,
        height: lineHeight + rowPadding,
        color: rgb(0.95, 0.95, 0.95)
      });
    }

    page.drawText(String(counter++), { x: positions.index, y: y, size: 10, font: fontMain });

    const nombreLines = splitTextIntoLines(item.nombre, columnWidths.nombre - 5, fontMain, 10);
    nombreLines.forEach((line, i) => {
      page.drawText(line, { x: positions.nombre, y: y - i * lineHeight, size: 10, font: fontMain });
    });

    page.drawText(item.pais, { x: positions.pais, y, size: 10, font: fontMain });

    page.drawText(item.existencias.toString(), {
      x: positions.existencias,
      y,
      size: 10,
      font: fontMain
    });

    page.drawText(item.unidad, { x: positions.unidad, y, size: 10, font: fontMain });

    y -= lineHeight + rowPadding;
  });

  y -= 20;
  page.drawText(`Total de productos: ${filteredData.length}`, {
    x: margin,
    y,
    size: 12,
    font: fontBold
  });

  drawFooter();

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export async function generarPDFGestionesCajas(cajaSeleccionada, gestiones) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const [mainBytes, boldBytes, symbolBytes] = await Promise.all([
    fetch(dejavuCondensedFont).then((res) => res.arrayBuffer()),
    fetch(dejavuBoldFont).then((res) => res.arrayBuffer()),
    fetch(dejavuFont).then((res) => res.arrayBuffer())
  ]);

  const fontMain = await pdfDoc.embedFont(mainBytes);
  const fontBold = await pdfDoc.embedFont(boldBytes);
  const fontSymbols = await pdfDoc.embedFont(symbolBytes);

  const logoBuffer = await fetch(faroLight).then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBuffer);

  const formatNumber = (n) =>
    new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(Number(n || 0));

  const getBalanceState = (diff) => {
    if (Math.abs(diff) < 0.01) return { estado: 'BALANCEADO', color: rgb(0.5, 0.5, 0.5) };
    return diff > 0
      ? { estado: 'A FAVOR', color: rgb(0, 0.6, 0) }
      : { estado: 'EN CONTRA', color: rgb(0.8, 0, 0) };
  };

  const calcularDetalleUsuario = (usuario, tipo) => {
    if (!usuario?.detalles) return 0;
    let monto = 0;

    usuario.detalles.forEach((detalle) => {
      const metodo = (detalle.metodo || '').toLowerCase();
      const valor = parseFloat(detalle.monto || 0);

      if (tipo === 'Monto Inicial' && metodo.includes('inicial')) monto += valor;
      if (tipo === 'Ingresos' && !metodo.includes('retiro') && !metodo.includes('inicial'))
        monto += valor;
      if (tipo === 'Egresos' && metodo.includes('retiro')) monto += valor;
    });

    if (tipo === 'Acumulado') {
      const ini = calcularDetalleUsuario(usuario, 'Monto Inicial');
      const ing = calcularDetalleUsuario(usuario, 'Ingresos');
      const egr = calcularDetalleUsuario(usuario, 'Egresos');
      return ini + ing - egr;
    }

    return monto;
  };

  for (const gestion of gestiones) {
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    const margin = 40;
    let y = height - 100;

    page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.09, 0.17, 0.28) });
    const logoDims = logoImage.scale(0.25);
    page.drawImage(logoImage, {
      x: margin,
      y: height - 30 - logoDims.height,
      width: logoDims.width,
      height: logoDims.height
    });
    page.drawText('RESUMEN DE GESTIÓN DE CAJA', {
      x: width / 2 - 110,
      y: height - 60,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1)
    });

    const formatFechaHora = (t) => {
      const d = new Date(Number(t));
      return {
        fecha: d.toLocaleDateString('es-CR'),
        hora: d.toLocaleTimeString('es-CR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      };
    };

    const { fecha, hora: horaApertura } = formatFechaHora(gestion.fecha);
    const horaCierre = gestion.hora_cierre || '-';

    const info = [
      [
        'Caja',
        `${cajaSeleccionada.nombre} ${cajaSeleccionada.numero} - ${cajaSeleccionada.modulo}`
      ],
      ['Fecha', fecha],
      ['Hora Apertura', horaApertura],
      ['Hora Cierre', horaCierre],
      ['Usuario', `${gestion.usuario?.nombre}`],
      ['Cédula Usuario', gestion.usuario?.cedula || '-'],
      ['Administrador', `${gestion.administrador?.nombre}`],
      ['Cédula Admin', gestion.administrador?.cedula || '-']
    ];

    y -= 20;
    info.forEach(([label, value]) => {
      page.drawText(`${label}:`, { x: margin, y, size: 11, font: fontBold });
      page.drawText(String(value), { x: margin + 100, y, size: 11, font: fontMain });
      y -= 16;
    });

    if (gestion.observaciones) {
      y -= 10;
      page.drawText('Observaciones:', { x: margin, y, size: 11, font: fontBold });
      const obsLines = gestion.observaciones.split('\n');
      obsLines.forEach((line) => {
        y -= 14;
        page.drawText(line, { x: margin + 10, y, size: 11, font: fontMain });
      });
    }

    y -= 40;
    page.drawText('Resumen por Moneda', {
      x: margin,
      y,
      size: 12,
      font: fontBold,
      color: rgb(0.09, 0.17, 0.28)
    });
    y -= 20;

    const monedas = {};

    (gestion.datos_cierre_sistema || []).forEach((item) => {
      monedas[item.codigoMoneda] = { ...monedas[item.codigoMoneda], sistema: item };
    });
    (gestion.datos_cierre_usuario || []).forEach((item) => {
      monedas[item.moneda] = { ...monedas[item.moneda], usuario: item };
    });

    for (const [moneda, data] of Object.entries(monedas)) {
      const simbolo = getSimboloMoneda(moneda);
      const sistema = data.sistema || {};
      const usuario = data.usuario || {};

      const { estado: estadoSistema, color: colorSistema } = getBalanceState(
        sistema?.diferencia || 0
      );
      const estadoUsuario = calcularDetalleUsuario(usuario, 'Acumulado');
      const colorUsuario = getBalanceState(estadoUsuario).color;

      const columnas = ['Concepto', 'Monto Inicial', 'Ingresos', 'Egresos', 'Acumulado', 'Estado'];
      const colWidths = [100, 90, 90, 90, 90, 80];
      const colX = colWidths.reduce((acc, w, i) => {
        acc.push((acc[i - 1] || margin) + (i > 0 ? colWidths[i - 1] : 0));
        return acc;
      }, []);

      page.drawText(`Moneda: ${moneda}`, { x: margin, y, size: 11, font: fontBold });
      y -= 16;

      columnas.forEach((label, i) => {
        page.drawText(label, { x: colX[i], y, size: 10, font: fontBold });
      });
      y -= 14;

      const sistemaDatos = [
        'Sistema',
        sistema.montoInicial,
        sistema.ingresos,
        sistema.egresos,
        sistema.diferencia,
        estadoSistema
      ];

      sistemaDatos.forEach((val, i) => {
        if (i === 0 || i === 5) {
          page.drawText(String(val), {
            x: colX[i],
            y,
            size: 10,
            font: i === 0 ? fontBold : fontMain,
            color: i === 5 ? colorSistema : undefined
          });
        } else {
          page.drawText(simbolo, { x: colX[i], y, size: 10, font: fontSymbols });
          page.drawText(` ${formatNumber(val)}`, { x: colX[i] + 10, y, size: 10, font: fontMain });
        }
      });
      y -= 14;
      const iniU = calcularDetalleUsuario(usuario, 'Monto Inicial');
      const ingU = calcularDetalleUsuario(usuario, 'Ingresos');
      const egrU = calcularDetalleUsuario(usuario, 'Egresos');
      const acuU = iniU + ingU - egrU;

      const usuarioDatos = ['Usuario', iniU, ingU, egrU, acuU, '-'];

      usuarioDatos.forEach((val, i) => {
        if (i === 0 || i === 5) {
          page.drawText(String(val), {
            x: colX[i],
            y,
            size: 10,
            font: i === 0 ? fontBold : fontMain
          });
        } else {
          page.drawText(simbolo, { x: colX[i], y, size: 10, font: fontSymbols });
          page.drawText(` ${formatNumber(val)}`, { x: colX[i] + 10, y, size: 10, font: fontMain });
        }
      });

      y -= 20;
    }

    const year = new Date().getFullYear();
    page.drawLine({
      start: { x: margin, y: 60 },
      end: { x: width - margin, y: 60 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8)
    });
    page.drawText(`Sistema de Gestión FARO - ${year}`, {
      x: width / 2 - 80,
      y: 40,
      size: 10,
      font: fontMain,
      color: rgb(0.5, 0.5, 0.5)
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}
