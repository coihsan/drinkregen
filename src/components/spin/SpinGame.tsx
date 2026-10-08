import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { spinService, SpinApiError } from '../../services/spin.service';
import { redemptionOptions, type RegistrationInput, type SpinResult as Result, type SpinService, type SpinStatus, type RedemptionType, type RedemptionResult } from '../../services/spin.types';
import SpinWheel from './SpinWheel';
import SpinInvite from './SpinInvite';
import SpinBackground from './SpinBackground';
import SpinResult from './SpinResult';
import RegistrationDialog from './RegistrationDialog';
import { spinButtonClasses } from './spin.styles';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQGame = [
  { question: "Apa itu REGEN?", answer: "REGEN adalah program loyalitas yang memberikan hadiah berupa voucher dan poin kepada pelanggan setia." },
  { question: "Bagaimana cara mendapatkan poin?", answer: "Anda bisa mendapatkan poin dengan melakukan spin dan memenangkan hadiah." },
  { question: "Berapa banyak spin yang bisa dilakukan?", answer: "Anda bisa melakukan hingga 5 spin per hari." }
]

type Phase = 'loading' | 'ready' | 'requesting' | 'spinning' | 'result' | 'registration' | 'registering' | 'confirm' | 'redeeming' | 'redeemed' | 'error';
export default function SpinGame({ service = spinService }: { service?: SpinService }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [status, setStatus] = useState<SpinStatus | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const [challenge, setChallenge] = useState<string | null>(null);
  const [chosen, setChosen] = useState<RedemptionType | null>(null);
  const [redemption, setRedemption] = useState<RedemptionResult | null>(null);
  const busy = useRef(false);
  const revision = useRef(0);
  const requestId = useRef<string | null>(null);
  const verifyId = useRef<string | null>(null);
  const redeemId = useRef<string | null>(null);
  const primary = useRef<HTMLButtonElement>(null);
  const load = useCallback(async () => {
    if (busy.current) return;
    const current = ++revision.current;
    setError(''); setPhase('loading');
    try { const next = await service.getStatus(); if (current === revision.current) { setStatus(next); setPhase('ready'); } }
    catch { if (current === revision.current) { setError('Layanan spin belum tersedia. Silakan coba lagi nanti.'); setPhase('error'); } }
  }, [service]);
  useEffect(() => { void load(); }, [load]);
  // Ask the server at midnight / on return; never reset quota or points locally.
  useEffect(() => {
    async function refresh() {
      if (document.visibilityState !== 'visible' || phase !== 'ready' || busy.current || requestId.current) return;
      const current = ++revision.current;
      try { const next = await service.getStatus(); if (current === revision.current && !busy.current) setStatus(next); }
      catch { setError('Status belum diperbarui. Coba lagi saat koneksi tersedia.'); }
    }
    const timer = window.setInterval(() => { if (status && Date.now() >= Date.parse(status.dailyResetAt)) void refresh(); }, 30000);
    document.addEventListener('visibilitychange', refresh);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', refresh); };
  }, [phase, status, service]);
  async function spin() {
    if (busy.current || phase !== 'ready' || !status?.remainingSpins) return;
    busy.current = true; revision.current++; setError(''); setPhase('requesting');
    requestId.current ??= crypto.randomUUID();
    try { setResult(await service.spin(requestId.current)); setPhase('spinning'); }
    catch (cause) {
      if (cause instanceof SpinApiError && cause.definitive) requestId.current = null;
      setError('Spin belum terkonfirmasi. Tekan spin untuk mencoba kembali permintaan yang sama.');
      setPhase('ready'); busy.current = false;
    }
  }
  function complete() {
    if (!result) return;
    setStatus(result); setPhase('result'); busy.current = false; requestId.current = null;
  }
  async function register(input: RegistrationInput) {
    if (busy.current) return;
    busy.current = true; revision.current++; setError(''); setPhase('registering');
    try { const next = await service.register(input); setChallenge(next.challengeId); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Kode belum terkirim. Coba lagi.'); }
    finally { busy.current = false; setPhase('registration'); }
  }
  async function verify(code: string) {
    if (busy.current || !challenge) return;
    busy.current = true; setError(''); setPhase('registering'); verifyId.current ??= crypto.randomUUID();
    try { setStatus(await service.verify(challenge, code, verifyId.current)); verifyId.current = null; setChallenge(null); setPhase('ready'); }
    catch (cause) { if (cause instanceof SpinApiError && cause.definitive) verifyId.current = null; setError(cause instanceof Error ? cause.message : 'Verifikasi belum berhasil. Coba kembali.'); setPhase('registration'); }
    finally { busy.current = false; }
  }
  async function redeem() {
    if (busy.current || !chosen) return;
    busy.current = true; revision.current++; setError(''); setPhase('redeeming'); redeemId.current ??= crypto.randomUUID();
    try {
      const next = await service.redeem(chosen, redeemId.current);
      setStatus(next); setRedemption(next); redeemId.current = null; setPhase('redeemed');
    } catch (cause) {
      if (cause instanceof SpinApiError && cause.definitive) redeemId.current = null;
      setError('Penukaran belum terkonfirmasi. Coba lagi untuk memeriksa permintaan yang sama.'); setPhase('confirm');
    } finally { busy.current = false; }
  }
  const dialogOpen = ['result', 'registration', 'registering', 'confirm', 'redeeming', 'redeemed'].includes(phase);
  const spinning = phase === 'spinning' || phase === 'requesting';
  const exhausted = status?.registered && status.remainingSpins === 0;
  const registerOffer = status && !status.registered && status.remainingSpins === 0;
  const selected = redemptionOptions.find(option => option.id === chosen);
  const canClose = !busy.current && !redeemId.current && !verifyId.current;
  const canSpin = phase === 'ready' && !!status?.remainingSpins;
  return <main className="relative isolate overflow-clip bg-(--regen-paper) px-5 pt-[132px] pb-[72px] font-sans text-(--regen-ink) max-[700px]:pt-28 [&_button]:touch-manipulation" lang="id">
    <SpinBackground />
    <section className="mx-auto w-full max-w-[520px] text-center" aria-labelledby="spin-title">
      <h1 id="spin-title"><img className="mx-auto -mb-6 h-auto w-[65%] max-w-[250px]" src="/spin/spin-the-wheel-logo.webp" alt="REGEN Spin & Win" width="1221" height="819" fetchPriority="high" /></h1>
      {status && <div className="mb-7 rounded-3xl border-2 border-(--regen-ink) bg-(--regen-paper) p-5 text-left shadow-[4px_4px_0_var(--regen-lime)]" aria-live="polite">
        <p className="break-words text-sm font-bold">{status.user ? `Halo, ${status.user.name}!` : 'Selamat datang! Coba 1 spin gratis.'}</p>
        <div className="mt-4 grid grid-cols-2 gap-4"><div><p className="text-xs uppercase tracking-wider">Saldo poin</p><strong className="text-4xl">{status.points}<span className="ml-2 text-sm">poin</span></strong></div><div className="border-l border-(--regen-border) pl-5"><p className="text-xs uppercase tracking-wider">Kesempatan</p><strong className="text-4xl">{status.remainingSpins}<span className="ml-2 text-sm">spin</span></strong></div></div>
        <p className="mt-3 text-xs text-(--regen-muted)">{status.registered ? '5 spin setiap hari • Reset pukul 00.00 WIB' : 'Isi data setelah spin untuk menyimpan poin dan mendapatkan 5 spin tambahan.'}</p>
      </div>}
      <div className="mb-7 grid justify-items-center gap-6" aria-busy={spinning}>
        <SpinWheel result={result} onComplete={complete} onSpin={() => void spin()} disabled={!canSpin} spinning={spinning} />
        <Button ref={primary} className={spinButtonClasses.play} disabled={phase !== 'ready' || !status || (!!exhausted && !registerOffer)} onClick={() => registerOffer ? setPhase('registration') : void spin()}>
          {phase === 'loading' ? 'MENYIAPKAN SPIN…' : spinning ? 'SEDANG BERPUTAR…' : registerOffer ? 'ISI DATA & DAPATKAN 5 SPIN' : exhausted ? 'SPIN HABIS HARI INI' : 'SPIN SEKARANG'}
        </Button>
        {exhausted && <p className="text-sm">Kesempatan Anda diperbarui menjadi 5 spin pukul 00.00 WIB.</p>}
        {registerOffer && <SpinInvite />}
        {status && !status.registered && phase === 'ready' && !requestId.current && <Button variant="link" onClick={() => setPhase('registration')}>Sudah punya akun? Masuk dengan WhatsApp</Button>}
        {error && !dialogOpen && <p role="alert" className="text-sm text-(--regen-red-dark)">{error}</p>}
        {phase === 'error' && <Button variant="outline" onClick={() => void load()}>COBA MUAT ULANG</Button>}
      </div>
      <section className="mt-10 text-left" aria-labelledby="redeem-title">
        <h2 id="redeem-title" className="font-[family-name:var(--font-headoh)] text-2xl">Tukarkan Hadiah</h2><p className="mt-2 text-sm">Pilih hadiah yang Anda inginkan. Sisa poin tetap tersimpan setelah penukaran.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {redemptionOptions.map(option => 
            <article key={option.id} className="flex flex-col rounded-2xl border-2 border-(--regen-ink) bg-(--regen-paper) p-3 sm:p-5">
              <div className="mb-3 flex h-28 items-center justify-center"><img src={option.image} alt={option.name} className="h-28 w-full object-contain" width="150" height="112" /></div>
              <div className="flex flex-col text-center">
                <h3 className="font-bold">{option.name}</h3><p className="mt-1 text-xl font-black">{option.cost} poin</p>
                <p className="mt-2 mb-4 text-xs">{!status?.registered ? 'Masuk untuk menukar poin.' : status.points < option.cost ? `Butuh ${option.cost - status.points} poin lagi` : 'Poin Anda cukup!'}</p>
              </div>
              <Button className="mt-auto h-auto min-h-11 whitespace-normal bg-(--regen-ink) px-2 py-2 text-xs text-(--regen-paper)" disabled={phase !== 'ready' || !status?.registered || status.points < option.cost || !!requestId.current} onClick={() => { setChosen(option.id); setError(''); setPhase('confirm'); }}>Tukar {option.name}</Button>
            </article>
         )}
        </div>
      </section>
      <Accordion type="multiple" className="mt-10 w-full">
        {FAQGame.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-(--regen-border) py-4">
            <AccordionTrigger className="cursor-pointer font-bold">{item.question}</AccordionTrigger>
            <AccordionContent className="mt-2 text-sm leading-relaxed">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {/* <div className="mt-8 text-left [&_details]:border-b [&_details]:border-(--regen-border) [&_details]:py-4 [&_summary]:cursor-pointer [&_summary]:font-bold [&_p]:mt-2 [&_p]:text-sm [&_p]:leading-relaxed">
        <details><summary>Cara bermain</summary><p>Spin pertama memberi voucher Shopee atau poin. Isi nama dan verifikasi WhatsApp untuk menyimpan saldo dan mendapatkan 5 spin tambahan. Gunakan nomor yang sama saat kembali; kuota harian menjadi 5 spin setiap pukul 00.00 WIB dan tidak terakumulasi.</p></details>
        <details><summary>Hadiah dan penukaran</summary><p>Roda berisi Voucher Shopee 10%, Voucher Shopee 50%, +5 poin, +10 poin, dan Coba Lagi. Tukarkan 100 poin untuk 1 Karton REGEN atau 25 poin untuk 3 Botol REGEN. Poin hanya dipotong setelah penukaran berhasil. Sisa poin tetap tersimpan.</p></details>
        <details><summary>Ketentuan</summary><p>Hasil spin dan penukaran mengikuti ketersediaan serta ketentuan program. Kode dan masa berlaku voucher ditampilkan saat Anda mendapatkannya. Kuota spin berlaku per akun.</p></details>
      </div> */}
    </section>
    <Dialog open={dialogOpen} onOpenChange={open => { if (!open && canClose) { setPhase('ready'); setError(''); } }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto bg-(--regen-paper) text-center text-(--regen-ink)" showCloseButton={canClose} onCloseAutoFocus={event => { event.preventDefault(); primary.current?.focus(); }}>
        {phase === 'result' && result ? <SpinResult key={result.id} result={result} onContinue={() => setPhase(result.registered ? 'ready' : 'registration')} />
          : ['registration', 'registering'].includes(phase) ? <RegistrationDialog pending={phase === 'registering'} error={error} challenge={!!challenge} onSubmit={input => void register(input)} onVerify={code => void verify(code)} />
          : phase === 'redeemed' && redemption ? <><DialogTitle>Penukaran berhasil!</DialogTitle><DialogDescription>Permintaan {redemptionOptions.find(option => option.id === redemption.redemption.rewardId)?.name} tercatat. Saldo Anda sekarang {redemption.points} poin.</DialogDescription><p className="break-all text-xs">Nomor penukaran: {redemption.redemption.id}</p><Button onClick={() => setPhase('ready')}>SELESAI</Button></>
          : selected && <><DialogTitle>Tukar {selected.name}?</DialogTitle><DialogDescription>{selected.cost} poin akan dipotong setelah penukaran berhasil. Sisa saldo saat ini setelah penukaran: {Math.max(0, (status?.points ?? 0) - selected.cost)} poin.</DialogDescription>{error && <p role="alert" className="text-sm text-(--regen-red-dark)">{error}</p>}<Button disabled={phase === 'redeeming'} onClick={() => void redeem()}>{phase === 'redeeming' ? 'MEMPROSES…' : redeemId.current ? 'PERIKSA PENUKARAN' : 'KONFIRMASI PENUKARAN'}</Button>{canClose && <Button variant="outline" onClick={() => setPhase('ready')}>BATAL</Button>}</>}
      </DialogContent>
    </Dialog>
  </main>;
}
