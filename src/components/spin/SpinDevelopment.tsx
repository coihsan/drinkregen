import { useRef, useState, useSyncExternalStore } from 'react';
import { defaultSpinRewards, type RewardType } from '../../services/spin.types';
import { createDevelopmentSpinService } from '../../services/spin.development';
import SpinGame from './SpinGame';
import {readPreview, subscribePreview, previewSchema} from '../../services/spin-preview';

export default function SpinDevelopment() {
  const snapshot = useSyncExternalStore(subscribePreview, readPreview, () => null);
  const parsed = previewSchema.safeParse((() => { try { return JSON.parse(snapshot ?? 'null'); } catch { return null; } })());
  const catalog = parsed.success ? parsed.data : undefined;
  return <DevelopmentGame key={snapshot ?? 'default'} catalog={catalog} />;
}
function DevelopmentGame({catalog}:{catalog?: import('zod').infer<typeof previewSchema>}) {
  const selected = useRef<RewardType | 'random'>('random');
  const [service] = useState(() => createDevelopmentSpinService(() => selected.current, catalog));
  return <>
    <aside className="relative z-10 mx-auto max-w-xl rounded-xl border border-amber-400 bg-amber-50 p-4 text-sm text-amber-950">
      <p className="font-bold">Mode development — spin tanpa batas</p>
      <p className="mt-1">Kuota selalu diisi ulang. Poin dan voucher hanya simulasi. Muat ulang halaman untuk mereset sesi.</p>
      <label className="mt-3 flex flex-wrap items-center gap-2">
        Hasil putaran berikutnya
        <select className="rounded border border-amber-600 bg-white p-2" defaultValue="random" onChange={event => { selected.current = event.target.value as RewardType | 'random'; }}>
          <option value="random">Acak</option>
          {(catalog?.spinRewards ?? defaultSpinRewards).map(reward => <option key={reward.code} value={reward.code}>{reward.name}</option>)}
        </select>
      </label>
    </aside>
    <SpinGame service={service} />
  </>;
}
