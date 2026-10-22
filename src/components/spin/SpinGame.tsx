import {recipientSchema} from '../../services/spin-recipient.schema';
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { spinService, SpinApiError } from "../../services/spin.service";
import {
  type RegistrationInput,
  type SpinResult as Result,
  type SpinService,
  type SpinStatus,
  type RedemptionType,
  type RedemptionResult,
} from "../../services/spin.types";
import SpinWheel from "./SpinWheel";
import { getRedemptionImage } from "./redemption-images";
import SpinInvite from "./SpinInvite";
import SpinBackground from "./SpinBackground";
import SpinResult from "./SpinResult";
import PrizeHistory from "./PrizeHistory";
import ClaimRecipientForm from "./ClaimRecipientForm";
import RegistrationDialog from "./RegistrationDialog";
import { spinButtonClasses } from "./spin.styles";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SPINFAQ } from '@/lib/spin.faq';

const FAQGame = [
  {
    question: "Apa itu REGEN?",
    answer:
      "REGEN adalah program loyalitas yang memberikan hadiah berupa voucher dan poin kepada pelanggan setia.",
  },
  {
    question: "Bagaimana cara mendapatkan poin?",
    answer:
      "Anda bisa mendapatkan poin dengan melakukan spin dan memenangkan hadiah.",
  },
  {
    question: "Berapa banyak spin yang bisa dilakukan?",
    answer: "Anda mendapat 5 spin. Setelah kuota habis, 5 spin tersedia kembali dalam 24 jam dan tidak terakumulasi.",
  },
];

type Phase =
  | "loading"
  | "ready"
  | "requesting"
  | "spinning"
  | "result"
  | "registration"
  | "registering"
  | "confirm"
  | "redeeming"
  | "redeemed"
  | "error";
