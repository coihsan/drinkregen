import { Ticket } from 'lucide-react';
export function DailySpinBonus() {
  return <span className="my-2 inline-flex items-center gap-2 rounded-xl bg-(--regen-electric) px-4 py-2 font-bold text-(--regen-ink)"><Ticket className="size-5" aria-hidden="true" />5 spin setiap hari</span>;
}
export default function SpinInvite() {
  return <div className="rounded-3xl border-2 border-(--regen-ink) bg-(--regen-yellow) p-5 text-center">
    <p className="font-[family-name:var(--font-russo)] text-xl">Anda berkesempatan mendapatkan 1 Karton REGEN gratis!</p>
    <p className="mt-2 text-sm leading-relaxed">Daftarkan nomor WhatsApp untuk mendapatkan tambahan 5 kesempatan spin. Kumpulkan 150 poin dan tukarkan dengan 1 Karton REGEN.</p>
    <DailySpinBonus />
  </div>;
}
