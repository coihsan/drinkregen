import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMockSpinBackend, createMockSpinService } from './spin.mock';
import type { SpinService } from './spin.types';
const person = { name: 'Nama Peserta', whatsapp: '081234567890' };
const recipient = {recipientName:'Peserta',phone:'081234567890',province:'DKI Jakarta',city:'Jakarta',district:'Gambir',address:'Jalan Contoh Nomor 123',postalCode:'10110'};
async function login(service: SpinService, id = 'verify') {
  return service.register(person,id);
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
test('phone registration keeps guest points and grants five spins once', async () => {
  const session = createMockSpinBackend(() => 0.3);
  const first = session();
  assert.equal((await first.spin('guest')).points, 5);
  assert.equal((await login(first)).points, 5);
  assert.equal((await first.getStatus()).remainingSpins, 5);
  assert.equal((await first.spin('member')).points, 10);
  const returning=session();
  await returning.spin('new-browser-guest');
  const resumed=await login(returning);
  assert.equal(resumed.points,10);
  assert.equal(resumed.remainingSpins,4);
  assert.equal(resumed.totalValidSpins,2);
  assert.equal((await login(first,'again')).remainingSpins,4);
});

test('registration is direct and replay cannot credit guest points again',async()=>{
 const service=createMockSpinService({},()=>0.3);await service.spin('guest');
 await assert.rejects(service.redeem('THREE_BOTTLES','no-registration',recipient));
 const registered=await service.register(person,'register-once');
 assert.equal(registered.points,5);assert.equal(registered.remainingSpins,5);
 assert.deepEqual(await service.register(person,'register-once'),registered);
});

test('redemption deducts 100 or 25, preserves remainder, prevents overspend and duplicate debit', async () => {
  const service = createMockSpinService({ points: 140 });
  await login(service);
  const carton = await service.redeem('CARTON', 'carton', recipient);
  assert.equal(carton.points, 40);
  assert.deepEqual(await service.redeem('CARTON', 'carton', recipient), carton);
  await assert.rejects(service.redeem('THREE_BOTTLES', 'carton', recipient));
  assert.equal((await service.redeem('THREE_BOTTLES', 'bottles', recipient)).points, 15);
  await assert.rejects(service.redeem('THREE_BOTTLES', 'insufficient', recipient));
  assert.equal((await service.getStatus()).points, 15);
});
test('concurrent redemption cannot spend the same points twice', async () => {
  const service = createMockSpinService({ points: 100 }); await login(service);
  const results = await Promise.allSettled([service.redeem('CARTON', 'a', recipient), service.redeem('CARTON', 'b', recipient)]);
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1);
  assert.equal((await service.getStatus()).points, 0);
});
test('quota resets exactly 24 hours after exhaustion; midnight and guests do not reset', async context => {
  context.mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-06T16:59:00Z').getTime() });
  const service = createMockSpinService({ points: 35 }); await login(service);
  for (let i = 0; i < 5; i++) await service.spin(String(i));
  const before = await service.getStatus();
  const guest = createMockSpinService(); await guest.spin('free');
  context.mock.timers.tick(120000);
  assert.equal((await service.getStatus()).remainingSpins, 0);
  await assert.rejects(service.spin('too-early'));
  context.mock.timers.tick(86400000 - 120000 - 1);
  assert.equal((await service.getStatus()).remainingSpins, 0);
  context.mock.timers.tick(1);
  const after = await service.getStatus();
  assert.equal(after.remainingSpins, 5); assert.equal(after.points, before.points);
  await service.spin('new-day'); assert.equal((await service.getStatus()).remainingSpins, 4);
  assert.equal((await guest.getStatus()).remainingSpins, 0);
});
