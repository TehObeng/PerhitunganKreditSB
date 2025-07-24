import type { LoanInputs, CostInputs } from './loanTypes';

export const LABELS: { [key in "loanAmount" | "loanTerm" | "housePrice"]: string } = {
  loanAmount: 'Plafon Pinjaman',
  loanTerm: 'Jangka Waktu (Tahun)',
  housePrice: 'Harga Rumah',
};

export const COST_LABELS: { [key in keyof CostInputs]: string } = {
  provisi: 'Provisi',
  administrasi: 'Administrasi',
  pengikatan: 'Pengikatan', // Base label, dynamically overridden
  biayaSKMHT: 'Biaya SKMHT',
  biayaSurveyTaksasi: 'Biaya Survey & Taksasi',
  biayaLegalitasAgunan: 'Biaya Legalitas (APHT, Cek Sertifikat, PNBP)',
  asuransiRumah: 'Asuransi Kerugian Properti',
};