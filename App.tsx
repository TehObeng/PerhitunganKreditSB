


import React, { useState, useEffect } from 'react';
import type { LoanInputs, CostInputs } from './loanTypes';
import { useLoanCalculator } from './useLoanCalculator';
import { LABELS } from './loanConstants';
import CurrencyInput from './CurrencyInput';
import ResultsSection from './ResultsSection';
import PDFPreviewModal from './PDFPreviewModal';

const initialLoanInputs: LoanInputs = {
  housePrice: '',
  loanAmount: '',
  loanTerm: '',
  interestRate: '',
};

const initialCostInputs: CostInputs = {
  provisi: '',
  administrasi: '',
  pengikatan: '',
  biayaSKMHT: '',
  biayaSurveyTaksasi: '',
  biayaLegalitasAgunan: '',
  asuransiRumah: '',
};

const App = () => {
  const [loanInputs, setLoanInputs] = useState<LoanInputs>(initialLoanInputs);
  const [costInputs, setCostInputs] = useState<CostInputs>(initialCostInputs);
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  const { results, error } = useLoanCalculator({ loanInputs, costInputs });

  // Effect to automatically update interest rate based on loan term
  useEffect(() => {
    const term = parseInt(loanInputs.loanTerm, 10) || 0;
    let newInterestRate = ''; // Default to empty
    if (term >= 1 && term <= 10) {
      newInterestRate = '6.88';
    } else if (term > 10 && term <= 15) {
      newInterestRate = '7';
    }
    
    if (newInterestRate !== loanInputs.interestRate) {
        setLoanInputs(prev => ({ ...prev, interestRate: newInterestRate }));
    }
  }, [loanInputs.loanTerm]);

  // Effect to automatically calculate costs based on property price and loan amount
  useEffect(() => {
    const principal = parseFloat(loanInputs.loanAmount) || 0;
    const price = parseFloat(loanInputs.housePrice) || 0;
    const termInYears = parseInt(loanInputs.loanTerm, 10) || 0;

    // If inputs are not valid/sufficient, reset costs and exit.
    if (principal <= 0 || price <= 0 || termInYears < 1) {
        setCostInputs(initialCostInputs);
        return;
    }

    // Provisi
    let provisi;
        provisi = principal * 0.01;

    // Administrasi
    let administrasi;
        administrasi = principal * 0.0025;

    // Pengikatan
    let pengikatanValue;
    if (principal > 200000000) {
        // PK Notaril
        pengikatanValue = principal > 800000000 ? principal * 0.002 : 500000;
    } else {
        // Pengikatan Bank
        pengikatanValue = 1500000;
    }
    
    // SKMHT
    const biayaSKMHT = 1050000;

    // --- Combined Survey & Taksasi ---
    let survey;
    if (principal > 5000000000) {
        survey = 7500000;
    } else if (principal > 3000000000) {
        survey = 5000000;
    } else if (principal > 1000000000) {
        survey = 1000000;
    } else { // <= 1,000,000,000
        survey = 500000;
    }
    const taksasi = 500000;
    const biayaSurveyTaksasi = survey + taksasi;

    // --- Combined Legalitas (APHT, Cek Sertifikat, PNBP) ---
    let apht;
    if (principal > 1000000000) {
        apht = 0.0025 * 1.25 * principal;
    } else { // <= 1,000,000,000
        apht = 0.0025 * 1.25 * principal;
    }
    
    const cekSertifikat = 250000;
    
    let pnbp;
    if (principal > 10000000000) {
        pnbp = 25000000;
    } else if (principal > 1000000000) {
        pnbp = 2500000;
    } else if (principal > 250000000) {
        pnbp = 200000;
    } else { // <= 250,000,000
        pnbp = 50000;
    }
    const biayaLegalitasAgunan = apht + cekSertifikat + pnbp;
    
    // Asuransi Kerugian Properti (Rumah Tinggal, Kelas Konstruksi 1)
    const insuranceRate = 0.0003;
    const premiDasar = price * insuranceRate * termInYears;
    const biayaPolis = 25000;
    const biayaMaterai = 10000;
    const asuransiRumah = premiDasar + biayaPolis + biayaMaterai;

    const newCosts: CostInputs = {
        provisi: String(provisi),
        administrasi: String(administrasi),
        pengikatan: String(pengikatanValue),
        biayaSKMHT: String(biayaSKMHT),
        biayaSurveyTaksasi: String(biayaSurveyTaksasi),
        biayaLegalitasAgunan: String(biayaLegalitasAgunan),
        asuransiRumah: String(asuransiRumah),
    };
    setCostInputs(newCosts);
  }, [loanInputs.loanAmount, loanInputs.housePrice, loanInputs.loanTerm]);

  const handleLoanInputChange = (field: keyof Omit<LoanInputs, 'interestRate'>, value: string) => {
    setLoanInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setLoanInputs(initialLoanInputs);
  };
  
  return (
    <div className="calculator-container">
      <header className="app-header">
        <img src="https://bprsb-online.com/wp-content/uploads/2023/06/BPR-SB-horizontal-warna-1024x280.png" alt="BPR Sejahtera Batam Logo" className="logo" />
        <h1 className="title">Kalkulator Simulasi KPR</h1>
      </header>

      <div className="calculator-layout">
        <div className="calculator-inputs">
            <section className="form-section">
                <h2 className="section-title">Informasi Kredit</h2>
                <div className="input-grid">
                    <div className="input-group">
                        <label htmlFor="housePrice">{LABELS.housePrice}</label>
                        <CurrencyInput id="housePrice" value={loanInputs.housePrice} onChange={(value) => handleLoanInputChange('housePrice', value)} />
                    </div>
                     <div className="input-group">
                        <label htmlFor="loanAmount">{LABELS.loanAmount}</label>
                        <CurrencyInput id="loanAmount" value={loanInputs.loanAmount} onChange={(value) => handleLoanInputChange('loanAmount', value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="loanTerm">{LABELS.loanTerm}</label>
                        <input id="loanTerm" type="number" value={loanInputs.loanTerm} onChange={(e) => handleLoanInputChange('loanTerm', e.target.value)} placeholder="1-15" required />
                    </div>
                </div>
            </section>
        </div>
        <div className="calculator-results-panel">
            {error && <p className="error" role="alert">{error}</p>}
            {results && !error ? (
                <div className="results-wrapper">
                    <ResultsSection results={results} costInputs={costInputs} loanInputs={loanInputs} />
                    <div className="action-buttons">
                        <button onClick={() => setIsPreviewing(true)} className="button export-button">Pratinjau & Ekspor PDF</button>
                    </div>
                </div>
            ) : (
                <div className="result-container" style={{padding: '3rem 1rem'}}>
                    <p style={{textAlign: 'center', color: 'var(--label-color)'}}>Hasil simulasi akan muncul di sini.</p>
                </div>
            )}
             <div className="action-buttons">
                <button onClick={handleReset} className="button secondary">Reset & Mulai Baru</button>
             </div>
        </div>
    </div>

      {isPreviewing && results && (
        <PDFPreviewModal 
            results={results} 
            loanInputs={loanInputs} 
            costInputs={costInputs} 
            onClose={() => setIsPreviewing(false)} 
        />
      )}
    </div>
  );
};

export default App;
