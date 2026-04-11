"use client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Copy, CopyCheck } from "lucide-react";
import { useState, useTransition } from "react";

interface InputCopyProps {
  value: string;
  className?: string;
}

const InputCopy = ({ value, className }: InputCopyProps) => {
  const [pending] = useTransition();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <Input className={`${className}, 'bg-white h-12'`} type="text" value={value} readOnly />
      <Button variant={'ghost'} size={'icon'} onClick={handleCopy} disabled={pending}>
        {copied ? <CopyCheck className="text-green-600" /> : <Copy />}
      </Button>
    </div>
  );
};
export default InputCopy;
