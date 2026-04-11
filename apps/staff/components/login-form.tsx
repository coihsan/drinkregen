"use client";

import { useRouter } from "next/navigation";
import { LoginSchema } from "@/lib/schema/login.schema"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { signIn } from "@/lib/auth-client";
import { Spinner } from "@workspace/ui/components/spinner";

type LoginFormValues = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
      password: data.password
    }); 
    if (res.error) {
      setError(res.error.message || "Something went wrong."); 
    } else {
      router.push("/staff"); 
    } 
  } 

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
              render={({ field }) => (
                <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...field}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {String(form.formState.errors.email?.message)}
                  </p>
                )}
              </Field>
              )}
              />
              <Controller
              control={form.control}
              name="password"
              render={({ field }) => (
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                  </div>
                  <Input id="password" placeholder="enter your password" type="password" required {...field} />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {String(form.formState.errors.password?.message)}
                    </p>
                  )}
                </Field>
              )}
            />
              <Field>
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? (
                    <Spinner />
                  ) :  "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
