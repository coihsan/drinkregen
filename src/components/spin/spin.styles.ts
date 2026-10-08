import { cn } from '@/lib/utils';

// Complete, static Tailwind classes so the scanner can discover every variant.
const buttonBase = 'h-auto min-h-14 w-full cursor-pointer rounded-(--regen-button-radius) px-5 py-[15px] text-[15px] font-extrabold disabled:cursor-default disabled:opacity-55';
const dialogButton = cn(buttonBase, 'bg-(--regen-ink) text-(--regen-paper) hover:bg-(--regen-green-dark)');

export const spinButtonClasses = {
  dialog: dialogButton,
  register: cn(dialogButton, 'mt-2.5'),
  play: cn(buttonBase, 'max-w-[352px] border-2 border-(--regen-ink) bg-(--regen-electric) text-(--regen-ink) tracking-[.06em] shadow-[0_5px_0_var(--regen-ink)] enabled:hover:bg-(--regen-yellow) enabled:hover:-translate-y-px enabled:active:translate-y-[3px] enabled:active:shadow-[0_2px_0_var(--regen-ink)]'),
};
