"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getMetadataVersion, getLatestMetadataVersion, type MetadataDTO } from "@/utils/api/dataset";

export default function VersionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const metaDataId = Number(params.id);
  const version = Number(params.version);

  const [data, setData] = React.useState<MetadataDTO | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (!Number.isFinite(metaDataId) || !Number.isFinite(version)) {
          throw new Error("Invalid parameters");
        }
        const res = await getMetadataVersion(metaDataId, version);
        if (!cancelled) setData(res ?? null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load version");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [metaDataId, version]);

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Version Detail</h1>
        <div className="flex gap-2">
          <Link href={`/dataset/${encodeURIComponent(String(metaDataId))}`} className="rounded-md border px-3 py-2 text-sm">
            Back to dataset
          </Link>
          <Link href={`/dataset/list`} className="rounded-md border px-3 py-2 text-sm">
            Back to list
          </Link>
        </div>
      </header>

      {loading && <div className="text-sm text-gray-600">Loading…</div>}
      {error && (
        <div className="rounded-md border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && !data && (
        <div className="text-sm text-gray-600">No data found.</div>
      )}

      {data && (
        <section className="rounded-2xl bg-white/50 shadow-sm p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="MetaDataId" value={String(metaDataId)} />
            <Field label="Version" value={String(version)} />
            <Field label="Title" value={String(data.title ?? "—")} />
            <Field label="Status" value={String(data.status ?? "—")} />
            <Field label="Provider" value={String((data as any).providerId ?? "—")} />
            <Field label="Publisher" value={String((data as any).publisher ?? "—")} />
            <Field label="Metadata Hash" value={String(data.metadataHash ?? "—")} mono />
            <Field label="Updated At" value={String((data as any).updatedAt ?? "—")} />
            <Field label="Created At" value={String((data as any).createdAt ?? "—")} />
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Raw JSON</h2>
            <pre className="mt-2 max-h-96 overflow-auto rounded-md bg-gray-100 p-3 text-xs">
{JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </section>
      )}
    </main>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-gray-600">{label}</div>
      <div className={mono ? "rounded-md border bg-gray-50 p-2 font-mono text-xs" : "rounded-md border bg-gray-50 p-2 text-sm"}>{value}</div>
    </div>
  );
}
