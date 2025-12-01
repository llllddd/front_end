"use client";

import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";

import strings from "@/components/strings";

export default function TokenExpiredPage() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <Card shadow="sm">
        <CardBody className="space-y-4">

          <h1 className="text-2xl font-semibold">{strings.linkExpired}</h1>

          <p className="text-default-700 leading-relaxed">
            <Link href="/submit" color="primary" underline="hover">
              {strings.linkSignIn}
            </Link>
            {strings.infoLinkExpired}
          </p>

        </CardBody>
      </Card>
    </main>
  );
}
