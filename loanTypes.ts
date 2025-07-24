export interface LoanInputs {
  loanAmount: string;
  interestRate: string;
  loanTerm: string;
  housePrice: string;
}

export interface CostInputs {
  provisi: string;
  administrasi: string;
  pengikatan: string;
  biayaSKMHT: string;
  biayaSurveyTaksasi: string;
  biayaLegalitasAgunan: string;
  asuransiRumah: string;
}

export interface CalculationResult {
  monthlyPayment: number;
  totalBiaya: number;
  totalSetor: number;
  costBreakdown: CostInputs;
}