import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { computeTotals } from '../bookingTotals';

describe('computeTotals cancellation rules', () => {
  const baseInput = {
    packageList: [{ precio: 100 }],
    rooms: [{ precioPorNoche: 50 }],
    servicesPerRoom: [],
    extraServices: [],
    tours: [],
    peopleCount: 1,
    nights: 2
  };

  it('no penalty when checkin >= 7 days', () => {
    const checkIn = dayjs().add(10, 'day').toISOString();
    const res = computeTotals({ ...baseInput, checkIn });
    expect(res.total).toBe(100 + 50 * 2); // 200
    expect(res.cancellation).toBeDefined();
    expect(res.cancellation?.penaltyRate).toBe(0);
    expect(res.cancellation?.totalPenalty).toBe(0);
    expect(res.cancellation?.refundable).toBe(res.total);
  });

  it('50% penalty when checkin 3 days away', () => {
    const checkIn = dayjs().add(3, 'day').toISOString();
    const res = computeTotals({ ...baseInput, checkIn });
    expect(res.cancellation?.penaltyRate).toBe(0.5);
    const expectedPenalty = res.total * 0.5;
    expect(res.cancellation?.totalPenalty).toBeCloseTo(expectedPenalty, 2);
    expect(res.cancellation?.refundable).toBeCloseTo(res.total - expectedPenalty, 2);
  });

  it('100% penalty when checkin 1 day away', () => {
    const checkIn = dayjs().add(1, 'day').toISOString();
    const res = computeTotals({ ...baseInput, checkIn });
    expect(res.cancellation?.penaltyRate).toBe(1);
    expect(res.cancellation?.totalPenalty).toBeCloseTo(res.total, 2);
    expect(res.cancellation?.refundable).toBeCloseTo(0, 2);
  });
});
