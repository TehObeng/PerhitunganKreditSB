import React from 'react';
import type { CalculationResult, CostInputs, LoanInputs } from './loanTypes';
import { formatCurrency } from './formatCurrency';
import { COST_LABELS } from './loanConstants';

interface ResultsSectionProps {
  results: CalculationResult;
  costInputs: CostInputs;
  loanInputs: LoanInputs;
}

const getPengikatanLabel = (plafon: number): string => {
    if (plafon <= 0) return COST_LABELS.pengikatan;
    return plafon > 200000000 ? 'PK Notaril' : 'Pengikatan Bank';
};

const ResultsSection: React.FC<ResultsSectionProps> = ({ results, costInputs, loanInputs }) => {
  const principal = parseFloat(loanInputs.loanAmount) || 0;

  return (
    <section className="result-container" aria-live="polite">
      <div className="primary-result">
        <span className="label">Angsuran per Bulan</span>
        <span className="value">{formatCurrency(results.monthlyPayment)}</span>
      </div>
      
      <h3 className="result-details-title">Rincian Pembayaran Awal</h3>
      
      <div className="result-row">
          <span className="label">Angsuran Pertama</span>
          <span className="value">{formatCurrency(results.monthlyPayment)}</span>
      </div>

      <div className="cost-breakdown">
          {Object.entries(costInputs).map(([key, valueStr]) => {
              const value = parseFloat(valueStr);
              if (isNaN(value) || value <= 0) return null;
              
              const label = key === 'pengikatan'
                ? getPengikatanLabel(principal)
                : COST_LABELS[key as keyof CostInputs];

              return (
                <div className="result-row" key={key}>
                    <span className="label">{label}</span>
                    <span className="value">{formatCurrency(value)}</span>
                </div>
              );
          })}
           <div className="result-row">
                <span className="label"><strong>Total Biaya-biaya</strong></span>
                <span className="value"><strong>{formatCurrency(results.totalBiaya)}</strong></span>
            </div>
      </div>

      <div className="result-row final-total-row">
        <span className="label">Total Setoran Awal</span>
        <span className="value">{formatCurrency(results.totalSetor)}</span>
      </div>
    </section>
  );
};

export default ResultsSection;
