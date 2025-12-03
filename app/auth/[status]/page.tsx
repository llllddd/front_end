"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

import { useAuth } from "@/auth/auth-context";
import SignUp from "@/app/auth/signup/page";
import strings from "@/components/strings";
import LoginButton from "@/components/login-button";
import createProfile from "@/utils/create-profile";
import InfoPopover from "@/components/components/InfoPopover";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SignInPage() {
  const params = useParams();
  const router = useRouter();

  const status = params?.status as string | undefined;
  const { login, setLogin, authCompleted } = useAuth();

  // Handle ORCID success callback
  useEffect(() => {
    if (status === "success") {
      setLogin(createProfile(true));
      router.push("/submit");
    }
  }, [status, router]);

  // Already authenticated? Only allow signup page
  // Avoid redirecting too early — wait for the initial auth check to complete.
  useEffect(() => {
    if (authCompleted && login.authenticated && status !== "signup") {
      router.replace("/");
    }
  }, [authCompleted, login.authenticated, status, router]);

  // Don't render if already authenticated (unless on signup page)
  if (authCompleted && login.authenticated && status !== "signup") {
    return null;
  }

  // Render signup page (email registration)
  if (status === "signup") {
    return <SignUp />;
  }

  // Render ORCID sign-in flow
  return (
    <main className="mx-auto max-w-xl p-6 text-center space-y-6">
      {status === "error" && (
        <p className="text-red-600 font-medium">{strings.errorSignIn}</p>
      )}

      <Card shadow="sm">
        <CardBody className="space-y-6 p-6">

          <h1 className="text-2xl font-semibold">{strings.orcidSignIn}</h1>

          <p className="text-default-600">{strings.signInInfo}</p>

          {/* ORCID Login button: client-side redirect using LoginButton */}
          <LoginButton>
            <img
              src="/ORCIDiD_iconvector.svg"
              alt="ORCID"
              className="w-6 h-6 mr-2"
            />
            {strings.buttonOrcid}
          </LoginButton>

          {/* Info text */}
          <div className="text-sm text-default-600 space-y-2">
            <div className="flex justify-center gap-2 items-center">
              <InfoPopover content={strings.orcidInfo} />
              <span>{strings.orcidRegister}</span>
            </div>

            <a
              href={strings.urlOrcidReg}
              target="_blank"
              className="text-primary underline inline-flex items-center justify-center"
            >
              {strings.registerNow}
            </a>
          </div>

        </CardBody>
      </Card>
    </main>
  );
}
