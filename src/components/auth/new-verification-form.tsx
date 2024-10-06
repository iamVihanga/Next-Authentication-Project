"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { verify } from "@/actions/verify";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormSuccess } from "@/components/global/form-success";
import { FormError } from "@/components/global/form-error";

interface NewVerificationFormProps {}

export function NewVerificationForm({}: NewVerificationFormProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (error || success) return;

    if (!token) {
      setError("Token is missing!");
      return;
    }

    startTransition(() => {
      verify(token)
        .then((data) => {
          setSuccess(data.success);
          setError(data.error);
        })
        .catch((err) => {
          setError("Something went wrong !");
        });
    });
  }, [token, error, success]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center flex-col w-full justify-center">
        {isPending && (!error || !success) && <BeatLoader />}
        {!success && <FormError message={error} />}
        {!error && <FormSuccess message={success} />}
      </div>
    </CardWrapper>
  );
}
