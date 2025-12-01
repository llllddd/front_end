// app/the-project/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function TheProjectPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-10">
      {/* Header */}
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Forest-Web-3.0 — The Project</h1>
        <p className="text-gray-600">
          Mobilising, harmonising and incentivising forest biodiversity and environmental monitoring
          data through Web 3.0 technology
        </p>
      </header>

      {/* Intro */}
      <section className="space-y-4 leading-7">
        <p>
          Decentralised ledgers (blockchain) sit at the core of Web 3.0, the next evolution of the
          web. Beyond DeFi, Web 3.0 also powers <em>Regenerative Finance (ReFi)</em>, aiming to
          support communities and natural ecosystems. <strong>Forest-Web-3.0</strong> focuses on the
          forest biome and pioneers data-driven solutions for stewarding forest biodiversity
          monitoring in the 21st century.
        </p>
        <p>
          The project pursues two complementary objectives: (1) catalyse a shift among academics
          towards <em>data stewardship</em> by leveraging Web 3.0 to mobilise existing forest
          biodiversity and environmental data; and (2) coordinate knowledge creation around
          regenerative-finance revenue across a trans-national network of forest landowners. By
          creating nature-backed digital assets, we aim to evidence the economic value of
          proforestation and align ecological goals with innovative digital infrastructures.
        </p>
      </section>

      {/* Conceptual framework image (replace src with your asset/CDN path) */}
      <figure className="rounded-2xl overflow-hidden border bg-white shadow-sm">
        <div className="relative w-full aspect-[16/9]">
          <Image
            src="/images/fw3-concept.png" // TODO: replace with the actual image path
            alt="Conceptual framework of a blockchain-enabled ecological data network"
            fill
            className="object-cover"
            priority
          />
        </div>
        <figcaption className="p-4 text-sm text-gray-600">
          A conceptual framework (after Lewis et al. 2023) for a blockchain-enabled ecological data
          network. End users discover data via an open UI; contributors register datasets; smart
          contracts immutably record standardised metadata and a content hash (permanent identifier);
          off-chain primary data stays with contributors; participating servers form the distributed
          network and maintain a synchronised copy of the ledger.
        </figcaption>
      </figure>

      {/* Explainer list */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">How it works (at a glance)</h2>
        <ul className="list-disc pl-6 space-y-2 leading-7">
          <li>
            <strong>Open discovery:</strong> A public UI lets anyone search standardised metadata,
            smart-contract records and reuse statistics.
          </li>
          <li>
            <strong>Contributor control:</strong> Data owners register datasets; smart contracts
            record metadata + a unique hash/identifier on-chain.
          </li>
          <li>
            <strong>Off-chain storage:</strong> Primary data remains on contributor-controlled
            servers; the blockchain stores proofs and references.
          </li>
          <li>
            <strong>Distributed ledger:</strong> Nodes maintain an up-to-date copy of the
            data-ledger to ensure transparency and auditability.
          </li>
          <li>
            <strong>Regenerative finance:</strong> Nature-backed digital assets help align economic
            incentives with proforestation outcomes.
          </li>
        </ul>
      </section>

      {/* Callout */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm leading-7">
        <h2 className="text-lg font-semibold mb-2">Forests, gone digital</h2>
        <p>
          Forest-Web-3.0 charts a path towards real-time ecosystem intelligence where biodiversity
          data is <em>findable and accessible</em>, data/land owners are credited and rewarded, and
          stewardship is transparently evidenced at scale.
        </p>
      </section>

      {/* Footer links (optional) */}
      {/* <nav className="flex flex-wrap gap-3 text-sm text-blue-700">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span>·</span>
        <Link href="/the-project" className="hover:underline">
          The project
        </Link>
        <span>·</span>
        <Link href="/the-team" className="hover:underline">
          The team
        </Link>
        <span>·</span>
        <Link href="/our-data" className="hover:underline">
          Our data
        </Link>
        <span>·</span>
        <Link href="/news" className="hover:underline">
          News
        </Link>
        <span>·</span>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
      </nav> */}

      <p className="text-center text-xs text-gray-500">© {new Date().getFullYear()} Forest-Web-3.0</p>
    </main>
  );
}