export default function SpinGame({
  service = spinService,
}: {
  service?: SpinService;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [status, setStatus] = useState<SpinStatus | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState("");
  const [chosen, setChosen] = useState<RedemptionType | null>(null);
  const [redemption, setRedemption] = useState<RedemptionResult | null>(null);
  const busy = useRef(false);
  const revision = useRef(0);
  const requestId = useRef<string | null>(null);
  const registerId = useRef<string | null>(null);
  const registrationInput = useRef<RegistrationInput | null>(null);
  const redeemId = useRef<string | null>(null);
  const primary = useRef<HTMLButtonElement>(null);
  const load = useCallback(async () => {
    if (busy.current) return;
    const current = ++revision.current;
    setError("");
    setPhase("loading");
    try {
      const next = await service.getStatus();
      if (current === revision.current) {
        setStatus(next);
        setError(
          next.available === false
            ? "Spin belum tersedia. Silakan kembali nanti."
            : "",
        );
        setPhase("ready");
      }
    } catch {
      if (current === revision.current) {
        setError("Layanan spin belum tersedia. Silakan coba lagi nanti.");
        setPhase("error");
      }
    }
  }, [service]);
  useEffect(() => {
    void load();
  }, [load]);
  // Keep the countdown current; quota is always refreshed from the server.
  useEffect(() => {
    if (!status?.registered || status.remainingSpins !== 0) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [status?.registered, status?.remainingSpins, status?.dailyResetAt]);
  useEffect(() => {
    async function refresh() {
      if (
        document.visibilityState !== "visible" ||
        phase !== "ready" ||
        busy.current ||
        requestId.current
      )
        return;
      const current = ++revision.current;
      try {
        const next = await service.getStatus();
        if (current === revision.current && !busy.current) {
          setStatus(next);
          setError(
            next.available === false
              ? "Kampanye spin belum aktif. Silakan kembali nanti."
              : "",
          );
        }
      } catch {
        setError("Status belum diperbarui. Coba lagi saat koneksi tersedia.");
      }
    }
    const timer = window.setInterval(() => {
      if (
        status &&
        (status.available === false ||
          (status.registered && status.remainingSpins === 0 && Date.now() >= Date.parse(status.dailyResetAt)))
      )
        void refresh();
    }, 30000);
    const deadline = status?.registered && status.remainingSpins === 0 && status.available !== false
      ? Date.parse(status.dailyResetAt) - Date.now() : -1;
    const resetTimer = deadline > 0 ? window.setTimeout(() => void refresh(), Math.min(deadline + 50, 2147483647)) : undefined;
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      if (resetTimer !== undefined) window.clearTimeout(resetTimer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [phase, status, service]);
  async function spin() {
    if (busy.current || phase !== "ready" || !status?.remainingSpins) return;
    busy.current = true;
    revision.current++;
    setError("");
    setPhase("requesting");
    requestId.current ??= crypto.randomUUID();
    try {
      setResult(await service.spin(requestId.current));
      setPhase("spinning");
    } catch (cause) {
      if (cause instanceof SpinApiError && cause.definitive)
        requestId.current = null;
      setError(
        "Spin belum terkonfirmasi. Tekan spin untuk mencoba kembali permintaan yang sama.",
      );
      setPhase("ready");
      busy.current = false;
    }
  }
  function complete() {
    if (!result) return;
    setStatus(result);
    setPhase("result");
    busy.current = false;
    requestId.current = null;
  }
  async function register(input: RegistrationInput) {
    if (busy.current) return;
    busy.current = true;
    revision.current++;
    setError("");
    setPhase("registering");
    registerId.current ??= crypto.randomUUID();
    registrationInput.current ??= input;
    try {
      const next = await service.register(
        registrationInput.current,
        registerId.current,
      );
      setStatus(next);
      registerId.current = null;
      registrationInput.current = null;
      setPhase("ready");
    } catch (cause) {
      if (cause instanceof SpinApiError && cause.definitive) {
        registerId.current = null;
        registrationInput.current = null;
      }
      setError(
        cause instanceof Error
          ? cause.message
          : "Pendaftaran belum berhasil. Coba lagi.",
      );
      setPhase("registration");
    } finally {
      busy.current = false;
    }
  }
  const [recipient,setRecipient]=useState({recipientName:'',phone:'',province:'',city:'',district:'',address:'',postalCode:''});
  const [identityLoading, setIdentityLoading] = useState(false);
  const [identityReady, setIdentityReady] = useState(false);
  async function openClaim(rewardId: string) {
    if (busy.current || status?.grandPrizeClaimed) return;
    busy.current = true;
    revision.current++;
    setChosen(rewardId);
    setError('');
    setIdentityReady(false);
    setIdentityLoading(true);
    setPhase('confirm');
    try {
      const next = await service.getStatus();
      setStatus(next);
      if (next.grandPrizeClaimed) { setPhase('ready'); return; }
      if (!next.registered || !next.user?.whatsapp) throw new Error('Data peserta belum tersedia. Tutup dialog dan coba lagi.');
      setRecipient(value => ({ ...value, recipientName: next.user!.name, phone: next.user!.whatsapp! }));
      setIdentityReady(true);
    } catch {
      setError('Data peserta gagal dimuat. Tutup dialog lalu coba kembali.');
    } finally {
      busy.current = false;
      setIdentityLoading(false);
    }
  }
  async function redeem() {
    if (busy.current || !chosen || !identityReady || status?.grandPrizeClaimed) return;
    const parsed=recipientSchema.safeParse(recipient);if(!parsed.success){setError('Lengkapi alamat pengiriman. Alamat minimal 10 karakter dan kode pos harus 5 digit.');return;}
    busy.current = true;
    revision.current++;
    setError("");
    setPhase("redeeming");
    redeemId.current ??= crypto.randomUUID();
    try {
      const next = await service.redeem(chosen, redeemId.current,parsed.data);
      setStatus({ ...next, grandPrizeClaimed: true, claimedGrandPrizeCodes: next.claimedGrandPrizeCodes ?? [next.redemption.rewardId] });
      setRedemption(next);
      redeemId.current = null;
      setPhase("redeemed");
    } catch (cause) {
      if (cause instanceof SpinApiError && cause.definitive)
        redeemId.current = null;
      setError(
        cause instanceof SpinApiError && cause.definitive ? cause.message : "Penukaran belum terkonfirmasi. Coba lagi untuk memeriksa permintaan yang sama.",
      );
      if (cause instanceof SpinApiError && cause.code === 'GRAND_PRIZE_LIMIT') {
        setStatus(current => current ? { ...current, grandPrizeClaimed: true } : current);
        setPhase("ready");
      } else setPhase("confirm");
    } finally {
      busy.current = false;
    }
  }
  const dialogOpen = [
    "result",
    "registration",
    "registering",
    "confirm",
    "redeeming",
    "redeemed",
  ].includes(phase);
  const spinning = phase === "spinning" || phase === "requesting";
  const secondsLeft = status ? Math.max(0, Math.ceil((Date.parse(status.dailyResetAt) - now) / 1000)) : 0;
  const countdown = [Math.floor(secondsLeft / 3600), Math.floor(secondsLeft / 60) % 60, secondsLeft % 60].map(value => String(value).padStart(2, "0")).join(":");
  const exhausted = status?.available !== false && status?.registered && status.remainingSpins === 0;
  const registerOffer =
    status &&
    status.available !== false &&
    !status.registered &&
    status.remainingSpins === 0;
  const options = (status?.redemptionOptions ?? []).map(
    (option) => ({
      ...option,
      image: getRedemptionImage(option),
      stockRemaining: "stockRemaining" in option ? option.stockRemaining : null,
    }),
  );
  const selected = options.find((option) => option.id === chosen);
  const canClose = !busy.current && !redeemId.current && !registerId.current;
  const canSpin =
    phase === "ready" &&
    status?.available !== false &&
    !!status?.remainingSpins && status.spinRewards?.length !== 0;
  return (
    <main
      className="relative isolate overflow-clip bg-(--regen-paper) px-5 pt-[32px] pb-[72px] font-sans text-(--regen-ink) [&_button]:touch-manipulation"
      lang="id"
    >
      <SpinBackground />
      <section
        className="mx-auto w-full max-w-[520px] text-center"
        aria-labelledby="spin-title"
      >
        <h1 id="spin-title">
          <img
            className="mx-auto -mb-6 h-auto w-[65%] max-w-[250px]"
            src="/spin/spin-the-wheel-logo.webp"
            alt="REGEN Spin & Win"
            width="1221"
            height="819"
            fetchPriority="high"
          />
        </h1>

        <div
          className="mb-7 grid justify-items-center gap-6"
          aria-busy={spinning}
        >
          <SpinWheel
            result={result}
            rewards={status?.spinRewards}
            onComplete={complete}
            onSpin={() => void spin()}
            disabled={!canSpin}
            spinning={spinning}
          />
          <Button
            ref={primary}
            className={spinButtonClasses.play}
            disabled={
              phase !== "ready" || !status || (!!exhausted && !registerOffer)
            }
            onClick={() =>
              registerOffer ? setPhase("registration") : void spin()
            }
          >
            {phase === "loading"
              ? "MENYIAPKAN SPIN…"
              : spinning
                ? "SEDANG BERPUTAR…"
                : registerOffer
                  ? "ISI DATA & DAPATKAN 5 SPIN"
                  : exhausted
                    ? "KUOTA SPIN HABIS"
                    : "SPIN SEKARANG"}
          </Button>
          {exhausted && (
            <div className="rounded-2xl border border-(--regen-border) bg-(--regen-paper) px-6 py-4 text-center shadow-xl border border-lime-300">
              <p className="text-sm font-semibold text-lime-600">5 spin tersedia kembali dalam</p>
              <div className='bg-gradient-to-r from-transparant via-lime-500 to-transparant'><p className="my-2 font-mono text-green-700 text-3xl font-black tabular-nums" role="timer" aria-label="Waktu hingga kuota spin tersedia kembali" >{countdown}</p></div>
              <p className="text-xs text-muted-foreground" role="status">{secondsLeft > 0 ? "Kuota direset 24 jam setelah spin terakhir. Poin Anda tetap tersimpan." : "Memeriksa kuota spin…"}</p>
            </div>
          )}
          {registerOffer && <SpinInvite />}
          {status &&
            !status.registered &&
            phase === "ready" &&
            !requestId.current && (
              <Button variant="link" onClick={() => setPhase("registration")}>
                Sudah punya akun? Masuk dengan WhatsApp
              </Button>
            )}
          {error && !dialogOpen && (
            <p role="alert" className="text-sm text-(--regen-red-dark)">
              {error}
            </p>
          )}
          {phase === "error" && (
            <Button variant="outline" onClick={() => void load()}>
              COBA MUAT ULANG
            </Button>
          )}
        </div>
        {status && (
          <div
            className="mb-7 rounded-3xl border-2 border-lime-50 bg-(--regen-paper) px-5 py-7 text-left shadow-xl"
            aria-live="polite"
          >
            <div className='mb-9'>
              <p className="break-words text-center text-xl font-black  text-green-700">
              {status.user
                ? `Halo, ${status.user.name}!`
                : "Selamat datang! Coba 1 spin gratis."}
            </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex flex-col h-20 relative shadow-md items-center border border-yellow-300 bg-(--regen-yellow) rounded-2xl p-3">
                <div className='absolute -top-2 left-0 bg-green-600 w-max px-2 flex justify-center rounded-full border border-lime-500 shadow-md'><p className="text-xs uppercase tracking-wider font-bold text-white">Saldo poin</p></div>
                <strong className="text-4xl absolute top-[30%] left-5 mx-auto">
                  <span className='font-black'>{status.points}</span>
                  <span className="ml-2 text-sm">poin</span>
                </strong>
                <img className='absolute right-4 scale-140' src='/spin/icon-coin.webp' width={50} height={50} alt='icon' />
              </div>
              <div className="flex flex-col h-20 relative shadow-md items-center border border-green-300 bg-(--regen-green) rounded-2xl p-3">
                <div className='absolute -top-2 left-0 bg-yellow-300 w-max px-2 flex justify-center rounded-full border border-green-600 shadow-md'><p className="text-xs uppercase tracking-wider font-bold text-green-600">Sisa spin</p></div>
                <strong className="text-4xl absolute top-[30%] left-5 mx-auto">
                  <span className='font-black'>{status.remainingSpins}</span>
                  <span className="ml-2 text-sm">spin</span>
                </strong>
                <img className='absolute right-4 top-4 scale-140' src='/spin/icon-repeat.webp' width={50} height={50} alt='icon' />
              </div>
            </div>
            <PrizeHistory key={status.user?.id || 'guest'} service={service} disabled={phase !== 'ready' || Boolean(requestId.current)} registered={status.registered} />
          </div>
        )}
        <section className="mt-10 text-left" aria-labelledby="redeem-title">
          <h2
            id="redeem-title"
            className="font-[family-name:var(--font-headoh)] text-4xl text-center mx-auto"
          >
            Grand Prize
          </h2>
          <p className="mt-2 text-sm text-center mx-auto">
            Pilih hadiah yang Anda inginkan. Sisa poin tetap tersimpan setelah
            penukaran.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {options.map((option) => (
              <article
                key={option.id}
                className="flex flex-col max-w-[352px] border-2 border-(--regen-ink) bg-(--regen-paper) text-(--regen-ink) tracking-[.06em] shadow-[0_5px_0_var(--regen-ink)] enabled:active:shadow-[0_2px_0_var(--regen-ink)] rounded-xl p-6"
              >
                <div className="mb-3 flex h-28 items-center justify-center">
                  {option.image ? <img
                    src={option.image}
                    alt={option.name}
                    className="h-28 w-full object-contain"
                    width="150"
                    height="112"
                    loading="lazy"
                  /> : <span className="text-4xl" role="img" aria-label="Hadiah">🎁</span>}
                </div>
                <div className="flex flex-col text-center">
                  <h3 className="font-bold">{option.name}</h3>
                  <p className="mt-1 text-xl font-black">{option.cost} poin</p>
                  {/* {option.stockRemaining !== null && (
                    <p className="mt-2 text-xs">{option.stockRemaining === 0 ? "Stok habis" : `Tersedia ${option.stockRemaining} hadiah`}</p>
                  )} */}
                  {/* <p className="mt-2 mb-4 text-xs">
                    {!status?.registered
                      ? "Masuk untuk menukar poin."
                      : status.points < option.cost
                        ? `Butuh ${option.cost - status.points} poin lagi`
                        : "Poin Anda cukup!"}
                  </p> */}
                </div>
                <Button
                  className="mt-3 h-auto min-h-11 whitespace-normal bg-(--regen-ink) px-2 py-2 text-xs text-(--regen-paper)"
                  disabled={
                    phase !== "ready" ||
                    !status?.registered ||
                    status.grandPrizeClaimed === true ||
                    status.points < option.cost ||
                    option.stockRemaining === 0 ||
                    !!requestId.current
                  }
                  onClick={() => void openClaim(option.id)}
                >
                  {status?.claimedGrandPrizeCodes?.includes(option.id)
                    ? "Sudah diklaim"
                    : option.stockRemaining === 0
                    ? "Stok habis"
                    : `Tukar ${option.name}`}
                </Button>
              </article>
            ))}
          </div>
          {phase === "loading" && !status && <p className="mt-5 text-sm" role="status">Memuat grand prize…</p>}
          {status && options.length === 0 && <p className="mt-5 text-sm">Belum ada grand prize yang tersedia. Cek kembali nanti.</p>}
        </section>
        <Accordion type="multiple" className="mt-10 w-full">
          {SPINFAQ.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-(--regen-border) py-4"
            >
              <AccordionTrigger className="cursor-pointer font-bold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="mt-2 text-start text-sm leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {/* <div className="mt-8 text-left [&_details]:border-b [&_details]:border-(--regen-border) [&_details]:py-4 [&_summary]:cursor-pointer [&_summary]:font-bold [&_p]:mt-2 [&_p]:text-sm [&_p]:leading-relaxed">
        <details><summary>Cara bermain</summary><p>Spin pertama memberi voucher Shopee atau poin. Daftarkan nomor WhatsApp untuk menyimpan saldo dan mendapatkan 5 spin tambahan tanpa OTP. Bonus satu kali per nomor. Kembali melalui browser yang sama; kuota kembali menjadi 5 spin 24 jam setelah habis dan tidak terakumulasi.</p></details>
        <details><summary>Hadiah dan penukaran</summary><p>Roda berisi Voucher Shopee 10%, Voucher Shopee 50%, +5 poin, +10 poin, dan Coba Lagi. Tukarkan 100 poin untuk 1 Karton REGEN atau 25 poin untuk 3 Botol REGEN. Poin hanya dipotong setelah penukaran berhasil. Sisa poin tetap tersimpan.</p></details>
        <details><summary>Ketentuan</summary><p>Hasil spin dan penukaran mengikuti ketersediaan serta ketentuan program. Kode dan masa berlaku voucher ditampilkan saat Anda mendapatkannya. Kuota spin berlaku per akun.</p></details>
      </div> */}
      </section>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open && canClose) {
            setPhase("ready");
            setError("");
          }
        }}
      >
        <DialogContent
          className={`max-h-[90dvh] no-scrollbar overflow-y-auto bg-(--regen-paper) text-center text-(--regen-ink) ${["confirm", "redeeming"].includes(phase) ? "sm:max-w-xl gap-5" : ""}`}
          showCloseButton={canClose}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            primary.current?.focus();
          }}
        >
          {phase === "result" && result ? (
            <SpinResult
              key={result.id}
              result={result}
              onContinue={() =>
                setPhase(result.registered ? "ready" : "registration")
              }
            />
          ) : ["registration", "registering"].includes(phase) ? (
            <RegistrationDialog
              pending={phase === "registering"}
              locked={!!registerId.current}
              error={error}
              onSubmit={(input) => void register(input)}
            />
          ) : phase === "redeemed" && redemption ? (
            <>
              <DialogTitle>Klaim Hadiah Berhasil.</DialogTitle>
              <DialogDescription>
                Tim kami akan menghubungi anda apabila penukaran hadiah telah diproses
              </DialogDescription>
              <p className="break-all text-xs">
                Nomor penukaran: {redemption.redemption.id}
              </p>
              <Button onClick={() => setPhase("ready")}>SELESAI</Button>
            </>
          ) : (
            selected && (
              <>
                <div className="pr-8 text-left">
                  <DialogTitle className="text-xl font-bold">Klaim hadiah penukaran</DialogTitle>
                  <DialogDescription className="mt-2 text-sm leading-relaxed">Lengkapi alamat pengiriman untuk menerima hadiah pilihan Anda.</DialogDescription>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-4 text-left">
                  {selected.image && <img src={selected.image} alt="" className="h-16 w-16 shrink-0 object-contain" />}
                  <div className="min-w-0 flex-1"><p className="font-semibold">{selected.name}</p><p className="mt-1 text-xs text-black/60">Sisa saldo setelah penukaran: {Math.max(0, (status?.points ?? 0) - selected.cost)} poin</p></div>
                  <span className="shrink-0 rounded-full bg-(--regen-lime) px-3 py-1.5 text-sm font-bold">{selected.cost} poin</span>
                </div>
                {identityLoading ? <p role="status" className="py-8 text-sm">Memuat data peserta…</p> : identityReady && <ClaimRecipientForm recipient={recipient} onChange={setRecipient} disabled={phase === 'redeeming' || !!redeemId.current} />}
                {error && (
                  <p role="alert" className="text-sm text-(--regen-red-dark)">
                    {error}
                  </p>
                )}
                <p className="text-left text-xs leading-relaxed text-black/60">Poin hanya dipotong setelah penukaran berhasil. Periksa kembali alamat sebelum konfirmasi.</p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {canClose && (
                  <Button variant="outline" onClick={() => setPhase("ready")}>
                    Batal
                  </Button>
                )}
                <Button
                  disabled={phase === "redeeming" || !identityReady || identityLoading || status?.grandPrizeClaimed === true}
                  onClick={() => void redeem()}
                >
                  {phase === "redeeming"
                    ? "MEMPROSES…"
                    : redeemId.current
                      ? "PERIKSA PENUKARAN"
                      : "KONFIRMASI PENUKARAN"}
                </Button>
                </div>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
