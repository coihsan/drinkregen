"use client";

import LoginForm from "@/components/login-form";
import { useTheme } from "next-themes";
import Image from "next/image";

const SignInPage = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const height = 40;
  const width = 200;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div>
            {isDark ? (
              <Image
                src={"/regen-logo.webp"}
                width={width}
                height={height}
                alt="logo regen"
              />
            ) : (
              <Image
                src={"/regen-dark.webp"}
                width={width}
                height={height}
                alt="logo regen"
              />
            )}
          </div>
        </a>
        <LoginForm />
      </div>
    </div>
  );
};
export default SignInPage;
