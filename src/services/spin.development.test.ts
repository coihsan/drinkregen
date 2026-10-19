import test from 'node:test';
import assert from 'node:assert/strict';
import { createDevelopmentSpinService } from './spin.development';
import { rewardTypes, spinResultSchema, type RewardType } from './spin.types';
test('preview catalog expands the wheel and keeps grand prizes separate without API', async context => {
  context.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected API request'); });
  const spinRewards=Array.from({length:9},(_,i)=>({code:`POINTS_5_CUSTOM${i}`,name:`Bonus ${i}`,points:i+1}));
  const redemptionOptions=[{id:'PRIZE_CARTON',name:'Karton',cost:100,stockRemaining:10}];
  const service=createDevelopmentSpinService(()=>spinRewards[8].code,{spinRewards,redemptionOptions});
  const status=await service.getStatus();
  assert.equal(status.spinRewards?.length,9);
  assert.equal(status.redemptionOptions?.length,1);
  const result=spinResultSchema.parse(await service.spin('custom'));
  assert.equal(result.rewardType,'POINTS_5_CUSTOM8');
  assert.equal(result.awardedPoints,9);
  assert.equal(result.rewardName,'Bonus 8');
});


test('development allows repeated spins and every selected outcome without network requests', async context => {
  context.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected network request'); });
  let selected: RewardType = 'POINTS_5';
  const service = createDevelopmentSpinService(() => selected);
  for (let index = 0; index < 30; index++) {
    selected = rewardTypes[index % rewardTypes.length];
    const result = spinResultSchema.parse(await service.spin(`dev-${index}`));
    assert.equal(result.rewardType, selected);
    assert.equal(result.remainingSpins, 5);
    assert.equal(result.totalValidSpins, index + 1);
    assert.deepEqual(await service.spin(`dev-${index}`), result);
  }
  assert.equal((await service.getStatus()).points, 90);
  assert.equal((await createDevelopmentSpinService(() => 'random').getStatus()).points, 0);
});
