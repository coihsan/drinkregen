import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMockSpinBackend, createMockSpinService } from './spin.mock';
import type { SpinService } from './spin.types';
const person = { name: 'Tester', whatsapp: '081234567890' };
async function login(service: SpinService, id = 'verify') {
  const challenge = await service.register(person);
  return service.verify(challenge.challengeId, '123456', id);
}
test('first spin always awards voucher or points, is single-use and idempotent', async () => {
  for (const roll of [0, 0.25, 0.5, 0.999]) {
    const service = createMockSpinService({}, () => roll);
    const result = await service.spin('first');
    assert.notEqual(result.rewardType, 'TRY_AGAIN');
    assert.equal(result.remainingSpins, 0);
    assert.deepEqual(await service.spin('first'), result);
    await assert.rejects(service.spin('second'));
  }
});
test('registration keeps guest points, grants five spins once, same number restores balance', async () => {
  const session = createMockSpinBackend(() => 0.3);
  const first = session();
  assert.equal((await first.spin('guest')).points, 5);
  assert.equal((await login(first)).points, 5);
  assert.equal((await first.getStatus()).remainingSpins, 5);
  assert.equal((await first.spin('member')).points, 10);
  const returning = session();
  const state = await login(returning);
  assert.equal(state.points, 10);
  assert.equal(state.remainingSpins, 4);
  assert.equal((await login(returning, 'again')).remainingSpins, 4);
});
test('verification is required and replay cannot re-credit guest points', async () => {
  const service = createMockSpinService({}, () => 0.3);
  await service.spin('guest');
  const { challengeId } = await service.register(person);
  await assert.rejects(service.verify(challengeId, '000000', 'bad'));
  await assert.rejects(service.redeem('THREE_BOTTLES', 'no-auth'));
  const verified = await service.verify(challengeId, '123456', 'ok');
  assert.deepEqual(await service.verify(challengeId, '123456', 'ok'), verified);
  assert.equal(verified.points, 5);
});
test('redemption deducts 100 or 25, preserves remainder, prevents overspend and duplicate debit', async () => {
  const service = createMockSpinService({ points: 140 });
  await login(service);
  const carton = await service.redeem('CARTON', 'carton');
  assert.equal(carton.points, 40);
  assert.deepEqual(await service.redeem('CARTON', 'carton'), carton);
  await assert.rejects(service.redeem('THREE_BOTTLES', 'carton'));
  assert.equal((await service.redeem('THREE_BOTTLES', 'bottles')).points, 15);
  await assert.rejects(service.redeem('THREE_BOTTLES', 'insufficient'));
  assert.equal((await service.getStatus()).points, 15);
});
test('concurrent redemption cannot spend the same points twice', async () => {
  const service = createMockSpinService({ points: 100 }); await login(service);
  const results = await Promise.allSettled([service.redeem('CARTON', 'a'), service.redeem('CARTON', 'b')]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal((await service.getStatus()).points, 0);
});
test('Jakarta midnight resets quota to five without changing points; guests do not reset', async context => {
  context.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-06T16:59:00Z').getTime() });
  const service = createMockSpinService({ points: 35 }); await login(service);
  for (let i = 0; i < 5; i++) await service.spin(String(i));
  const before = await service.getStatus();
  const guest = createMockSpinService(); await guest.spin('free');
  context.mock.timers.tick(120000);
  const after = await service.getStatus();
  assert.equal(after.remainingSpins, 5); assert.equal(after.points, before.points);
  await service.spin('new-day'); assert.equal((await service.getStatus()).remainingSpins, 4);
  assert.equal((await guest.getStatus()).remainingSpins, 0);
});
