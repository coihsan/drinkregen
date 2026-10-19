import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApiSpinService, SpinApiError } from './spin.service';
const status = { registered: true, user: { id: 'u1', name: 'Tester' }, remainingSpins: 5, totalValidSpins: 1, points: 110, dailyResetAt: '2026-10-08T00:00:00+07:00', csrfToken: 'csrf-test' };
test('API sends credentialed CSRF-protected commands, never client balance/cost/outcome', async context => {
  const calls: { url: string; options?: RequestInit }[] = [];
  const replies = [status, { ...status, id: 'spin-1', rewardType: 'POINTS_5', points: 115 }, { ...status, points: 15, redemption: { id: 'claim-1', rewardId: 'CARTON', status: 'confirmed' } }];
  context.mock.method(globalThis, 'fetch', async (url: string, options?: RequestInit) => { calls.push({ url, options }); return Response.json(replies.shift()); });
  const service = createApiSpinService(); await service.getStatus();
  assert.equal((await service.spin('spin-key')).points, 115);
  assert.equal((await service.redeem('CARTON', 'claim-key')).points, 15);
  assert.equal(calls[0].url, 'https://api.drinkregen.com/api/v1/spin/status');
  assert.equal(calls[1].options?.credentials, 'include');
  assert.equal(calls[1].options?.body, '{}');
  assert.equal(calls[2].options?.body, JSON.stringify({ rewardId: 'CARTON' }));
  assert.equal((calls[2].options?.headers as Record<string, string>)['X-CSRF-Token'], 'csrf-test');
  assert.equal((calls[2].options?.headers as Record<string, string>)['Idempotency-Key'], 'claim-key');
});
test('API fails closed on missing session, bad response, unsupported prizes and server error', async context => {
  const service = createApiSpinService();
  await assert.rejects(service.spin('no-session'));
  const fetchMock = context.mock.method(globalThis, 'fetch', async () => Response.json(status));
  await service.getStatus();
  fetchMock.mock.mockImplementation(async () => Response.json({ ...status, id: 'bad', rewardType: 'GRAND_PRIZE' }));
  await assert.rejects(service.spin('bad'));
  fetchMock.mock.mockImplementation(async () => Response.json({ ...status, points: -1 }));
  await assert.rejects(service.getStatus());
  fetchMock.mock.mockImplementation(async () => new Response('', { status: 503 }));
  await assert.rejects(service.spin('retry'), cause => cause instanceof SpinApiError && !cause.definitive);
  fetchMock.mock.mockImplementation(async () => new Response('', { status: 409 }));
  await assert.rejects(service.redeem('CARTON', 'pending'), cause => cause instanceof SpinApiError && !cause.definitive);
});

test('parallel status loads share a request so cookie and CSRF cannot be split across guest sessions', async context => {
  let calls=0;
  context.mock.method(globalThis,'fetch',async()=>{calls++;return Response.json({...status,available:false,remainingSpins:0});});
  const service=createApiSpinService();
  const [first,second]=await Promise.all([service.getStatus(),service.getStatus()]);
  assert.equal(calls,1);assert.deepEqual(first,second);assert.equal(first.available,false);
  await service.getStatus();assert.equal(calls,2);
});

test('registration posts name and WhatsApp and immediately returns member status without OTP',async context=>{
  let calls=0;
  context.mock.method(globalThis,'fetch',async(url:string,options?:RequestInit)=>{
    calls++;
    if(calls===1)return Response.json({...status,registered:false,user:null,remainingSpins:1});
    assert.equal(url,'https://api.drinkregen.com/api/v1/spin/register');
    assert.equal(options?.body,JSON.stringify({name:'Nama Peserta',whatsapp:'081234567890'}));
    assert.equal((options?.headers as Record<string,string>)['Idempotency-Key'],'registration-key');
    return Response.json({...status,remainingSpins:5});
  });
  const service=createApiSpinService();await service.getStatus();
  const registered=await service.register({name:'Nama Peserta',whatsapp:'081234567890'},'registration-key');
  assert.equal(registered.registered,true);assert.equal(registered.remainingSpins,5);
});

test('dynamic prize catalog and configured spin points survive validation and redemption',async context=>{
 const dynamic={...status,redemptionOptions:[{id:'PRIZE_CUSTOM',name:'Paket REGEN',cost:37,stockRemaining:2}],spinRewards:[{code:'POINTS_5',name:'Bonus Poin',points:8}]};let calls=0;
 context.mock.method(globalThis,'fetch',async(url:string,options?:RequestInit)=>{
 calls++;if(calls===1)return Response.json(dynamic);
 assert.equal(options?.body,JSON.stringify({rewardId:'PRIZE_CUSTOM'}));
 return Response.json({...dynamic,points:73,redemption:{id:'claim-custom',rewardId:'PRIZE_CUSTOM',status:'confirmed'}});
 });
 const service=createApiSpinService();const loaded=await service.getStatus();
 assert.equal(loaded.redemptionOptions?.[0].cost,37);assert.equal(loaded.spinRewards?.[0].points,8);
 assert.equal((await service.redeem('PRIZE_CUSTOM','custom-key')).points,73);
});

 test('grand prize images use local assets for database codes and types', async () => {
 const { getRedemptionImage } = await import('../components/spin/redemption-images');
 assert.equal(getRedemptionImage({id:'CARTON'}),'/spin/karton-regen.webp');
 assert.equal(getRedemptionImage({id:'PRIZE_NEW',type:'CARTON_MIX'}),'/spin/karton-regen.webp');
 assert.equal(getRedemptionImage({id:'PRIZE_NEW',type:'BOTTLE'}),'/spin/3botol-regen.webp');
 assert.equal(getRedemptionImage({id:'UNKNOWN'}),undefined);
 });

 test('database catalog preserves prize type and empty catalog without static prizes', async context => {
 context.mock.method(globalThis,'fetch',async()=>Response.json({...status,redemptionOptions:[{id:'CUSTOM',name:'Paket Karton',type:'CARTON_MIX',cost:75,stockRemaining:0}]}));
 const service=createApiSpinService();
 assert.equal((await service.getStatus()).redemptionOptions?.[0].type,'CARTON_MIX');
 context.mock.method(globalThis,'fetch',async()=>Response.json({...status,redemptionOptions:[]}));
 assert.deepEqual((await service.getStatus()).redemptionOptions,[]);
 });

test('uploaded image takes priority over legacy assets',async()=>{const {getRedemptionImage}=await import('../components/spin/redemption-images');assert.equal(getRedemptionImage({id:'CARTON',imageUrl:'/api/v1/spin/images/test.png'}),'https://api.drinkregen.com/api/v1/spin/images/test.png');});
