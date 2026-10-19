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
import RegistrationDialog from "./RegistrationDialog";
import { spinButtonClasses } from "./spin.styles";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  async function redeem() {
    if (busy.current || !chosen) return;
    const parsed=recipientSchema.safeParse(recipient);if(!parsed.success){setError('Lengkapi data penerima. Nomor HP harus 8–15 digit, alamat minimal 10 karakter, dan kode POS 5 digit.');return;}
    busy.current = true;
    revision.current++;
    setError("");
    setPhase("redeeming");
    redeemId.current ??= crypto.randomUUID();
    try {
      const next = await service.redeem(chosen, redeemId.current,parsed.data);
      setStatus(next);
      setRedemption(next);
      redeemId.current = null;
      setPhase("redeemed");
    } catch (cause) {
      if (cause instanceof SpinApiError && cause.definitive)
        redeemId.current = null;
      setError(
        cause instanceof SpinApiError && cause.definitive ? cause.message : "Penukaran belum terkonfirmasi. Coba lagi untuk memeriksa permintaan yang sama.",
      );
      setPhase("confirm");
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
      className="relative isolate overflow-clip bg-(--regen-paper) px-5 pt-[132px] pb-[72px] font-sans text-(--regen-ink) max-[700px]:pt-28 [&_button]:touch-manipulation"
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
        {status && (
          <div
            className="mb-7 rounded-3xl border-2 border-(--regen-ink) bg-(--regen-paper) p-5 text-left shadow-[4px_4px_0_var(--regen-lime)]"
            aria-live="polite"
          >
            <p className="break-words text-center text-xl font-bold mt-5">
              {status.user
                ? `Halo, ${status.user.name}!`
                : "Selamat datang! Coba 1 spin gratis."}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center bg-(--regen-yellow) rounded-2xl p-3">
                <p className="text-xs uppercase tracking-wider">Saldo poin</p>
                <strong className="text-4xl">
                  {status.points}
                  <span className="ml-2 text-sm">poin</span>
                </strong>
              </div>
              <div className="flex flex-col items-center bg-(--regen-green) rounded-2xl p-3">
                <p className="text-xs uppercase tracking-wider">Kesempatan</p>
                <strong className="text-4xl">
                  {status.remainingSpins}
                  <span className="ml-2 text-sm">spin</span>
                </strong>
              </div>
            </div>
          </div>
        )}
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
            <div className="rounded-2xl border border-(--regen-border) bg-(--regen-paper) px-6 py-4 text-center">
              <p className="text-sm">5 spin tersedia kembali dalam</p>
              <p role="timer" aria-label="Waktu hingga kuota spin tersedia kembali" className="my-2 font-mono text-3xl font-bold tabular-nums">{countdown}</p>
              <p className="text-xs" role="status">{secondsLeft > 0 ? "Kuota direset 24 jam setelah spin terakhir. Poin Anda tetap tersimpan." : "Memeriksa kuota spin…"}</p>
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
        <section className="mt-10 text-left" aria-labelledby="redeem-title">
          <h2
            id="redeem-title"
            className="font-[family-name:var(--font-headoh)] text-2xl"
          >
            Grand Prize
          </h2>
          <p className="mt-2 text-sm">
            Pilih hadiah yang Anda inginkan. Sisa poin tetap tersimpan setelah
            penukaran.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {options.map((option) => (
              <article
                key={option.id}
                className="flex flex-col rounded-2xl border-2 border-(--regen-ink) bg-(--regen-paper) p-3 sm:p-5"
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
                  {option.stockRemaining !== null && (
                    <p className="mt-2 text-xs">{option.stockRemaining === 0 ? "Stok habis" : `Tersedia ${option.stockRemaining} hadiah`}</p>
                  )}
                  <p className="mt-2 mb-4 text-xs">
                    {!status?.registered
                      ? "Masuk untuk menukar poin."
                      : status.points < option.cost
                        ? `Butuh ${option.cost - status.points} poin lagi`
                        : "Poin Anda cukup!"}
                  </p>
                </div>
                <Button
                  className="mt-auto h-auto min-h-11 whitespace-normal bg-(--regen-ink) px-2 py-2 text-xs text-(--regen-paper)"
                  disabled={
                    phase !== "ready" ||
                    !status?.registered ||
                    status.points < option.cost ||
                    option.stockRemaining === 0 ||
                    !!requestId.current
                  }
                  onClick={() => {
                    setChosen(option.id);
                    setError("");
                    setPhase("confirm");
                  }}
                >
                  {option.stockRemaining === 0
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
          {FAQGame.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-(--regen-border) py-4"
            >
              <AccordionTrigger className="cursor-pointer font-bold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="mt-2 text-sm leading-relaxed">
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
          className="max-h-[90dvh] overflow-y-auto bg-(--regen-paper) text-center text-(--regen-ink)"
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
                <DialogTitle>Tukar {selected.name}?</DialogTitle>
                <DialogDescription>
                  {selected.cost} poin akan dipotong setelah penukaran berhasil.
                  Sisa saldo saat ini setelah penukaran:{" "}
                  {Math.max(0, (status?.points ?? 0) - selected.cost)} poin.
                </DialogDescription>
                <fieldset disabled={phase==='redeeming'||!!redeemId.current} className="grid max-h-[45vh] gap-3 overflow-y-auto sm:grid-cols-2">{([['recipientName','Nama penerima'],['phone','Nomor Handphone'],['province','Provinsi'],['city','Kota'],['district','Kecamatan'],['address','Alamat lengkap'],['postalCode','Kode POS']] as const).map(([key,label])=><label key={key} className={key==='address'?'sm:col-span-2':''}><span className="text-sm">{label}</span>{key==='address'?<textarea className="block w-full rounded border p-2" value={recipient[key]} onChange={e=>setRecipient({...recipient,[key]:e.target.value})} maxLength={2000}/>:<input className="block w-full rounded border p-2" type={key==='phone'?'tel':'text'} inputMode={key==='postalCode'?'numeric':undefined} maxLength={key==='postalCode'?5:key==='phone'?16:191} value={recipient[key]} onChange={e=>setRecipient({...recipient,[key]:e.target.value})}/>}</label>)}</fieldset>
                {error && (
                  <p role="alert" className="text-sm text-(--regen-red-dark)">
                    {error}
                  </p>
                )}
                <Button
                  disabled={phase === "redeeming"}
                  onClick={() => void redeem()}
                >
                  {phase === "redeeming"
                    ? "MEMPROSES…"
                    : redeemId.current
                      ? "PERIKSA PENUKARAN"
                      : "KONFIRMASI PENUKARAN"}
                </Button>
                {canClose && (
                  <Button variant="outline" onClick={() => setPhase("ready")}>
                    BATAL
                  </Button>
                )}
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
