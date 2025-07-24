
import { useState, useEffect } from 'react';
import type { LoanInputs, CostInputs, CalculationResult } from './loanTypes';

interface UseLoanCalculatorProps {
  loanInputs: LoanInputs;
  costInputs: CostInputs;
}

const calculateMonthlyPayment = (principal: number, annualInterestRate: number, years: number): number => {
    if (isNaN(principal) || isNaN(annualInterestRate) || isNaN(years) || years <= 0 || principal <= 0) {
        return 0;
    }
    const months = years * 12;
    // Flat interest rate calculation
    const totalInterest = principal * (annualInterestRate / 100) * years;
    const totalRepayment = principal + totalInterest;
    return totalRepayment / months;
};


export const useLoanCalculator = ({ loanInputs, costInputs }: UseLoanCalculatorProps) => {
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [error, setError] = useState('');

  const loanInputsJSON = JSON.stringify(loanInputs);
  const costInputsJSON = JSON.stringify(costInputs);

  useEffect(() => {
    const { loanAmount, interestRate, loanTerm, housePrice } = loanInputs;

    // If any of the main inputs are empty, don't attempt to calculate.
    // This prevents showing errors on initial load or with incomplete data.
    if (!loanAmount || !loanTerm || !housePrice) {
      setError('');
      setResults(null);
      return;
    }

    const principal = parseFloat(loanAmount);
    const price = parseFloat(housePrice);
    const annualInterestRate = parseFloat(interestRate);
    const years = parseFloat(loanTerm);

    if (isNaN(price) || price <= 0) {
      setError('Silakan masukkan Harga Rumah yang valid.');
      setResults(null);
      return;
    }
    if (isNaN(principal) || principal <= 0) {
      setError('Silakan masukkan Plafon Pinjaman yang valid.');
      setResults(null);
      return;
    }
    if (principal > price) {
        setError('Plafon pinjaman tidak boleh melebihi harga rumah.');
        setResults(null);
        return;
    }
    if (isNaN(years) || years < 1 || years > 15) {
      setError('Jangka Waktu harus antara 1 dan 15 tahun.');
      setResults(null);
      return;
    }

    setError('');
    
    const monthlyPayment = calculateMonthlyPayment(principal, annualInterestRate, years);
    
    const totalBiaya = Object.values(costInputs).reduce((sum, cost) => {
      const value = parseFloat(cost);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);

    const totalSetor = totalBiaya + monthlyPayment;

    setResults({ 
        monthlyPayment, 
        totalBiaya, 
        totalSetor,
        costBreakdown: costInputs 
    });

  }, [loanInputsJSON, costInputsJSON]);

  return { results, error };
};
