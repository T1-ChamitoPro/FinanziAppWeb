import type { Transaccion } from '../services/finanziappService';

export const exportarACSV = (transacciones: Transaccion[]) => {
  if (transacciones.length === 0) return;

  // Cabeceras del archivo
  const headers = ['ID,Fecha,Tipo,Categoria,Descripcion,Monto\n'];

  // Construcción de las filas sanitizando cadenas
  const filas = transacciones.map((t) => {
    const id = t.idTransaccion;
    const fecha = t.fecha;
    const tipo = t.categoria?.tipo || '';
    const categoria = `"${t.categoria?.nombre || ''}"`;
    const descripcion = `"${(t.descripcion || '').replace(/"/g, '""')}"`;
    const monto = t.monto;

    return `${id},${fecha},${tipo},${categoria},${descripcion},${monto}`;
  });

  const contenidoCSV = '\uFEFF' + headers.concat(filas.join('\n')).join(''); // \uFEFF añade UTF-8 BOM para soporte correcto de acentos en Excel
  const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `finanziapp_reporte_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};