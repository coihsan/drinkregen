import { useId, useState, type CSSProperties } from "react";
import { ArrowDownRight, Pause, Play, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/src/styles/scroll-text-v2.css";

interface ScrollTextV2Props {
  className?: string;
  duration?: number;
}

const messages = ["MINUMAN VITAMIN", "BEBAS GULA", "VITAMIN C & B"];

export default function ScrollTextV2({ className, duration = 32 }: ScrollTextV2Props) {
  const [paused, setPaused] = useState(false);
  const headingId = useId();
  const loopDuration = Number.isFinite(duration) ? Math.max(10, duration) : 32;

  return (
    <section
      className={cn("scroll-text-v2", className)}
      aria-labelledby={headingId}
      data-paused={paused}
      style={{ "--stv2-duration": `${loopDuration}s` } as CSSProperties}
    >
      <header className="scroll-text-v2__header">
        <div>
          <p className="scroll-text-v2__eyebrow"><Sparkles size={15} aria-hidden="true" /> KENALI REGEN</p>
          <h2 id={headingId}>Segarnya dapet<br /><span>Gulanya lewat</span></h2>
        </div>
        <div className="scroll-text-v2__aside">
          <p>Kesegaran yang pas<br />buat setiap jedamu.</p>
          <ArrowDownRight size={36} strokeWidth={1.5} aria-hidden="true" />
        </div>
      </header>

      <ul className="sr-only">{messages.map(message => <li key={message}>{message}</li>)}</ul>
      <div className="scroll-text-v2__bands" aria-hidden="true">
        {[false, true].map((reverse) => (
          <div className={cn("scroll-text-v2__lane", reverse && "scroll-text-v2__lane--reverse")} key={String(reverse)}>
            <div className="scroll-text-v2__track">
              {[0, 1].map(copy => (
                <div className="scroll-text-v2__group" key={copy}>
                  {(reverse ? [...messages].reverse() : messages).map(message => (
                    <span className="scroll-text-v2__phrase" key={message}>
                      {message}<Sparkles className="scroll-text-v2__spark" strokeWidth={1.5} />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="scroll-text-v2__footer">
        <span className="scroll-text-v2__signature"><span aria-hidden="true" /> BUKA REGEN. LANJUT LAGI.</span>
        <button
          className="scroll-text-v2__pause"
          type="button"
          onClick={() => setPaused(value => !value)}
          aria-label={paused ? "Putar animasi teks" : "Jeda animasi teks"}
        >
          {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
          {paused ? "Putar" : "Jeda"}
        </button>
      </footer>
    </section>
  );
}
