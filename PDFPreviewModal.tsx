import React, { useRef, useState, useLayoutEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { LoanInputs, CostInputs, CalculationResult } from './loanTypes';
import PDFPreviewContent from './PDFPreviewContent';

interface PDFPreviewModalProps {
  results: CalculationResult;
  loanInputs: LoanInputs;
  costInputs: CostInputs;
  onClose: () => void;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ results, loanInputs, costInputs, onClose }) => {
  const [isExporting, setIsExporting] = useState(false);
  const previewContentRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const calculateAndSetScale = () => {
      if (previewContentRef.current && modalBodyRef.current) {
        const contentWidth = previewContentRef.current.offsetWidth;
        const containerWidth = modalBodyRef.current.clientWidth;
        
        if (contentWidth > containerWidth) {
          setScale(containerWidth / contentWidth);
        } else {
          setScale(1);
        }
      }
    };

    calculateAndSetScale();
    window.addEventListener('resize', calculateAndSetScale);
    return () => window.removeEventListener('resize', calculateAndSetScale);
  }, []);

  const handleExport = async () => {
    if (!previewContentRef.current) return;
    setIsExporting(true);
    
    const elementToCapture = previewContentRef.current;
    // Temporarily reset transform for high-resolution capture
    const originalTransform = elementToCapture.style.transform;
    elementToCapture.style.transform = 'scale(1)';

    try {
      const canvas = await html2canvas(elementToCapture, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      // Restore transform immediately after capture
      elementToCapture.style.transform = originalTransform;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidthInPdf = pdfWidth; 
      const imgHeightInPdf = (imgProps.height * imgWidthInPdf) / imgProps.width;

      let heightLeft = imgHeightInPdf;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidthInPdf, imgHeightInPdf);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = position - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidthInPdf, imgHeightInPdf);
        heightLeft -= pdfHeight;
      }
      
      pdf.save('Ringkasan-Penawaran-KPR.pdf');

    } catch (exportError) {
      console.error("Gagal mengekspor ke PDF:", exportError);
      alert("Terjadi kesalahan saat mengekspor PDF. Silakan coba lagi.");
    } finally {
      if(elementToCapture.style.transform !== originalTransform){
         elementToCapture.style.transform = originalTransform;
      }
      setIsExporting(false);
      onClose();
    }
  };


  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Pratinjau Dokumen</h2>
          <button onClick={onClose} className="close-button" aria-label="Tutup Pratinjau">&times;</button>
        </header>
        <div className="modal-body" ref={modalBodyRef}>
           <div className="pdf-preview-wrapper">
            <PDFPreviewContent 
              ref={previewContentRef} 
              style={{ transform: `scale(${scale})` }}
              {...{ results, loanInputs, costInputs }} 
            />
           </div>
        </div>
        <footer className="modal-footer">
            <button onClick={onClose} disabled={isExporting}>
                Batal
            </button>
            <button onClick={handleExport} className="primary" disabled={isExporting}>
                {isExporting ? 'Mengekspor...' : 'Unduh PDF'}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default PDFPreviewModal;