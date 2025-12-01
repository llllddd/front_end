"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Alert } from "@heroui/alert";

import { useAuth } from "@/auth/auth-context";
import strings from "@/components/strings";
import createProfile from "@/utils/create-profile";
import { requestToken, resetEmail } from "@/utils/api/auth";

export default function VerifyPage() {
  const router = useRouter();
  const { setLogin } = useAuth();

  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendLink() {
    try {
      await requestToken();
      setSent(true);
      setError(null);
    } catch (err: any) {
      setError(strings.errorTryAgain);
    }
  }

  async function reset() {
    try {
      await resetEmail();
      setLogin(createProfile(false));
      router.push("/auth/signin");
    } catch (err: any) {
      setError(strings.errorTryAgain);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <Card shadow="sm">
        <CardBody className="space-y-6">

          <h1 className="text-2xl font-semibold">{strings.pleaseVerifyEmail}</h1>

          <p>{strings.mustVerify}</p>

          <p className="text-default-600">
            {sent ? strings.linkSent : strings.notReceive}
          </p>

          {error && (
            <Alert color="danger" variant="flat" title={error} />
          )}

          {/* 按钮区 */}
          <div className="flex flex-wrap gap-3 pt-4">
            {/* 回首页 */}
            <Button
              color="primary"
              variant="solid"
              onPress={() => router.push("/")}
            >
              {strings.buttonHome}
            </Button>

            {/* 发送新的验证邮件 */}
            {!sent && (
              <Button
                color="secondary"
                variant="solid"
                onPress={sendLink}
              >
                {strings.sendLink}
              </Button>
            )}

            {/* 重设邮箱 */}
            <Button
              color="default"
              variant="bordered"
              onPress={reset}
            >
              {strings.buttonResetEmail}
            </Button>
          </div>

        </CardBody>
      </Card>
    </main>
  );
}
