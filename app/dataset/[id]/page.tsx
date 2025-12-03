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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const DETAIL_ENDPOINT = "/dataset/detail";
const HISTORY_ENDPOINT = "/dataset/history";

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

  // Fetch metadata
  React.useEffect(() => {
    if (!id) return;
    if (!API_BASE) return setError("Missing NEXT_PUBLIC_API_BASE_URL");

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

  // Fetch transaction history
  React.useEffect(() => {
    if (!id) return;
    if (!API_BASE) return setTxError("Missing NEXT_PUBLIC_API_BASE_URL");

    (async () => {
      try {
        setTxLoading(true);
        setTxError(null);

        const res = await fetch(
          `${API_BASE}${HISTORY_ENDPOINT}/${encodeURIComponent(id)}`,
          { cache: "no-store" }
        );

        if (!res.ok)
          throw new Error(`Transaction history request failed: ${res.status}`);

        setTxns(await res.json());
      } catch (err: any) {
        setTxError(err?.message ?? "Failed to load history");
      } finally {
        setTxLoading(false);
      }
    })();
  }, [id]);

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Metadata Detail</h1>
        {id && (
          <Button
            as={Link}
            href={`/dataset/${id}/edit`}
            color="primary"
            size="sm"
            radius="lg"
          >
            Edit Metadata
          </Button>
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

      {loading && (
        <div className="flex items-center gap-2 text-gray-600">
          <Spinner size="sm" /> Loading…
        </div>
      )}

      {data && (
        <Card shadow="sm">
          <CardHeader>
            <h2 className="text-lg font-semibold">Metadata Info</h2>
          </CardHeader>
          <CardBody className="overflow-x-auto w-full p-0">
            <Table className="w-full" removeWrapper aria-label="Metadata table">
              <TableHeader>
                <TableColumn>Property</TableColumn>
                <TableColumn className="w-auto">Value</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    metaDataId
                  </TableCell>
                  <TableCell>{data.metaDataId}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Title
                  </TableCell>
                  <TableCell>{data.title}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Publisher
                  </TableCell>
                  <TableCell>{data.publisher}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Abstract
                  </TableCell>
                  <TableCell>{data.abstract}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    License
                  </TableCell>
                  <TableCell>{data.license}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Keyword
                  </TableCell>
                  <TableCell>{data.keyword}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    DOI
                  </TableCell>
                  <TableCell>{data.doi}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Contact
                  </TableCell>
                  <TableCell>{data.contact}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Owner
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{data.owner}</span>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Provider ID
                  </TableCell>
                  <TableCell>{data.providerId}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Status
                  </TableCell>
                  <TableCell>{data.status}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Metadata Hash
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{data.metadataHash}</span>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Created At
                  </TableCell>
                  <TableCell>
                    {new Date(data.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-700">
                    Updated At
                  </TableCell>
                  <TableCell>
                    {new Date(data.updatedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}

      <Card shadow="sm">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Transaction History</h2>
          {txLoading && (
            <div className="flex items-center gap-2 text-gray-600">
              <Spinner size="sm" /> Loading…
            </div>
          )}
        </CardHeader>

        <CardBody>
          {txError ? (
            <Alert color="danger" variant="bordered" description={txError} />
          ) : txns.length === 0 && !txLoading ? (
            <p className="text-sm text-gray-600">No transactions.</p>
          ) : (
            <Accordion variant="splitted">
              {txns.map((t, i) => (
                <AccordionItem
                  key={i}
                  title={`#${i + 1} – ${t.event}`}
                  subtitle={formatTimestamp(t.timestamp)}
                >
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Tx Hash:</strong>{" "}
                      <code className="break-all">{t.txHash}</code>
                    </p>
                     <p>
                      <strong>From:</strong> {t.from ?? "—"}
                    </p>
                     <p>
                      <strong>To:</strong> {t.to ?? "—"}
                    </p>
                    <p>
                      <strong>Block No:</strong> {t.blockNumber ?? "—"}
                    </p>
                    <p>
                      <strong>Timestamp:</strong> {formatTimestamp(t.timestamp)}
                    </p>
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


function formatTimestamp(ts: number | null) {
  if (ts == null) return "—";
  const ms = ts < 1e12 ? ts * 1000 : ts;
  const d = new Date(ms);
  return isNaN(d.getTime()) ? String(ts) : d.toLocaleString();
}
