import { useEffect, useRef, useState } from 'react';
import { RotateCw, Ticket, Sparkles, Coins } from 'lucide-react';
import { rewardTypes, type SpinResult } from '../../services/spin.types';

const segments = rewardTypes;
const sectorAngle = 360 / segments.length;
export default function SpinWheel({ result, onComplete, onSpin, disabled, spinning }: {
  result: SpinResult | null; onComplete: () => void; onSpin: () => void; disabled: boolean; spinning: boolean;
}) {
  const [rotation, setRotation] = useState(0);
  const lastId = useRef<string | null>(null);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  useEffect(() => {
    if (!result) return;
    if (lastId.current !== result.id) {
      lastId.current = result.id;
      const target = (360 - (segments.indexOf(result.rewardType) * sectorAngle + sectorAngle / 2)) % 360;
      setRotation(previous => previous + 1800 + ((target - previous % 360 + 360) % 360));
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Timer also completes when transitionend is unavailable (background tabs).
    const timer = window.setTimeout(() => complete.current(), reduced ? 50 : 4250);
    return () => window.clearTimeout(timer);
  }, [result]);
  return <div className="relative isolate w-full max-w-[410px] p-[13px] max-[380px]:p-2.5 before:absolute before:inset-0 before:-z-10 before:rounded-full before:border before:border-dashed before:border-(--regen-forest) before:opacity-25 before:content-[''] after:absolute after:-bottom-3 after:left-[16%] after:-z-10 after:h-[18px] after:w-[68%] after:rounded-full after:bg-(--regen-ink-a20) after:blur-[9px] after:content-['']">
    <Sparkles className="absolute top-[7%] left-0 z-2 size-6 -rotate-15 text-(--regen-forest)" aria-hidden="true" />
    <Sparkles className="absolute right-0 bottom-[6%] z-2 size-6 rotate-12 text-(--regen-coral)" aria-hidden="true" />
    <div className="relative aspect-square w-full rounded-full bg-(--regen-ink) shadow-[0_7px_0_var(--regen-green-dark),0_12px_0_var(--regen-border),0_20px_32px_var(--regen-ink-a20)] outline-2 outline-offset-3 outline-(--regen-ink)" role="group" aria-label="Roda hadiah: Voucher Shopee 10%, Poin +5, Voucher Shopee 50%, Poin +10, Coba lagi">
    <svg className="absolute inset-0 size-full fill-(--regen-cream)" viewBox="0 0 400 400" aria-hidden="true">
      {Array.from({ length: 32 }, (_, index) => {
        const angle = index * Math.PI / 16;
        return <circle key={index} cx={200 + 188 * Math.sin(angle)} cy={200 - 188 * Math.cos(angle)} r={index % 4 === 0 ? 3.5 : 2} />;
      })}
    </svg>
    <span className="absolute -top-[15px] left-[calc(50%-21px)] z-2 h-[53px] w-[42px] bg-(--regen-ink) [clip-path:polygon(50%_100%,3%_25%,10%_8%,24%_0,76%_0,90%_8%,97%_25%)] after:absolute after:inset-[6px_7px_10px] after:bg-(--regen-coral) after:[clip-path:polygon(0_0,100%_0,50%_100%)] after:content-['']" aria-hidden="true" />
    <div className="absolute inset-[6%] rounded-full border-[3px] border-(--regen-paper) bg-[conic-gradient(var(--regen-electric)_0deg_71.5deg,var(--regen-paper)_71.5deg_72deg,var(--regen-yellow)_72deg_143.5deg,var(--regen-paper)_143.5deg_144deg,var(--regen-coral-soft)_144deg_215.5deg,var(--regen-paper)_215.5deg_216deg,var(--regen-forest)_216deg_287.5deg,var(--regen-paper)_287.5deg_288deg,var(--regen-lime)_288deg_359.5deg,var(--regen-paper)_359.5deg_360deg)] shadow-[inset_0_0_0_5px_#ffffff35] transition-transform duration-[4200ms] ease-[cubic-bezier(.15,.65,.12,1)] motion-reduce:transition-none" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
      <svg className="absolute inset-0 size-full" viewBox="0 0 400 400">
        {segments.map((segment, index) => {
          const voucher = segment.startsWith('VOUCHER');
          const points = segment.startsWith('POINTS');
          const label = segment === 'VOUCHER_10' ? 'SHOPEE 10%' : segment === 'VOUCHER_50' ? 'SHOPEE 50%' : segment === 'POINTS_5' ? 'POIN 5' : segment === 'POINTS_10' ? 'POIN 10' : 'COBA LAGI';
          const Icon = voucher ? Ticket : points ? Coins : RotateCw;
          return <g key={segment} transform={`translate(200 200) rotate(${90 + sectorAngle / 2 + index * sectorAngle})`} className={segment === 'POINTS_10' ? 'text-(--regen-cream)' : 'text-(--regen-ink)'}>
            <text x="-142" y="0" fill="currentColor" textAnchor="middle" dominantBaseline="central" className="font-[family-name:var(--font-russo)]" fontSize={voucher ? 14 : 16}>
              {label}
            </text>
            <Icon x="-91" y="-14" width="28" height="28" strokeWidth={1.8} />
          </g>;
        })}
      </svg>
    </div>
    <button type="button" onClick={onSpin} disabled={disabled} aria-label={spinning ? 'Roda sedang berputar' : 'Putar roda hadiah'} className="absolute inset-[38%] flex cursor-pointer flex-col items-center justify-center gap-1 rounded-full border-4 border-(--regen-ink) bg-(--regen-paper) p-2 shadow-[0_5px_0_#183b2b30] outline-3 outline-(--regen-paper) transition-colors enabled:hover:bg-(--regen-electric) focus-visible:ring-4 focus-visible:ring-(--regen-coral) disabled:cursor-default disabled:opacity-75"><img className="h-auto w-full" src="/regen-dark.webp" alt="" width="70" height="30" /><span className="text-[10px] font-black tracking-wide">{spinning ? 'MEMUTAR…' : 'SPIN'}</span></button>
  </div></div>;
}
