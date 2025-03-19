
import { usePayrollInputHandling } from './usePayrollInputHandling';
import { useDeductionCalculator } from './useDeductionCalculator';
import { useCurrencyFormatter } from './useCurrencyFormatter';

export const useBulkPayrollCalculations = (props) => {
  const { handleInputChange } = usePayrollInputHandling(props);
  const { calculateDeductions } = useDeductionCalculator(props);
  const { formatCurrency } = useCurrencyFormatter();

  return {
    handleInputChange,
    calculateDeductions,
    formatCurrency
  };
};
