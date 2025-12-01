"use client";

import React from "react";

export default function SuccessPage() {
  return (
    <main className="flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-4">🎉 Login Failed</h1>
      <p className="text-gray-600 mb-6">
        Failed to authenticate. Please try again.
      </p>

      <a
        href="/"
        className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-600 transition"
      >
        Go to Dashboard
      </a>
    </main>
  );
}
