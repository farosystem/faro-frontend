import { useState, useCallback, useRef } from 'react';

interface InvoiceStepperProps {
  onClose: () => void;
  selectedItemsCount: number;
}
export function useInvoiceStepper({ onClose, selectedItemsCount }: InvoiceStepperProps) {
  const [step, setStep] = useState(1);
  const maintenanceRef = useRef<any>(null);

  const canNext = selectedItemsCount > 0;

  const onNext = useCallback(() => {
    if (step === 2 && maintenanceRef.current?.submit) {
      maintenanceRef.current.submit();
    } else {
      setStep((s) => Math.min(3, s + 1));
    }
  }, [step]);

  const onBack = useCallback(() => {
    if (step === 1) {
      onClose();
    } else {
      setStep((s) => Math.max(1, s - 1));
    }
  }, [step, onClose]);

  return {
    maintenanceRef,
    step,
    canNext,
    setStep,
    onNext,
    onBack
  };
}
