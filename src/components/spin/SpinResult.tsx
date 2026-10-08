import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { SpinResult as Result } from '../../services/spin.types';
import SpinInvite from './SpinInvite';
import { spinButtonClasses } from './spin.styles';
const copy = {
  VOUCHER_10: ['🎟️', 'Voucher Shopee 10%', 'Anda mendapatkan voucher diskon Shopee 10%.'],
  VOUCHER_50: ['🎟️', 'Voucher Shopee 50%', 'Anda mendapatkan voucher diskon Shopee 50%.'],
  POINTS_5: ['✨', '+5 poin untuk Anda!', 'Poin sudah ditambahkan ke saldo Anda.'],
  POINTS_10: ['✨', '+10 poin untuk Anda!', 'Poin sudah ditambahkan ke saldo Anda.'],
  TRY_AGAIN: ['🔄', 'Coba lagi, ya!', 'Belum mendapatkan hadiah kali ini.'],
};
export default function SpinResult({ result, onContinue }: { result: Result; onContinue: () => void }) {
  const [icon, title, description] = copy[result.rewardType];
  return <>
    <span className="text-5xl" aria-hidden="true">{icon}</span>
    <DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription>
    <p className="rounded-2xl bg-(--regen-green-soft) p-4 font-bold">Saldo Anda: {result.points} poin</p>
    {result.voucher && <div className="rounded-xl border border-dashed border-(--regen-ink) p-4"><p className="text-sm">Kode voucher Shopee</p><p className="mt-1 select-all break-all font-mono text-xl font-bold">{result.voucher.code}</p><p className="mt-2 text-xs">Berlaku sampai {new Date(result.voucher.expiresAt).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta' })}</p></div>}
    {!result.registered && <SpinInvite />}
    <Button className={spinButtonClasses.dialog} onClick={onContinue}>{!result.registered ? 'ISI DATA & DAPATKAN 5 SPIN' : 'LANJUTKAN'}</Button>
  </>;
}
