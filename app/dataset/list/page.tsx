// app/metadata/list/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const LIST_ENDPOINT = "/dataset/listmetadata";

interface DatasetItem {
  metaDataId?: string;
  title?: string;
  publisher?: string;
  status?: string;
  providerId?: number;
  created_at?: string;
  contact?: string;
  [key: string]: any;
}

const PAGE_SIZE = 10;

export default function ListMetadataPage() {
  const [items, setItems] = React.useState<DatasetItem[]>([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const offset = (page - 1) * PAGE_SIZE;

  const fetchPage = React.useCallback(async () => {
    if (!API_BASE) {
      setError("Missing NEXT_PUBLIC_API_BASE_URL");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE}${LIST_ENDPOINT}`);
      url.searchParams.set("limit", String(PAGE_SIZE));
      url.searchParams.set("offset", String(offset));
      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as DatasetItem[];
      setItems(data);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [offset]);

  React.useEffect(() => {
    void fetchPage();
  }, [fetchPage]);

  const hasNext = items.length === PAGE_SIZE;
  const hasPrev = page > 1;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-6">
      <header className="flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Metadata List</h1>
      </header>

      {error && (
        <div className="rounded-md border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex justify-end">
        <Link
          href="/dataset/new/"
          className="rounded-xl border px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700"
        >
          Create
        </Link>
      </div>
      <section className="rounded-2xl bg-white/50 shadow-sm flex justify-center">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="p-3 w-40">MetaDataId</th>
              <th className="p-3 w-56">Title</th>
              <th className="p-3 w-56">Publisher</th>
              <th className="p-3 w-28">Status</th>
              <th className="p-3 w-28">Provider</th>
              <th className="p-3 w-56">Contact</th>
              <th className="p-3 w-44">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-3" colSpan={6}>
                  Loading…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className="p-3" colSpan={6}>
                  No data.
                </td>
              </tr>
            ) : (
              items.map((d, i) => (
                <tr key={(d.metaDataId ?? "") + i} className="border-t">
                  <td className="p-3 truncate">
                    {d.metaDataId ? (
                      <Link
                        href={`/dataset/${encodeURIComponent(d.metaDataId)}`}
                        className="text-blue-600 hover:underline"
                      >
                        {d.metaDataId}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3 truncate">{d.title ?? "—"}</td>
                  <td className="p-3 truncate">{d.publisher ?? "—"}</td>
                  <td className="p-3 truncate">{d.status ?? "—"}</td>
                  <td className="p-3 truncate">{d.providerId ?? "—"}</td>
                  <td className="p-3 truncate">{d.contact ?? "—"}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {formatDate(d.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <footer className="flex items-center justify-end gap-2">
        <button
          className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={!hasPrev || loading}
        >
          Prev
        </button>
        <span className="text-sm">Page</span>
        <input
          type="number"
          min={1}
          value={page}
          onChange={(e) => setPage(Math.max(1, Number(e.target.value) || 1))}
          className="w-16 rounded-md border p-2 text-sm"
        />
        <button
          className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNext || loading}
        >
          Next
        </button>
      </footer>
    </main>
  );
}

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}
