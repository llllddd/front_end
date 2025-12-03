"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Snippet } from "@heroui/snippet";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const DETAIL_ENDPOINT = "/dataset/detail";
import { getMetadataHistory, deleteDataset } from "@/utils/api/dataset";

interface Metadata {
  metaDataId: string;
  title: string;
  publisher: string;
  abstract: string;
  license: string;
  keyword: string;
  doi: string;
  contact: string;
  owner: string;
  providerId: string;
  status: string;
  metadataHash: string;
  createdAt: string | number;
  updatedAt: string | number;
}

interface Txn {
  txHash: string;
  from: string;
  to: string;
  event: string;
  blockNumber: number;
  timestamp: number | null;
}

export default function MetadataDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [data, setData] = React.useState<Metadata | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [txns, setTxns] = React.useState<Txn[]>([]);
  const [txLoading, setTxLoading] = React.useState(false);
  const [txError, setTxError] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  async function handleUnregister() {
    if (!id) return;
    const ok = window.confirm("Unregister this dataset? This cannot be undone.");
    if (!ok) return;
    try {
      setDeleting(true);
      setDeleteError(null);
      await deleteDataset(Number(id));
      // After successful unregister, navigate back to list page
      window.location.assign("/dataset/list");
    } catch (err: any) {
      setDeleteError(err?.message ?? "Failed to unregister");
    } finally {
      setDeleting(false);
    }
  }

  // Fetch metadata
  React.useEffect(() => {
    if (!id) return;
    if (!API_BASE) {
      setError("Missing NEXT_PUBLIC_API_BASE_URL");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE}${DETAIL_ENDPOINT}/${encodeURIComponent(id)}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        setData(await res.json());
      } catch (err: any) {
        setError(err?.message ?? "Failed to load detail");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Fetch transaction history via utils API
  React.useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setTxLoading(true);
        setTxError(null);
        const data = await getMetadataHistory(Number(id));
        setTxns(data);
      } catch (err: any) {
        setTxError(err?.message ?? "Failed to load history");
      } finally {
        setTxLoading(false);
      }
    })();
  }, [id]);

  const statusColor = getStatusColor(data?.status);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      {/* The Title */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {data?.title ?? "Metadata Detail"}
            </h1>
            {data?.status && (
              <Chip
                size="sm"
                color={statusColor}
                variant="flat"
                className="uppercase"
              >
                {data.status}
              </Chip>
            )}
          </div>

          {data && (
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-default-500">
              <span className="font-mono text-[11px] md:text-xs">
                ID: {data.metaDataId}
              </span>
              <span>•</span>
              <span>
                Created:{" "}
                {formatTimestamp(
                  typeof data.createdAt === "number"
                    ? data.createdAt
                    : Date.parse(String(data.createdAt))
                )}
              </span>
              <span>•</span>
              <span>
                Updated:{" "}
                {formatTimestamp(
                  typeof data.updatedAt === "number"
                    ? data.updatedAt
                    : Date.parse(String(data.updatedAt))
                )}
              </span>
            </div>
          )}
        </div>

        {id && (
          <div className="flex gap-2">
            <Button
              as={Link}
              href={`/dataset/${id}/edit`}
              color="primary"
              size="sm"
              radius="lg"
            >
              Edit Metadata
            </Button>
            <Button
              color="danger"
              size="sm"
              radius="lg"
              onClick={handleUnregister}
              isDisabled={deleting}
            >
              {deleting ? "Unregistering…" : "Unregister"}
            </Button>
          </div>
        )}
      </header>

      {!id && (
        <Alert
          color="warning"
          variant="flat"
          description="No metaDataId provided."
        />
      )}

      {error && <Alert color="danger" variant="flat" description={error} />}
      {deleteError && (
        <Alert color="danger" variant="flat" description={deleteError} />
      )}

      {loading && (
        <div className="flex items-center gap-2 text-default-500">
          <Spinner size="sm" /> Loading…
        </div>
      )}

      {/* Main content: two-column layout, more modern */}
      {data && (
        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)]">
          {/* Left: description */}
          <Card shadow="sm" className="border border-default-100/70">
            <CardHeader className="flex items-center justify-between px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-default-500">
                Overview
              </h2>
            </CardHeader>
            <CardBody className="space-y-5 px-6 pb-6 pt-0">
              <InfoField label="Title">{data.title || "—"}</InfoField>
              <InfoField label="Publisher">{data.publisher || "—"}</InfoField>
              <InfoField label="Abstract">
                {data.abstract || (
                  <span className="text-default-400">No abstract.</span>
                )}
              </InfoField>
              <div className="grid gap-4 md:grid-cols-2">
                <InfoField label="License">{data.license || "—"}</InfoField>
                <InfoField label="Keyword">{data.keyword || "—"}</InfoField>
                <InfoField label="DOI">
                  {data.doi ? (
                    isUrl(data.doi) ? (
                      <Link
                        href={data.doi}
                        isExternal
                        className="text-primary-400 hover:underline"
                      >
                        {data.doi}
                      </Link>
                    ) : (
                      data.doi
                    )
                  ) : (
                    "—"
                  )}
                </InfoField>
                <InfoField label="Contact">{data.contact || "—"}</InfoField>
              </div>
            </CardBody>
          </Card>

          {/* Right: On-chain / System Information */}
          <Card shadow="sm" className="border border-default-100/70">
            <CardHeader className="flex items-center justify-between px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-default-500">
                On-chain & System
              </h2>
            </CardHeader>
            <CardBody className="space-y-4 px-6 pb-6 pt-0">
              <InfoField label="Status">
                <Chip
                  size="sm"
                  color={statusColor}
                  variant="flat"
                  className="uppercase"
                >
                  {data.status}
                </Chip>
              </InfoField>
              <InfoField label="Owner">
                <Snippet
                  size="sm"
                  hideSymbol
                  variant="bordered"
                  className="max-w-full"
                >
                  {data.owner}
                </Snippet>
              </InfoField>
              <InfoField label="Metadata Hash">
                <Snippet
                  size="sm"
                  hideSymbol
                  variant="bordered"
                  className="max-w-full"
                >
                  <Tooltip
                    content={data.metadataHash}
                    showArrow
                    placement="top"
                  >
                    {truncateMiddle(data.metadataHash, 35, 6)}
                  </Tooltip>
                </Snippet>
              </InfoField>
              <InfoField label="Provider ID">
                <span className="font-mono text-xs">{data.providerId}</span>
              </InfoField>
            </CardBody>
          </Card>
        </section>
      )}

      {/* Transaction History: closer to a block explorer feel */}
      <Card shadow="sm" className="border border-default-100/70">
        <CardHeader className="flex items-center justify-between px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-default-500">
            Transaction History
          </h2>
          {txLoading && (
            <div className="flex items-center gap-2 text-default-500">
              <Spinner size="sm" /> Loading…
            </div>
          )}
        </CardHeader>

        <CardBody className="px-6 pb-6 pt-0">
          {txError ? (
            <Alert color="danger" variant="bordered" description={txError} />
          ) : txns.length === 0 && !txLoading ? (
            <p className="text-sm text-default-500">No transactions.</p>
          ) : (
            <Accordion variant="splitted">
              {txns.map((t, i) => (
                <AccordionItem
                  key={i}
                  title={
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-default-500">
                        #{i + 1}
                      </span>
                      <span className="text-sm font-semibold">{t.event}</span>
                      <span className="text-xs text-default-400">
                        {formatTimestamp(t.timestamp)}
                      </span>
                    </div>
                  }
                  subtitle={
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-default-400">
                      <span>Tx: {truncateMiddle(t.txHash, 10, 6)}</span>
                      <span>•</span>
                      <span>Block: {t.blockNumber ?? "—"}</span>
                    </div>
                  }
                >
                  <div className="space-y-3 text-sm">
                    <TxnField label="Block No.">
                      {t.blockNumber ?? "—"}
                    </TxnField>
                    <TxnField label="Tx Hash">
                      {t.txHash ? (
                        <span className="font-mono text-xs">{t.txHash}</span>
                      ) : (
                        "—"
                      )}
                    </TxnField>
                    <div className="grid gap-3 md:grid-cols-2">
                      {/* From */}
                      <TxnField label="From">
                        {t.from ? (
                          <span className="font-mono text-xs">{t.from}</span>
                        ) : (
                          "—"
                        )}
                      </TxnField>
                      <TxnField label="To">
                        {t.to ? (
                          <span className="font-mono text-xs">{t.to}</span>
                        ) : (
                          "—"
                        )}
                      </TxnField>
                    </div>
                    <TxnField label="Timestamp">
                      {formatTimestamp(t.timestamp)}
                    </TxnField>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardBody>
      </Card>
    </main>
  );
}

/* ---------- Small Components & Utility Functions ---------- */

function InfoField(props: { label: string; children: React.ReactNode }) {
  const { label, children } = props;
  return (
    <div className="space-y-1">
      <div className="text-[11px] font-medium uppercase tracking-wide text-default-400">
        {label}
      </div>
      <div className="text-sm text-default-700 dark:text-default-200 break-words">
        {children}
      </div>
    </div>
  );
}

function TxnField(props: { label: string; children: React.ReactNode }) {
  const { label, children } = props;
  return (
    <div className="space-y-1">
      <div className="text-[11px] font-medium uppercase tracking-wide text-default-400">
        {label}
      </div>
      <div className="text-sm text-default-700 dark:text-default-200 break-words">
        {children}
      </div>
    </div>
  );
}

function formatTimestamp(ts: number | null) {
  if (ts == null) return "—";
  const ms = ts < 1e12 ? ts * 1000 : ts;
  const d = new Date(ms);
  return isNaN(d.getTime()) ? String(ts) : d.toLocaleString();
}

function truncateMiddle(str: string, left = 6, right = 4) {
  if (!str) return "—";
  if (str.length <= left + right + 3) return str;
  return `${str.slice(0, left)}...${str.slice(-right)}`;
}

function isUrl(v: string) {
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

function getStatusColor(status?: string | null) {
  if (!status) return "default";
  const s = status.toLowerCase();
  if (["active", "published", "enabled"].includes(s)) return "success";
  if (["pending", "draft"].includes(s)) return "warning";
  if (["disabled", "error", "failed"].includes(s)) return "danger";
  return "default";
}
