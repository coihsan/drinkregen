import { Sparkles, Ticket, Zap } from 'lucide-react';

/** Static decoration keeps the wheel as the only moving focal point. */
export default function SpinBackground() {
  return <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_15%,var(--regen-lime),transparent_48%),radial-gradient(ellipse_at_100%_48%,var(--regen-yellow),transparent_50%),linear-gradient(160deg,var(--regen-green-soft),var(--regen-paper)_55%,var(--regen-gold-soft))]" />
    <div className="absolute inset-0 bg-[radial-gradient(var(--regen-forest)_1px,transparent_1px)] bg-size-[22px_22px] opacity-[.13]" />
    <div className="absolute top-[180px] left-1/2 aspect-square w-[min(115vw,760px)] -translate-x-1/2 rounded-full border border-white/60 bg-[radial-gradient(circle,white_0%,white_35%,transparent_70%)] opacity-60" />
    <div className="absolute -left-32 top-[12%] size-64 rounded-full border-[28px] border-(--regen-forest)/10 sm:-left-24 sm:size-96 sm:border-[42px]" />
    <div className="absolute -right-28 top-[52%] size-72 rounded-full border-[32px] border-(--regen-coral)/15 sm:size-[420px]" />
    <div className="absolute -bottom-40 -left-24 h-72 w-[75%] -rotate-12 rounded-[50%] bg-(--regen-lime)/20" />
    <Zap className="absolute top-[20%] left-[5%] size-10 -rotate-12 fill-(--regen-yellow) text-(--regen-forest)/25 sm:left-[14%] sm:size-16" strokeWidth={1.5} />
    <Ticket className="absolute top-[35%] right-[3%] size-11 rotate-20 text-(--regen-forest)/20 sm:right-[13%] sm:size-20" strokeWidth={1.5} />
    <Sparkles className="absolute top-[65%] left-[4%] size-9 -rotate-12 text-(--regen-coral)/35 sm:left-[18%] sm:size-14" strokeWidth={1.5} />
    <div className="absolute bottom-0 h-32 w-full bg-linear-to-t from-(--regen-paper) to-transparent" />
  </div>;
}
