"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { useRouter } from "next/navigation";

import strings from "@/components/strings";

export default function VerifiedPage() {
  const router = useRouter();

  return (
    <main className="mx-auto max-w-xl p-6">
      <Card shadow="sm">
        <CardBody className="space-y-6 text-center">

          <h1 className="text-2xl font-semibold">{strings.welcome}</h1>
          <p className="text-default-600">{strings.emailVerified}</p>

          <Button
            size="lg"
            color="primary"
            onPress={() => router.push("/auth/signin")}
            className="mt-4"
          >
            {strings.goSignIn}
          </Button>

        </CardBody>
      </Card>
    </main>
  );
}
