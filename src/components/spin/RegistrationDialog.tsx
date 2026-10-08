import { useState, type FormEvent } from 'react';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { RegistrationInput } from '../../services/spin.types';
import { spinButtonClasses } from './spin.styles';
export default function RegistrationDialog({ pending, error, challenge, onSubmit, onVerify }: {
  pending: boolean; error: string; challenge: boolean;
  onSubmit: (input: RegistrationInput) => void; onVerify: (code: string) => void;
}) {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [code, setCode] = useState('');
  function submit(event: FormEvent) { event.preventDefault(); if (!pending) challenge ? onVerify(code) : onSubmit({ name: name.trim(), whatsapp }); }
  return <>
    <DialogTitle>{challenge ? 'Verifikasi WhatsApp' : 'Simpan poin, lanjutkan spin'}</DialogTitle>
    <DialogDescription>{challenge ? 'Masukkan kode verifikasi yang dikirim ke nomor WhatsApp Anda.' : 'Isi nama dan nomor WhatsApp. Verifikasi nomor untuk menyimpan poin ke akun yang sama dan mendapatkan 5 spin tambahan.'}</DialogDescription>
    <form onSubmit={submit} className="grid gap-3 text-left [&_input]:min-h-12 [&_input]:text-base" aria-busy={pending}>
      {challenge ? <><label htmlFor="spin-code">Kode verifikasi</label><Input id="spin-code" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{6}" maxLength={6} value={code} onChange={event => setCode(event.target.value)} disabled={pending} /></> : <>
        <label htmlFor="spin-name">Nama</label><Input id="spin-name" autoComplete="name" required maxLength={80} value={name} onChange={event => setName(event.target.value)} disabled={pending} />
        <label htmlFor="spin-whatsapp">Nomor WhatsApp</label><Input id="spin-whatsapp" type="tel" inputMode="tel" autoComplete="tel" required placeholder="08xxxxxxxxxx" maxLength={18} value={whatsapp} onChange={event => setWhatsapp(event.target.value)} disabled={pending} />
      </>}
      {error && <p role="alert" className="text-sm text-(--regen-red-dark)">{error}</p>}
      <Button className={spinButtonClasses.register} type="submit" disabled={pending}>{pending ? 'MEMPROSES…' : challenge ? 'VERIFIKASI & LANJUTKAN' : 'KIRIM KODE VERIFIKASI'}</Button>
      <p className="text-xs leading-relaxed text-(--regen-muted)">Gunakan nomor yang sama untuk kembali ke akun Anda. Bonus pendaftaran diberikan satu kali; kuota harian diperbarui pukul 00.00 WIB.</p>
    </form>
  </>;
}
