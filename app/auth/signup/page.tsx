"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";


import strings from "@/components/strings";
import { addEmailToProfile } from "@/utils/api/auth";

export default function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(false);
    setSubmitting(true);

    try {
      await addEmailToProfile(email);
      router.push("/auth/success");
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg p-6">
      <Card shadow="sm">
        <CardBody className="space-y-6">

          <h1 className="text-xl font-semibold">{strings.welcome}</h1>

          <p className="font-medium flex items-center gap-2">
            {strings.orcidSuccess}
            <img
              src="/ORCIDiD_iconvector.svg"
              alt="ORCID"
              className="h-7 inline-block"
            />
          </p>

          <p className="text-default-600">{strings.pleaseRegister}</p>

          {/* Email input */}
          <Input
            isRequired
            type="email"
            label={strings.labelEmail}
            placeholder="your@email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={60}
          />

          <p className="text-default-600">{strings.emailVerify}</p>

          {error && (
            <p className="text-red-600 text-sm">{strings.errorRegister}</p>
          )}

          <div className="flex justify-end pt-2">
            <Button
              color="primary"
              type="button"
              size="lg"
              onClick={handleSubmit}
              isLoading={submitting}
            >
              {strings.buttonRegister}
            </Button>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
