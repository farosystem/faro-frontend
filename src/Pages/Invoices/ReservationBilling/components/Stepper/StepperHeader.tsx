interface Props {
  stepTitle: string;
  step: number;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose?: () => void;
  onJumpTo?: (step: number) => void;
}

interface StepDotsProps {
  step: number;
  total?: number;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
  onJumpTo?: (step: number) => void;
}

const StepDots = ({
  step,
  total = 3,
  size = 10,
  activeColor = 'var(--bs-primary)',
  inactiveColor = 'var(--bs-secondary)',
  className = '',
  onJumpTo
}: StepDotsProps) => {
  const dots = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div
      className={`d-flex align-items-center ${className}`}
      role="tablist"
      aria-label="Progreso de pasos"
    >
      {dots.map((d) => {
        const active = step === d;
        return (
          <button
            key={d}
            type="button"
            role="tab"
            aria-current={active ? 'true' : undefined}
            aria-label={`Ir al paso ${d}`}
            onClick={() => onJumpTo && onJumpTo(d)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onJumpTo && onJumpTo(d);
              }
            }}
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: active ? activeColor : inactiveColor,
              transition: 'background-color 150ms linear, box-shadow 150ms linear',
              marginLeft: d === 1 ? 0 : 8,
              border: 'none',
              cursor: 'pointer'
            }}
          />
        );
      })}
    </div>
  );
};

const StepperHeader = ({ stepTitle, step, canNext, onPrev, onNext, onClose, onJumpTo }: Props) => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="ms-2 d-flex align-items-center">
        <StepDots step={step} total={2} onJumpTo={onJumpTo} />
      </div>
    </div>
  );
};

export default StepperHeader;
