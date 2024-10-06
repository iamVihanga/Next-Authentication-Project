"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/actions/login";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { CardWrapper } from "@/components/auth/card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema, type LoginSchemaT } from "@/schemas/index";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/global/form-error";
import { FormSuccess } from "@/components/global/form-success";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [twoFactorView, setTwoFactorView] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const form = useForm<LoginSchemaT>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Account already used by different provider"
      : "";

  const onSubmit = (values: LoginSchemaT) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setTwoFactorView(true);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account ?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {twoFactorView && (
              // Two Factor View
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        autoFocus
                        maxLength={6}
                        {...field}
                        disabled={isPending}
                      >
                        <InputOTPGroup
                          className={cn(
                            "flex w-full items-center justify-center"
                          )}
                        >
                          <InputOTPSlot index={0} className={cn("w-16 h-12")} />
                          <InputOTPSlot index={1} className={cn("w-16 h-12")} />
                          <InputOTPSlot index={2} className={cn("w-16 h-12")} />
                          <InputOTPSlot index={3} className={cn("w-16 h-12")} />
                          <InputOTPSlot index={4} className={cn("w-16 h-12")} />
                          <InputOTPSlot index={5} className={cn("w-16 h-12")} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!twoFactorView && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          disabled={isPending}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="******"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button
                        asChild
                        size={"sm"}
                        variant={"link"}
                        className="px-0 font-normal"
                      >
                        <Link href={"/auth/reset"}>Forgot Password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {twoFactorView ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
