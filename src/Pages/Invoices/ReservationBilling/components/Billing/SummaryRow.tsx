const SummaryRow = ({
  label,
  value,
  isBold = false
}: {
  label: string;
  value: number;
  isBold?: boolean;
}) => (
  <div className={`d-flex justify-content-between ${isBold ? 'fw-bold fs-6' : ''}`}>
    <div>{label}</div>
    <div>{value.toFixed(2)}</div>
  </div>
);

export default SummaryRow;
