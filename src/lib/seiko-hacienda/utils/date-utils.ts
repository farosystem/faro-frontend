export function createDateOfSubmission(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const fechaEmision = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  return fechaEmision;
}
