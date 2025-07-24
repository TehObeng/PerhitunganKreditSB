import React from 'react';
import type { LoanInputs, CostInputs, CalculationResult } from './loanTypes';
import { formatCurrency } from './formatCurrency';
import { COST_LABELS } from './loanConstants';

interface PDFPreviewContentProps {
  loanInputs: LoanInputs;
  costInputs: CostInputs;
  results: CalculationResult;
  style?: React.CSSProperties;
}

const PDFPreviewContent = React.forwardRef<HTMLDivElement, PDFPreviewContentProps>(
  ({ loanInputs, costInputs, results, style }, ref) => {
    
    const plafon = parseFloat(loanInputs.loanAmount);
    
    const getPengikatanLabel = (plafon: number): string => {
        if (plafon <= 0) return COST_LABELS.pengikatan;
        return plafon > 200000000 ? 'PK Notaril' : 'Pengikatan Bank';
    };

    const renderedCosts = Object.entries(costInputs)
      .map(([id, valueStr]) => {
        const value = parseFloat(valueStr);
        if (isNaN(value) || value === 0) return null;
        
        const label = id === 'pengikatan'
          ? getPengikatanLabel(plafon)
          : COST_LABELS[id as keyof CostInputs];
        
        if (!label) return null;

        return { id, label, value };
      })
      .filter((cost): cost is { id: string; label: string; value: number; } => cost !== null);
      
    const housePrice = parseFloat(loanInputs.housePrice);
    
    const generationDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return (
      <div ref={ref} className="pdf-preview-content" style={style}>
        <header className="pdf-header">
           <img 
            src="https://bprsb-online.com/wp-content/uploads/2023/06/BPR-SB-horizontal-warna-1024x280.png" 
            alt="BPR Sejahtera Batam Logo" 
            className="preview-logo" 
          />
          <div className="pdf-company-details">
              <p className="company-name">PT. BPR Sejahtera Batam</p>
              <p>Blk. C, Komplek Nagoya Thamrin City, NTC BARU Gedung.1, Kota Batam, Kepulauan Riau 29444</p>
              <p>Telepon: (0778) 455380</p>
              <p>www.bprsb-online.com</p>
          </div>
        </header>

        <div className="pdf-title-section">
          <h1>Penawaran Simulasi Kredit Pemilikan Rumah (KPR)</h1>
          <p className="subtitle">Dokumen ini adalah ilustrasi, bukan penawaran yang mengikat. Diterbitkan: {generationDate}</p>
        </div>

        <section className="pdf-section">
          <div className="pdf-section-header">Informasi Properti dan Pinjaman</div>
          <div className="pdf-grid">
               <div className="pdf-grid-item">
                <span className="label">Harga Properti</span>
                <span className="value">{formatCurrency(housePrice)}</span>
              </div>
              <div className="pdf-grid-item">
                <span className="label">Plafon Pinjaman</span>
                <span className="value">{formatCurrency(plafon)}</span>
              </div>
              <div className="pdf-grid-item">
                <span className="label">Jangka Waktu</span>
                <span className="value">{loanInputs.loanTerm} Tahun</span>
              </div>
              <div className="pdf-grid-item">
                <span className="label">Suku Bunga p.a. (Flat)</span>
                <span className="value">{loanInputs.interestRate}%</span>
              </div>
          </div>
        </section>

        {results.totalBiaya > 0 && (
            <section className="pdf-section">
            <div className="pdf-section-header">Rincian Biaya</div>
            <table className="pdf-cost-table">
                <tbody>
                {renderedCosts.map((cost) => (
                    <tr key={cost.id}>
                        <td>{cost.label}</td>
                        <td>{formatCurrency(cost.value)}</td>
                    </tr>
                ))}
                <tr className="total-row">
                    <td>Total Biaya Kredit</td>
                    <td>{formatCurrency(results.totalBiaya)}</td>
                </tr>
                </tbody>
            </table>
            </section>
        )}

        <section className="pdf-section pdf-summary-section">
            <div className="pdf-section-header">Ringkasan Simulasi Pembayaran</div>
            <div className="pdf-summary-box">
                <div className="pdf-summary-item">
                    <span className="label">Angsuran per Bulan</span>
                    <span className="value">{formatCurrency(results.monthlyPayment)}</span>
                </div>
                <div className="pdf-summary-item">
                    <span className="label">Total Setoran Awal</span>
                    <span className="value">{formatCurrency(results.totalSetor)}</span>
                    <span className="note">Termasuk angsuran pertama & total biaya</span>
                </div>
            </div>
        </section>

        <footer className="pdf-footer">
            <p><strong>Penting:</strong> Dokumen ini adalah simulasi dan perhitungan yang tercantum dapat berubah sewaktu-waktu sesuai dengan analisa dan kebijakan kredit yang berlaku. Ini bukan merupakan perjanjian kredit atau persetujuan pinjaman definitif.</p>
            <p>PT BPR Sejahtera Batam terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK) serta merupakan peserta penjaminan Lembaga Penjamin Simpanan (LPS).</p>
        </footer>
      </div>
    );
  }
);

export default PDFPreviewContent;
