// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gray-950">
        {/* Background image (replace with your asset or remote URL) */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/fw3-hero.jpg" // TODO: replace with your image
            alt="Forest canopy"
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/50 to-black/70" />
        </div>

        <div className="mx-auto max-w-6xl px-6 py-28 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Forest‑Web‑3.0
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-gray-200">
            Mobilising, harmonising and incentivising forest biodiversity & environmental data
            through Web 3.0 technology.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="https://www.forestweb3.com/"
              className="rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700"
            >
              The project
            </Link>
            <Link
              href="/dataset/list"
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
            >
              Explore data
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-6 py-16 grid gap-8 md:grid-cols-3">
        <Card title="Open & Findable">
          Standardised metadata and content hashes make datasets discoverable and verifiable.
        </Card>
        <Card title="Contributor‑centric">
          Data owners keep primary data off‑chain while recording proofs on‑chain.
        </Card>
        <Card title="ReFi‑aligned">
          Nature‑backed digital assets help fund long‑term forest stewardship.
        </Card>
      </section>

      {/* About / blurb */}
      <section className="mx-auto max-w-3xl px-6 pb-16 leading-7 text-gray-700">
        <h2 className="text-xl font-semibold mb-2">What is Forest‑Web‑3.0?</h2>
        <p>
          A data‑stewardship initiative that leverages decentralised ledgers to register
          standardised forest biodiversity and environmental datasets. Contributors control storage;
          the ledger stores metadata and tamper‑evident identifiers that unlock discovery,
          attribution and incentive mechanisms.
        </p>
      </section>

      {/* CTA strip */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">Ready to contribute a dataset?</h3>
          <div className="flex gap-3">
            <Link href="/dataset/new" className="rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white hover:bg-green-700">
              Register metadata
            </Link>
            <Link href="https://www.forestweb3.com/" className="rounded-xl border px-5 py-3 text-sm font-medium hover:bg-gray-100">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
        <nav className="flex flex-wrap items-center gap-3">
          <Link href="https://www.forestweb3.com/" className="hover:underline">The project</Link>
          <span className="text-gray-400">·</span>
          <Link href="/metadata/list" className="hover:underline">Our data</Link>
          <span className="text-gray-400">·</span>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
        <p className="text-gray-500">© {new Date().getFullYear()} Forest‑Web‑3.0</p>
      </footer>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
}

