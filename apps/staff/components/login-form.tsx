"use client";

import { useRouter } from "next/navigation";
import { LoginSchema } from "@/lib/schema/login.schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,pn
} from "@workspace/ui/components/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { signIn } from "@/lib/auth-client";
import { Spinner } from "@workspace/ui/components/spinner";
import { ERROR_MESSAGES } from "@/lib/constant";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type LoginFormValues = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    const res = await signIn.email({
      email: data.email,
      password: data.password,
    });
    if (res.error) {
      const code = res.error.code ?? "";
      setError(
        ERROR_MESSAGES[code] ?? res.error.message ?? "Terjadi kesalahan.",
      );
    } else {
      router.push("/info");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={isVisible ? "text" : "password"}
                        placeholder="enter your password"
                        required
                        className="pr-9"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        onClick={() => setIsVisible((prevState) => !prevState)}
                        className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                      >
                        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                        <span className="sr-only">
                          {isVisible ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                {error && (
                  <div className="py-2">
                    <p className="text-sm text-destructive text-center">
                      {error}
                    </p>
                  </div>
                )}
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? <Spinner /> : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
