'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useProtectedRoute } from '@/utils/hooks/useProtectedRoute';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const METADATA_ENDPOINT = '/dataset/createMetadata';          // 提交元数据
const FILE_UPLOAD_ENDPOINT = '/upload-primary'; // 提交文件（请按你的后端实际路径修改）

interface MetadataPayload {
  title: string;
  publisher: string;
  abstract: string;
  license: string;
  keyword: string;
  doi: string;
  contact: string;
  owner: string;
  providerId: number;
  primarydataId: string | null; // 将由文件上传接口返回的ID填入
  status: 'ACTIVE' | 'INACTIVE' | string;
}

export default function NewMetadataPage() {
  const router = useRouter();
  const { allowed, authCompleted, login } = useProtectedRoute();

  const [form, setForm] = React.useState<MetadataPayload>({
    title: '',
    publisher: '',
    abstract: '',
    license: 'CC-BY-4.0',
    keyword: '',
    doi: '',
    contact: '',
    owner: '',
    providerId: 0,
    primarydataId: null,
    status: 'ACTIVE',
  });

  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Route protection
  React.useEffect(() => {
    if (!authCompleted) return;
    if (!allowed) return;
  }, [allowed, authCompleted, router]);

  // Don't render if not authenticated or not verified
  if (!authCompleted || !allowed) {
    return null;
  }

  function update<K extends keyof MetadataPayload>(key: K, value: MetadataPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // 单独的文件上传函数（使用另外一个 API）
  async function uploadFileToSeparateAPI(file: File): Promise<{ primarydataId: string | null; raw: any }>
  {
    if (!API_BASE) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
    const fd = new FormData();
    fd.append('file', file);

    const res = await fetch(`${API_BASE}${FILE_UPLOAD_ENDPOINT}`, {
      method: 'POST',
      body: fd,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `File upload failed with ${res.status}`);
    }

    const data = await res.json().catch(() => ({} as any));

    // ⚠️ 按你的后端返回结构取值。这里尝试常见的几种字段名。
    const primarydataId = data.primarydataId ?? data.primaryDataId ?? data.id ?? null;
    return { primarydataId, raw: data };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!API_BASE) throw new Error('Missing NEXT_PUBLIC_API_BASE_URL');
      // if (!form.metaDataId) throw new Error('metaDataId is required');
      if (!form.title) throw new Error('title is required');
      if (!form.owner) throw new Error('owner is required');
      if (!form.providerId || Number.isNaN(+form.providerId)) throw new Error('providerId must be a number');

      let primarydataIdFromUpload: string | null = form.primarydataId;

      // 1) 先上传文件到“另一个 API”，拿到 primarydataId
      if (file) {
        const { primarydataId } = await uploadFileToSeparateAPI(file);
        if (!primarydataId) {
          throw new Error('File uploaded but no primarydataId returned');
        }
        primarydataIdFromUpload = primarydataId;
      }

      // 2) 再提交元数据到 METADATA_ENDPOINT（使用 JSON）
      const payload: MetadataPayload = { ...form, primarydataId: primarydataIdFromUpload };

      const res = await fetch(`${API_BASE}${METADATA_ENDPOINT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Metadata request failed with ${res.status}`);
      }

      const data = await res.json().catch(() => ({}));
      setSuccess('Submitted successfully');
      console.log('Created metadata:', data);
    } catch (err: any) {
      setError(err?.message ?? 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Metadata</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">{success}</div>
      )}

      <form onSubmit={onSubmit} className="grid gap-4">
        <Field label="ProviderId" required>
          <input type="number" className="w-full rounded-md border p-2" value={form.providerId} onChange={(e) => update('providerId', Number(e.target.value))} />
        </Field>
        <Field label="Title" required>
          <input className="w-full rounded-md border p-2" value={form.title} onChange={(e) => update('title', e.target.value)} />
        </Field>
        <Field label="Publisher">
          <input className="w-full rounded-md border p-2" value={form.publisher} onChange={(e) => update('publisher', e.target.value)} />
        </Field>
        <Field label="License">
          <input className="w-full rounded-md border p-2" value={form.license} onChange={(e) => update('license', e.target.value)} />
        </Field>
        <Field label="Abstract">
          <textarea className="w-full rounded-md border p-2" rows={4} value={form.abstract} onChange={(e) => update('abstract', e.target.value)} />
        </Field>
        <Field label="Keyword">
          <input className="w-full rounded-md border p-2" value={form.keyword} onChange={(e) => update('keyword', e.target.value)} />
        </Field>
        <Field label="DOI">
          <input className="w-full rounded-md border p-2" value={form.doi} onChange={(e) => update('doi', e.target.value)} />
        </Field>
        <Field label="Contact" required>
          <input className="w-full rounded-md border p-2" value={form.contact} onChange={(e) => update('contact', e.target.value)} />
        </Field>
        <Field label="Owner" required>
          <input className="w-full rounded-md border p-2 font-mono" value={form.owner} onChange={(e) => update('owner', e.target.value)} />
        </Field>
        <Field label="Status">
          <select className="w-full rounded-md border p-2" value={form.status} onChange={(e) => update('status', e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </Field>
        {/* <Field label="primarydataId">
          <input className="w-full rounded-md border p-2" value={form.primarydataId ?? ''} onChange={(e) => update('primarydataId', e.target.value || null)} />
        </Field> */}
        {/* 文件上传行：左文字右输入，同时显示预览信息 */}
        <Field label="Upload File" required>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              className="w-full"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            {file && (
              <div className="text-xs text-gray-600">
                Selected：<span className="font-medium">{file.name}</span>
                {typeof file.size === 'number' && (
                  <span>（{(file.size / 1024).toFixed(1)} KB）</span>
                )}
              </div>
            )}
          </div>
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={submitting} className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({
                title: 'Global Climate Data 2020',
                publisher: 'World Climate Research Program',
                abstract: 'Dataset abstract...',
                license: 'CC-BY-4.0',
                keyword: 'climatetemperatureprecipitation',
                doi: '10.1234/example.doi.2020',
                contact: 'support@example.org',
                owner: '0x1234567890abcdef1234567890abcdef12345678',
                providerId: 4,
                primarydataId: null,
                status: 'ACTIVE',
              });
              setFile(null);
            }}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Fill sample
          </button>
        </div>
      </form>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-48 text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
