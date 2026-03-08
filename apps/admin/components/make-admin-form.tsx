"use client";

import { useState, useTransition } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { toast } from "sonner";
import { makeAdmin } from "@/app/(auth)/staff-directory/_action/make-admin";

type Props = {
  userId: string;
  email?: string;
};

export default function MakeAdminForm({ userId, email }: Props) {
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await makeAdmin({ userId, password, accountEmail: email });
      startTransition(() => {
        toast.success("User promoted to admin and account created/updated.");
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to promote user.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Set password for login</label>
        <Input
          type="password"
          placeholder="Enter password (min 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending || password.length < 6}>
          {isPending ? "Processing..." : "Make Admin"}
        </Button>
      </div>
    </form>
  );
}
