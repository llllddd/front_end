"use client";

import * as React from "react";
import { Link } from "@heroui/link";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip, ChipProps } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";
import {
  listMetadata,
  getMetadataVersions,
  type DatasetVersionsResponse,
} from "@/utils/api/dataset";
import CellWithTooltip from "@/components/components/lists/CellWithTooltip";

interface DatasetItem {
  displayNo?: number;
  metaDataId?: number;
  title?: string;
  metadataHash?: string;
  publisher?: string;
  status?: string;
  providerId?: number;
  createdAt?: string;
  contact?: string;
  [key: string]: any;
}

const PAGE_SIZE = 10;

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  published: "success",
  draft: "warning",
  paused: "danger",
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function ListMetadataPage() {
  const [items, setItems] = React.useState<DatasetItem[]>([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState("");

  const offset = (page - 1) * PAGE_SIZE;

  const fetchPage = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await listMetadata({ limit: PAGE_SIZE, offset });
      const list = Array.isArray(data)
        ? data
        : ((data.items ?? []) as DatasetItem[]);

      setItems(list);
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

  // version section states
  const [openRows, setOpenRows] = React.useState<Record<number, boolean>>({});
  const [versions, setVersions] = React.useState<
    Record<number, DatasetVersionsResponse | null>
  >({});
  const [loadingVersions, setLoadingVersions] = React.useState<
    Record<number, boolean>
  >({});

  const toggleHistory = async (metaDataId?: number) => {
    if (!metaDataId) return;

    setOpenRows((prev) => ({ ...prev, [metaDataId]: !prev[metaDataId] }));

    const willOpen = !openRows[metaDataId];
    if (willOpen && !versions[metaDataId]) {
      setLoadingVersions((p) => ({ ...p, [metaDataId]: true }));
      try {
        const data = await getMetadataVersions(metaDataId);
        setVersions((p) => ({ ...p, [metaDataId]: data }));
      } finally {
        setLoadingVersions((p) => ({ ...p, [metaDataId]: false }));
      }
    }
  };

  const renderStatusChip = (status?: string) => {
    if (!status) return "—";

    const normalized = status.toLowerCase();
    const color = statusColorMap[normalized] ?? "default";

    return (
      <Chip size="sm" color={color} variant="flat" className="capitalize">
        {status}
      </Chip>
    );
  };

  // Table filtering
  const filteredItems = items.filter((d) => {
    const s = search.toLowerCase();
    return (
      d.title?.toLowerCase().includes(s) ||
      d.publisher?.toLowerCase().includes(s) ||
      d.metadataHash?.toLowerCase().includes(s)
    );
  });

  return (
    <main className="mx-auto max-w-7xl flex flex-col gap-6 px-6">
      {/* Header */}
      <header className="relative py-2 flex justify-center">
        <h1 className="text-3xl font-semibold">Metadata List</h1>

        <Button
          as={Link}
          href="/dataset/new/"
          color="primary"
          size="sm"
          radius="lg"
          className="absolute right-0 top-1/2 -translate-y-1/2"
        >
          Create
        </Button>
      </header>

      {/* Main table */}
      <section className="rounded-2xl bg-white/60 backdrop-blur shadow-sm p-3">
        <Table
          aria-label="Dataset metadata list"
          removeWrapper
          classNames={{
            table: "w-full table-auto",
            th: "text-gray-700 bg-gray-50 text-sm font-semibold whitespace-nowrap",
            td: "align-middle text-sm",
          }}
        >
          <TableHeader>
            <TableColumn className="min-w-[70px] w-[70px]">No.</TableColumn>
            <TableColumn className="min-w-[200px] max-w-[280px]">
              MetaDataHash
            </TableColumn>
            <TableColumn className="min-w-[120px] max-w-[360px]">
              Title
            </TableColumn>
            <TableColumn className="min-w-[160px] max-w-[220px]">
              Publisher
            </TableColumn>
            <TableColumn className="min-w-[180px] max-w-[240px]">
              Contact
            </TableColumn>
            <TableColumn className="min-w-[120px] w-[120px]">
              Status
            </TableColumn>
            <TableColumn className="min-w-[150px] w-[150px]">
              Created
            </TableColumn>
            <TableColumn className="min-w-[120px] w-[120px]">
              History
            </TableColumn>
            <TableColumn className="min-w-[120px] w-[120px]" align="start">
              Actions
            </TableColumn>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <div className="flex items-center justify-center gap-2 py-4">
                    <Spinner size="sm" /> Loading…
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <div className="text-center py-4 text-gray-500">No data.</div>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((d, i) => (
                <React.Fragment key={d.metaDataId + ":" + i}>
                  <TableRow className="hover:bg-gray-50 transition">
                    <TableCell>{d.displayNo}</TableCell>
                    <TableCell className="truncate max-w-0">
                      <CellWithTooltip text={d.metaDataHash} />
                    </TableCell>
                    <TableCell className="truncate max-w-0">
                      {d.title}
                    </TableCell>
                    <TableCell className="truncate max-w-0">
                      {d.publisher}
                    </TableCell>
                    <TableCell className="truncate max-w-0">
                      <CellWithTooltip text={d.contact} />
                    </TableCell>

                    <TableCell>{renderStatusChip(d.status)}</TableCell>

                    <TableCell className="text-gray-600">
                      {formatDate(d.createdAt)}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        variant="bordered"
                        radius="md"
                        onPress={() => toggleHistory(d.metaDataId)}
                      >
                        {d.metaDataId && openRows[d.metaDataId]
                          ? "Hide"
                          : "Show"}
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <div className="relative flex items-center gap-2">
                        <Tooltip content="Show Detail">
                          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <Link
                              href={`/dataset/${d.metaDataId}`}
                              className="text-primary hover:underline"
                            >
                              Detail
                            </Link>
                          </span>
                        </Tooltip>
                        <Tooltip content="Edit MetaData">
                          <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <Link
                              href={`/dataset/${d.metaDataId}/edit`}
                              className="text-primary hover:underline"
                            >
                              Edit
                            </Link>
                          </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                          <span className="text-lg text-danger cursor-pointer active:opacity-50">
                            {3}
                          </span>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Version History */}
                  {d.metaDataId && openRows[d.metaDataId] && (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <div className="border rounded-xl p-4 bg-white shadow-inner mt-2">
                          {loadingVersions[d.metaDataId] ? (
                            <div className="flex items-center gap-2 text-gray-600 py-2">
                              <Spinner size="sm" /> Loading versions…
                            </div>
                          ) : versions[d.metaDataId] ? (
                            <Table
                              removeWrapper
                              aria-label="Version history"
                              classNames={{
                                table: "w-full table-auto text-sm",
                              }}
                            >
                              <TableHeader>
                                <TableColumn className="w-[10%]">
                                  Version
                                </TableColumn>
                                <TableColumn className="w-[20%]">
                                  Title
                                </TableColumn>
                                <TableColumn className="w-[10%]">
                                  Status
                                </TableColumn>
                                <TableColumn className="w-[30%]">
                                  MetaDataHash
                                </TableColumn>
                                <TableColumn className="w-[15%]">
                                  Created
                                </TableColumn>
                                <TableColumn className="w-[15%]">
                                  Updated
                                </TableColumn>
                              </TableHeader>

                              <TableBody>
                                {versions[d.metaDataId]!.versions.map((v) => (
                                  <TableRow
                                    key={d.metaDataId + "-" + v.version}
                                  >
                                    <TableCell>
                                      <Link
                                        href={`/dataset/${d.metaDataId}/versions/${v.version}`}
                                        className="text-primary hover:underline"
                                      >
                                        {v.version}
                                      </Link>
                                    </TableCell>
                                    <TableCell className="truncate">
                                      {v.title}
                                    </TableCell>
                                    <TableCell>
                                      {renderStatusChip(v.status)}
                                    </TableCell>
                                    <TableCell>
                                      {formatDate(v.metadataHash)}
                                    </TableCell>
                                    <TableCell>
                                      {formatDate(v.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                      {formatDate(v.updatedAt)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <div className="text-sm text-gray-600">
                              No versions found.
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </section>

      {/* Pagination */}
      <footer className="flex items-center justify-center gap-3 py-4">
        <Button
          size="sm"
          variant="bordered"
          radius="lg"
          isDisabled={!hasPrev || loading}
          onPress={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </Button>

        <Input
          type="number"
          size="sm"
          className="w-24 text-center"
          min={1}
          value={String(page)}
          onChange={(e) => setPage(Math.max(1, Number(e.target.value) || 1))}
        />

        <Button
          size="sm"
          variant="bordered"
          radius="lg"
          isDisabled={!hasNext || loading}
          onPress={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
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
