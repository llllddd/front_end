"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {
  getDatasetDetail,
  updateDatasetMetadata,
  type MetadataDTO,
} from "@/utils/api/dataset";

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function EditMetadataPage({ params }: EditPageProps) {
  const router = useRouter();
  const metadataId = Number(params.id);

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<MetadataDTO>({
    title: "",
    publisher: "",
    contact: "",
    status: "",
  });

  // Load existing metadata
  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDatasetDetail(metadataId);
        setFormData(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load metadata");
      } finally {
        setLoading(false);
      }
    }
    if (metadataId) {
      void load();
    }
  }, [metadataId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updateDatasetMetadata(metadataId, formData);
      // Navigate back to list or detail page
      router.push(`/dataset/${metadataId}`);
    } catch (err: any) {
      setError(err?.message ?? "Failed to update metadata");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof MetadataDTO) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-center gap-3">
          <Spinner size="lg" />
          <span className="text-lg">Loading metadata…</span>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Edit Metadata</h1>
        <p className="text-sm text-gray-600 mt-2">
          Metadata ID: {metadataId}
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter dataset title"
            value={formData.title ?? ""}
            onChange={handleChange("title")}
            isRequired
            size="lg"
            radius="lg"
          />

          <Input
            label="Publisher"
            placeholder="Enter publisher name"
            value={formData.publisher ?? ""}
            onChange={handleChange("publisher")}
            size="lg"
            radius="lg"
          />

          <Input
            label="Contact"
            placeholder="Enter contact information"
            value={formData.contact ?? ""}
            onChange={handleChange("contact")}
            size="lg"
            radius="lg"
          />

          <Input
            label="Status"
            placeholder="e.g., published, draft, active"
            value={formData.status ?? ""}
            onChange={handleChange("status")}
            size="lg"
            radius="lg"
          />

          <Input
            label="DOI"
            placeholder="Enter DOI if available"
            value={(formData as any).doi ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, doi: e.target.value }))
            }
            size="lg"
            radius="lg"
          />

          <Input
            label="License"
            placeholder="e.g., MIT, CC-BY-4.0"
            value={(formData as any).license ?? ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, license: e.target.value }))
            }
            size="lg"
            radius="lg"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
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
    </main>
  );
}
