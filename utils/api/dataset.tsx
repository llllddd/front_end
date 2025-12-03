import { apiClient } from "./client";

// Types mirrored from backend DTOs
export interface MetadataDTO {
  metaDataId?: number;
  title?: string;
  metadataHash?: string;
  version?: number;
  status?: string;
  [key: string]: any;
}

export interface MediaDTO {
  fileName: string;
  filePath?: string; // server-side only
  type: number; // mediaTypeId
  fileHash: string;
  userId?: number; // server-side only
}

export interface DataTokenDTO {
  providerId: number;
  dataHash: string;
  dataURI: string;
  metadataHash: string;
  metadataURI: string;
  owner: string;
  custodian: string;
}

// Common API response shapes
export interface PaginatedDatasets<T = any> {
  items?: T[]; // if your backend returns {items, total} etc., adjust accordingly
  total?: number;
}

export interface DatasetVersionSummary {
  metaDataId: number;
  version: number;
  isLatest: boolean;
  title?: string;
  metadataHash?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DatasetVersionsResponse {
  originalMetaDataId: number;
  totalVersions: number;
  versions: DatasetVersionSummary[];
}

// ------- Dataset API client ------- //

/**
 * Submit dataset: multipart/form-data
 * - dataset: File (field name: "dataset")
 * - metaData: JSON payload (field name: "metaData")
 * Requires cookie-auth; withCredentials is enabled on apiClient
 */
export async function submitDataset(payload: {
  dataset: File;
  metaData: MetadataDTO;
}): Promise<{ tokenId: number }> {
  const form = new FormData();
  form.append("dataset", payload.dataset);
  form.append("metaData", JSON.stringify(payload.metaData));

  const { data } = await apiClient.post("/dataset/submitDataset", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Delete a dataset by its primaryDataId
 */
export async function deleteDataset(primaryDataId: number): Promise<void> {
  await apiClient.delete(`/dataset/${primaryDataId}`);
}

/**
 * Update metadata for a given metadataId (multipart due to possible file fields in upload middleware)
 * If your backend expects only JSON, you can send JSON instead.
 */
export async function updateDatasetMetadata(metadataId: number, metaData: MetadataDTO): Promise<MetadataDTO> {
  const form = new FormData();
  form.append("metaData", JSON.stringify(metaData));

  const { data } = await apiClient.put(`/dataset/${metadataId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Create Data Token (third-party nodes) — public endpoint
 */
export async function submitToken(dto: DataTokenDTO): Promise<{ txHash: string }> {
  const { data } = await apiClient.post("/dataset/submitToken", dto);
  return data;
}

/**
 * Get dataset metadata detail
 */
export async function getDatasetDetail(metadataId: number): Promise<MetadataDTO> {
  const { data } = await apiClient.get(`/dataset/detail/${metadataId}`);
  return data;
}

/**
 * List metadata with pagination
 */
export async function listMetadata(params?: { limit?: number; offset?: number }): Promise<PaginatedDatasets> {
  const { data } = await apiClient.get("/dataset/listmetadata", { params });
  return data;
}

/**
 * Create metadata in local database only (private)
 */
export async function createMetadata(dto: MetadataDTO): Promise<MetadataDTO> {
  const { data } = await apiClient.post("/dataset/createMetadata", dto);
  return data;
}

/**
 * Get token transaction history by metadata id
 */
export async function getMetadataHistory(metaDataId: number): Promise<any> {
  const { data } = await apiClient.get(`/dataset/history/metadata/${metaDataId}`);
  return data;
}

/**
 * Get all versions for a metadata record
 */
export async function getMetadataVersions(metadataId: number): Promise<DatasetVersionsResponse> {
  const { data } = await apiClient.get(`/dataset/${metadataId}/versions`);
  return data;
}

/**
 * Get a specific metadata version
 */
export async function getMetadataVersion(metadataId: number, version: number): Promise<MetadataDTO> {
  const { data } = await apiClient.get(`/dataset/${metadataId}/versions/${version}`);
  return data;
}

/**
 * Get latest metadata version
 */
export async function getLatestMetadataVersion(metadataId: number): Promise<MetadataDTO> {
  const { data } = await apiClient.get(`/dataset/${metadataId}/latest`);
  return data;
}
