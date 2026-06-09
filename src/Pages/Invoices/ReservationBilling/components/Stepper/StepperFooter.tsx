import { Button } from 'reactstrap';

interface Props {
  step: number;
  onContinue: () => void;
  onBackOrClose: () => void;
  canContinue: boolean;
  isSubmitting?: boolean;
}

const StepperFooter = ({ step, onContinue, onBackOrClose, canContinue, isSubmitting }: Props) => {
  return (
    <div className="w-100 d-flex justify-content-between align-items-center">
      <div>
        <Button color="secondary" onClick={onBackOrClose} disabled={isSubmitting}>
          {step === 1 ? 'Cerrar' : 'Atrás'}
        </Button>
      </div>

      <div>
        {step === 1 && (
          <Button color="primary" onClick={onContinue} disabled={!canContinue}>
            Continuar
          </Button>
        )}
      </div>
    </div>
  );
};
export default StepperFooter;
