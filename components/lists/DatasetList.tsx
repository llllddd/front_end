import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/table";
import { Icon } from "@iconify/react";

interface Metadata {
  datasetId: string;
  createdAt?: string;
  [key: string]: any;
}

interface DatasetItem {
  metadata: Metadata;
  datasetId: string;
  survey: string;
  [key: string]: any;
}

interface DatasetListProps {
  datasets: DatasetItem[];
  dataset?: DatasetItem;
  editable?: boolean;
}

export default function TableUsage({ datasets, editable = false }: DatasetListProps) {
  return (
    <Table aria-label="Datasetlisttable">
      <TableHeader>
        <TableColumn>DATASET ID</TableColumn>
        <TableColumn>SURVEY</TableColumn>
        <TableColumn>CREATED AT</TableColumn>
         <TableColumn>ACTIONS</TableColumn>
      </TableHeader>
      <TableBody>
        {datasets.map((item) => (
          <TableRow key={item.datasetId}>
            <TableCell>{item.datasetId}</TableCell>
            <TableCell>{item.survey}</TableCell>
            <TableCell>{item.metadata.createdAt || 'N/A'}</TableCell>
            <TableCell>
              {editable && (
                <Icon icon="lucide:edit" className="text-primary-500 cursor-pointer" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}