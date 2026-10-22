import { useEffect, useState } from "react";
import { History, Ticket, Gift, Truck, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type {
  SpinService,
  PrizeHistory as HistoryData,
  HistoryKind,
} from "../../services/spin.types";

const labels = {
  PENDING: "Menunggu diproses",
  VERIFIED: "Diproses",
  CLAIMED: "Berhasil diklaim",
  REJECTED: "Ditolak",
  EXPIRED: "Kedaluwarsa",
};
function date(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Jakarta",
      }).format(new Date(value)) + " WIB"
    : "Tanggal tidak tercatat";
}

function CopyVoucherButton({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">(
    "idle",
  );

  useEffect(() => {
    if (status !== "copied") return;
    const timeout = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [status]);

  async function copy() {
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-2 space-y-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-lg border-(--regen-ink) bg-transparent"
        disabled={status === "copying"}
        onClick={() => void copy()}
        aria-label={`Salin kode voucher ${code}`}
      >
        {status === "copied" ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {status === "copied" ? "Tersalin" : "Salin kode"}
      </Button>
      <span
        role="status"
        className={status === "error" ? "block text-xs" : "sr-only"}
      >
        {status === "copied"
          ? "Kode voucher berhasil disalin."
          : status === "error"
            ? "Gagal menyalin. Silakan salin kode secara manual."
            : ""}
      </span>
    </div>
  );
}

function HistoryPage({
  service,
  kind,
  page,
  onPage,
}: {
  service: SpinService;
  kind: HistoryKind;
  page: number;
  onPage: (page: number) => void;
}) {
  const [data, setData] = useState<HistoryData | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    service
      .getHistory(kind, page)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error
              ? cause.message
              : "Riwayat belum dapat dimuat. Silakan coba lagi.",
          );
      });
    return () => {
      active = false;
    };
  }, [service, kind, page, attempt]);
  if (error)
    return (
      <div className="space-y-3 py-6">
        <p role="alert" className="text-sm">
          {error}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setError("");
            setAttempt((value) => value + 1);
          }}
        >
          Coba lagi
        </Button>
      </div>
    );
  if (!data)
    return (
      <p role="status" className="py-8 text-center text-sm">
        Memuat riwayat hadiah…
      </p>
    );
  return (
    <div className="space-y-4">
      {!data.items.length && (
        <p className="rounded-2xl border border-(--regen-border) p-6 text-center text-sm">
          {kind === "SPIN"
            ? "Belum ada hadiah spin di riwayat ini."
            : "Belum ada penukaran Grand Prize di riwayat ini."}
        </p>
      )}
      <ul className="space-y-3">
        {data.items.map((item) => (
          <li
            key={item.id}
            className="space-y-3 rounded-2xl border-2 border-(--regen-ink) bg-(--regen-paper) p-4"
          >
            <div className="flex items-start gap-3">
              {item.voucherCode ? (
                <Ticket className="mt-1 size-5 shrink-0" aria-hidden="true" />
              ) : (
                <Gift className="mt-1 size-5 shrink-0" aria-hidden="true" />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="break-words font-bold">{item.name}</h3>
                <p className="mt-1 text-xs opacity-75">
                  {date(item.awardedAt)}
                </p>
              </div>
            </div>
            <span className="inline-block rounded-full bg-(--regen-yellow) px-3 py-1 text-xs font-semibold">
              {item.kind === "SPIN" ? "Hadiah diterima" : labels[item.status]}
            </span>
            {item.voucherCode && (
              <div className="rounded-xl border border-dashed border-(--regen-ink) p-3">
                <p className="text-xs font-semibold">Kode voucher</p>
                <p className="mt-1 select-all break-all font-mono text-lg font-bold">
                  {item.voucherCode}
                </p>
                <CopyVoucherButton code={item.voucherCode} />
                {item.expiresAt && (
                  <p className="mt-2 text-xs">
                    {Date.parse(item.expiresAt) <= Date.now()
                      ? "Kedaluwarsa sejak"
                      : "Berlaku sampai"}{" "}
                    {date(item.expiresAt)}
                  </p>
                )}
              </div>
            )}
            {item.trackingNumber && (
              <div className="rounded-xl bg-(--regen-green) p-3">
                <p className="flex items-center gap-2 text-xs font-semibold">
                  <Truck className="size-4" aria-hidden="true" />
                  Nomor resi
                </p>
                <p className="mt-1 select-all break-all font-mono font-bold">
                  <span>JNE</span> {item.trackingNumber}
                </p>
              </div>
            )}
            {item.kind === "GRAND_PRIZE" && item.status === "PENDING" && (
              <p className="text-xs">
                Penukaran Anda sudah tercatat dan menunggu diproses.
              </p>
            )}
            {item.kind === "GRAND_PRIZE" && item.claimedAt && (
              <p className="text-xs">
                Berhasil diklaim pada {date(item.claimedAt)}
              </p>
            )}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
        >
          Sebelumnya
        </Button>
        <span className="text-xs">Halaman {page}</span>
        <Button
          variant="outline"
          disabled={!data.hasMore}
          onClick={() => onPage(page + 1)}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  );
}

export default function PrizeHistory({
  service,
  disabled,
  registered,
}: {
  service: SpinService;
  disabled: boolean;
  registered: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<HistoryKind>("SPIN");
  const [page, setPage] = useState(1);
  return (
    <>
      <Button
        variant="outline"
        className="mt-4 w-full rounded-xl-400 border-lime-400 bg-lime-200 font-bold"
        disabled={disabled}
        onClick={() => {
          setKind("SPIN");
          setPage(1);
          setOpen(true);
        }}
      >
        <History className="size-4" aria-hidden="true" />
        Riwayat Hadiah
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85dvh] no-scrollbar overflow-y-auto px-4 rounded-3xl border-2 border-(--regen-ink) bg-(--regen-paper) text-(--regen-ink) sm:max-w-lg">
          <DialogTitle className="text-2xl font-bold">Riwayat Spin</DialogTitle>
          <DialogDescription className="sr-only">
            Daftar hadiah spin dan penukaran Grand Prize Anda.
          </DialogDescription>
          {!registered && (
            <p className="text-xs">
              Riwayat tamu hanya tersedia pada sesi browser ini.
            </p>
          )}
          <div
            className="grid grid-cols-2 gap-2"
            role="group"
            aria-label="Jenis riwayat hadiah"
          >
            {(["SPIN", "GRAND_PRIZE"] as const).map((value) => (
              <Button
                key={value}
                aria-pressed={kind === value}
                variant={kind === value ? "default" : "outline"}
                className={
                  kind === value ? "bg-(--regen-ink) text-(--regen-paper)" : ""
                }
                onClick={() => {
                  setKind(value);
                  setPage(1);
                }}
              >
                {value === "SPIN" ? "Hadiah Spin" : "Grand Prize"}
              </Button>
            ))}
          </div>
          {open && (
            <HistoryPage
              key={`${kind}-${page}`}
              service={service}
              kind={kind}
              page={page}
              onPage={setPage}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
