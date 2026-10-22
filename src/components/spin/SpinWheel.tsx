import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { defaultSpinRewards, type SpinResult } from "../../services/spin.types";
import { createSpinAudio } from "./spin-audio";
import { getSpinRewardImage } from "./spin-reward-images";

const spinDuration = 5600;
export default function SpinWheel({
  result,
  onComplete,
  onSpin,
  disabled,
  spinning,
  rewards,
}: {
  result: SpinResult | null;
  onComplete: () => void;
  onSpin: () => void;
  disabled: boolean;
  spinning: boolean;
  rewards?: { code: string; name: string; points: number; imageUrl?: string }[];
}) {
  const segments =
    (spinning ? result?.spinRewards : undefined) ??
    rewards ??
    defaultSpinRewards;
  const sectorAngle = segments.length ? 360 / segments.length : 360;
  const colors = [
    "--regen-electric",
    "--regen-yellow",
    "--regen-coral-soft",
    "--regen-forest",
    "--regen-lime",
  ];
  const background = segments.length
    ? "conic-gradient(" +
      segments
        .map(
          (_, index) =>
            "var(" +
            colors[index % colors.length] +
            ") " +
            index * sectorAngle +
            "deg " +
            ((index + 1) * sectorAngle - 0.5) +
            "deg, var(--regen-paper) " +
            ((index + 1) * sectorAngle - 0.5) +
            "deg " +
            (index + 1) * sectorAngle +
            "deg",
        )
        .join(",") +
      ")"
    : "var(--regen-paper)";
  const [rotation, setRotation] = useState(0);
  const lastId = useRef<string | null>(null);
  const pendingCompletion = useRef(false);
  const audio = useRef<ReturnType<typeof createSpinAudio> | null>(null);
  useEffect(
    () => () => {
      audio.current?.dispose();
      audio.current = null;
    },
    [],
  );
  const complete = useRef(onComplete);
  complete.current = onComplete;
  function finishSpin() {
    if (!pendingCompletion.current) return;
    pendingCompletion.current = false;
    audio.current?.stop();
    complete.current();
  }
  useEffect(() => {
    if (!result) return;
    pendingCompletion.current = true;
    if (lastId.current !== result.id) {
      lastId.current = result.id;
      // Keep the pointer safely inside the server-selected prize segment.
      const offset = (Math.random() - 0.5) * sectorAngle * 0.45;
      const target =
        (360 -
          (Math.max(
            0,
            segments.findIndex((segment) => segment.code === result.rewardType),
          ) *
            sectorAngle +
            sectorAngle / 2 +
            offset) +
          360) %
        360;
      const turns = 5 + Math.floor(Math.random() * 2);
      setRotation(
        (previous) =>
          previous + turns * 360 + ((target - (previous % 360) + 360) % 360),
      );
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduced) audio.current?.play(spinDuration);
    // Timer also completes when transitionend is unavailable (background tabs).
    const timer = window.setTimeout(
      finishSpin,
      reduced ? 50 : spinDuration + 150,
    );
    return () => {
      window.clearTimeout(timer);
      audio.current?.stop();
    };
  }, [result]);
  return (
    <div className="relative isolate w-full max-w-[410px] p-[13px] max-[380px]:p-2.5 before:absolute before:inset-0 before:-z-10 before:rounded-full before:border before:border-dashed before:border-(--regen-forest) before:opacity-25 before:content-[''] after:absolute after:-bottom-3 after:left-[16%] after:-z-10 after:h-[18px] after:w-[68%] after:rounded-full after:bg-(--regen-ink-a20) after:blur-[9px] after:content-['']">
      <Sparkles
        className="absolute top-[7%] left-0 z-2 size-6 -rotate-15 text-(--regen-forest)"
        aria-hidden="true"
      />
      <Sparkles
        className="absolute right-0 bottom-[6%] z-2 size-6 rotate-12 text-(--regen-coral)"
        aria-hidden="true"
      />
      <div
        className="relative aspect-square w-full rounded-full bg-(--regen-ink) shadow-[0_7px_0_var(--regen-green-dark),0_12px_0_var(--regen-border),0_20px_32px_var(--regen-ink-a20)] outline-2 outline-offset-3 outline-(--regen-ink)"
        role="group"
        aria-label={`Roda hadiah: ${segments.map((segment) => segment.name).join(", ")}`}
      >
        <svg
          className="absolute inset-0 size-full fill-(--regen-cream)"
          viewBox="0 0 400 400"
          aria-hidden="true"
        >
          {Array.from({ length: 32 }, (_, index) => {
            const angle = (index * Math.PI) / 16;
            return (
              <circle
                key={index}
                cx={200 + 188 * Math.sin(angle)}
                cy={200 - 188 * Math.cos(angle)}
                r={index % 4 === 0 ? 3.5 : 2}
              />
            );
          })}
        </svg>
        <span
          className="absolute -top-[15px] left-[calc(50%-21px)] z-2 h-[53px] w-[42px] bg-(--regen-ink) [clip-path:polygon(50%_100%,3%_25%,10%_8%,24%_0,76%_0,90%_8%,97%_25%)] after:absolute after:inset-[6px_7px_10px] after:bg-(--regen-coral) after:[clip-path:polygon(0_0,100%_0,50%_100%)] after:content-['']"
          aria-hidden="true"
        />
        <div
          className="absolute inset-[6%] rounded-full border-[3px] border-(--regen-paper) shadow-[inset_0_0_0_5px_#ffffff35] transition-transform ease-[cubic-bezier(.2,0,.12,1)] motion-reduce:transition-none"
          style={{
            background,
            transform: `rotate(${rotation}deg)`,
            transitionDuration: `${spinDuration}ms`,
          }}
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.propertyName === "transform"
            )
              finishSpin();
          }}
          aria-hidden="true"
        >
          <svg className="absolute inset-0 size-full" viewBox="0 0 400 400">
            {segments.map((segment, index) => {
              const label = segment.name.toUpperCase();
              const image = getSpinRewardImage(segment);
              return (
                <g
                  key={segment.code}
                  transform={`translate(200 200) rotate(${90 + sectorAngle / 2 + index * sectorAngle})`}
                  className={
                    index % colors.length === 3
                      ? "text-(--regen-cream)"
                      : "text-(--regen-ink)"
                  }
                >
                  {image ? <image href={image} x="-174" y="-46" width="98" height="92" preserveAspectRatio="xMidYMid meet" /> : <text
                    x="-125"
                    y="0"
                    fill="currentColor"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="font-[family-name:var(--font-russo)]"
                    fontSize={Math.max(
                      8,
                      Math.min(14, 110 / Math.max(segments.length, 5)),
                    )}
                    textLength={label.length > 15 ? 115 : undefined}
                    lengthAdjust="spacingAndGlyphs"
                  >
                    {label}
                  </text>}
                </g>
              );
            })}
          </svg>
        </div>
        <button
          type="button"
          onClick={() => {
            audio.current ??= createSpinAudio();
            audio.current.unlock();
            onSpin();
          }}
          disabled={disabled || segments.length === 0}
          aria-label={spinning ? "Roda sedang berputar" : "Klik Putar"}
          className="absolute inset-[38%] flex cursor-pointer flex-col items-center justify-center gap-1 rounded-full border-4 border-(--regen-ink) bg-(--regen-paper) p-2 shadow-[0_5px_0_#183b2b30] outline-3 outline-(--regen-paper) transition-colors enabled:hover:bg-(--regen-electric) focus-visible:ring-4 focus-visible:ring-(--regen-coral) disabled:cursor-default disabled:opacity-75"
        >
          <span className="text-center text-[12px] leading-tight font-black sm:text-base">
            {spinning ? (
              "Memutar…"
            ) : (
              <>
                Klik
                <br />
                Putar
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
