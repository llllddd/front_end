"use client";

import * as React from "react";
import {useRouter} from "next/navigation";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {Spinner} from "@heroui/spinner";
import {Card, CardHeader, CardBody} from "@heroui/card";
import {
  getDatasetDetail,
  updateDatasetMetadata,
  type MetadataDTO,
} from "@/utils/api/dataset";

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditMetadataPage({params}: EditPageProps) {
  const router = useRouter();
  const [metadataId, setMetadataId] = React.useState<number | null>(null);

  // Unwrap params in useEffect
  React.useEffect(() => {
    params.then(p => setMetadataId(Number(p.id)));
  }, [params]);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<
    MetadataDTO & {
      doi?: string;
      license?: string;
    }
  >({
    title: "",
    publisher: "",
    contact: "",
    status: "",
    doi: "",
    license: "",
  });

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDatasetDetail(metadataId!);
        // Merge the backend response directly into formData
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
      } catch (e: any) {
        setError(e?.message ?? "Failed to load metadata");
      } finally {
        setLoading(false);
      }
    }
    if (metadataId != null) {
      void load();
    }
  }, [metadataId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (metadataId == null) return;
    setSaving(true);
    setError(null);

    try {
      // Only send the fields that are editable
      const payload: MetadataDTO = {
        title: formData.title ?? "",
        publisher: formData.publisher ?? "",
        contact: formData.contact ?? "",
        status: formData.status ?? "",
        ...(formData.doi ? {doi: formData.doi} : {}),
        ...(formData.license ? {license: formData.license} : {}),
      } as MetadataDTO;

      await updateDatasetMetadata(metadataId, payload);
      router.push(`/dataset/${metadataId}`);
    } catch (err: any) {
      setError(err?.message ?? "Failed to update metadata");
    } finally {
      setSaving(false);
    }
  };

  const handleChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({...prev, [field]: value}));
    };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex items-center justify-center gap-3 text-default-600">
          <Spinner size="lg" />
          <span className="text-lg">Loading metadata…</span>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
      {/* Top information (simple version, matching the detail page) */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Edit Metadata</h1>
        <p className="text-sm text-default-500">Metadata ID: {metadataId}</p>
      </header>

      {error && (
        <div className="rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
          {error}
        </div>
      )}

      <Card shadow="sm" className="border border-default-100/70">
        <CardHeader className="px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-default-500">
            Overview
          </h2>
        </CardHeader>

        {/* The layout here matches the Overview section in the detail page: a small title + content blocks */}
        <CardBody className="space-y-6 px-6 pb-6 pt-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldBlock label="Title">
              <Input
                placeholder="Enter dataset title"
                value={formData.title ?? ""}
                onChange={handleChange("title")}
                radius="lg"
                size="lg"
                isRequired
              />
            </FieldBlock>

            {/* Publisher / Contact two-column layout */}
            <div className="grid gap-6 md:grid-cols-2">
              <FieldBlock label="Publisher">
                <Input
                  placeholder="Enter publisher name"
                  value={formData.publisher ?? ""}
                  onChange={handleChange("publisher")}
                  radius="lg"
                  size="lg"
                />
              </FieldBlock>

              <FieldBlock label="Contact">
                <Input
                  placeholder="Enter contact information"
                  value={formData.contact ?? ""}
                  onChange={handleChange("contact")}
                  radius="lg"
                  size="lg"
                />
              </FieldBlock>
            </div>

            <FieldBlock label="Status">
              <Input
                placeholder="e.g., published, draft, active"
                value={formData.status ?? ""}
                onChange={handleChange("status")}
                radius="lg"
                size="lg"
              />
            </FieldBlock>

            <div className="grid gap-6 md:grid-cols-2">
              <FieldBlock label="DOI">
                <Input
                  placeholder="Enter DOI if available"
                  value={formData.doi ?? ""}
                  onChange={handleChange("doi")}
                  radius="lg"
                  size="lg"
                />
              </FieldBlock>

              <FieldBlock label="License">
                <Input
                  placeholder="e.g., MIT, CC-BY-4.0"
                  value={formData.license ?? ""}
                  onChange={handleChange("license")}
                  radius="lg"
                  size="lg"
                />
              </FieldBlock>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                type="submit"
                color="primary"
                size="lg"
                radius="lg"
                isLoading={saving}
                isDisabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </Button>

              <Button
                type="button"
                variant="bordered"
                size="lg"
                radius="lg"
                onPress={() => router.back()}
                isDisabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </main>
  );
}

/** Label style consistent with the Overview section in the detail page: small title on top, content below */
function FieldBlock(props: {label: string; children: React.ReactNode}) {
  const {label, children} = props;
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-medium uppercase tracking-wide text-default-400">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}
