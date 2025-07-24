
import React, { useState, useEffect } from 'react';

// Helper to format the number string with thousand separators
const format = (value: string): string => {
  if (!value) return '';
  // Remove non-digit characters and parse
  const numberValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
  if (isNaN(numberValue)) return '';
  return new Intl.NumberFormat('id-ID').format(numberValue);
};

// Helper to parse the formatted string back to a raw number string
const parse = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

interface CurrencyInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({ id, value, onChange, readOnly = false }) => {
  const [displayValue, setDisplayValue] = useState(format(value));

  useEffect(() => {
    // Sync with external value changes
    setDisplayValue(format(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parse(e.target.value);

    if (rawValue === '') {
      setDisplayValue('');
      onChange('');
      return;
    }

    if (rawValue.length > 15) return;

    // Parse to handle leading zeros (e.g., "07" -> 7)
    const numericValue = parseInt(rawValue, 10);
    if (isNaN(numericValue)) {
      // This case should ideally not be hit if parse works correctly, but as a safeguard.
      onChange('');
      setDisplayValue('');
      return;
    }
    const numericString = String(numericValue);

    // Update the display with the formatted value
    setDisplayValue(format(numericString));
    // Update the parent's state with the raw numeric string
    onChange(numericString);
  };
  
  return (
    <div className="currency-input-wrapper">
      <span className="currency-input-symbol">Rp</span>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder="0"
        readOnly={readOnly}
        required
      />
    </div>
  );
};

export default CurrencyInput;
