import { forwardRef, useImperativeHandle } from 'react';
import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';

import StepperHeader from './StepperHeader';
import StepperFooter from './StepperFooter';
import SelectionReview from './SelectionReview';
import BillingStep from '../Billing/BillingStep';

import { useSelection } from '../../hooks/useSelection';
import { useInvoiceStepper } from '../../hooks/useInvoiceStepper';
import { useReservationBillingContext } from '../../context/ReservationBillingContext';
import styles from './InvoiceStepper.module.css';

interface InvoiceStepperProps {
  isOpen: boolean;
  onClose?: () => void;
  onCreateInvoiceSuccess?: (data: any) => void;
}

const steps = {
  1: 'Revisar selección',
  2: 'Confirmar',
  3: 'Facturar'
} as const;

export interface InvoiceStepperRef {
  next: () => void;
  back: () => void;
}

const InvoiceStepper = forwardRef<InvoiceStepperRef, InvoiceStepperProps>((props, ref) => {
  const { isOpen, onClose, onCreateInvoiceSuccess } = props;

  if (!isOpen) return null;

  const { state } = useReservationBillingContext();
  const { data, selection } = state;

  const { lines = [] } = data || {};
  const articulosSeleccionados = lines.filter((line: any) => selection.selectedLineIds[line.id]);
  const { hasSelection } = useSelection(articulosSeleccionados);

  const { maintenanceRef, step, canNext, onNext, onBack, setStep } = useInvoiceStepper({
    onClose,
    selectedItemsCount: articulosSeleccionados.length
  });

  useImperativeHandle(
    ref,
    () => ({
      next: onNext,
      back: onBack
    }),
    [onNext, onBack]
  );

  const stepTitle = steps[step as keyof typeof steps];

  return (
    <Card className="mb-3">
      <CardHeader className={styles.stickyHeader}>
        <StepperHeader
          stepTitle={stepTitle}
          step={step}
          canNext={canNext}
          onPrev={onBack}
          onNext={onNext}
          onClose={onClose}
          onJumpTo={setStep}
        />
      </CardHeader>

      <CardBody className={styles.stepperBody}>
        {step === 1 && <SelectionReview />}
        {step === 2 && (
          <BillingStep
            registerSubmit={(api) => (maintenanceRef.current = api)}
            data={{ articulosLista: articulosSeleccionados, lines: articulosSeleccionados }}
            isInline
            hideEmitButton
            cliente={data.client}
            reserva={data.reservation}
            onElectronicInvoiceSuccess={(res) => onCreateInvoiceSuccess?.(res)}
            onPartialPaymentSuccess={(res) => onCreateInvoiceSuccess?.(res)}
          />
        )}
      </CardBody>

      <CardFooter>
        <StepperFooter
          step={step}
          onContinue={onNext}
          onBackOrClose={onBack}
          canContinue={hasSelection}
        />
      </CardFooter>
    </Card>
  );
});

export default InvoiceStepper;
