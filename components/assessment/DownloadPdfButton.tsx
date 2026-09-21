'use client';

import { useState, type RefObject } from 'react';

export function DownloadPdfButton({ targetRef }: { targetRef: RefObject<HTMLDivElement> }) {
  const [status, setStatus] = useState<'idle' | 'working' | 'error'>('idle');

  const handleDownload = async () => {
    const node = targetRef.current;
    if (!node) return;

    setStatus('working');
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('ignio-resultados.pdf');
      setStatus('idle');
    } catch (err) {
      console.error('PDF export failed', err);
      setStatus('error');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleDownload}
        disabled={status === 'working'}
        className="inline-flex items-center gap-2 rounded-full border border-ignio-purple/30 px-5 py-2.5 text-sm font-semibold text-ignio-purple transition hover:bg-ignio-purple/5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'working' ? 'Generando PDF…' : 'Descargar resultados (PDF)'}
      </button>
      {status === 'error' && (
        <span className="text-xs text-red-600">No se pudo generar el PDF. Intenta de nuevo.</span>
      )}
    </div>
  );
}
