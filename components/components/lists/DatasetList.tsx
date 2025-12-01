'use client';

import React, { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';

import formatDate from '@/utils/format-date';

interface DatasetListProps {
  datasets: any[];
  dataset?: any;            // currently selected dataset
  editable: boolean;
}

const DatasetList: FC<DatasetListProps> = ({ datasets, dataset, editable }) => {
  const router = useRouter();

  const renderList = () => (
    <div className="space-y-2">
      {datasets?.map((data) => {
        const id = editable ? data.metadata.datasetId : data.datasetId;
        const isSelected =
          dataset &&
          (data.datasetId === dataset?.metadata?.datasetId ||
            data.metadata?.datasetId === dataset?.metadata?.datasetId);

        return (
          <div
            key={id}
            className={`
              rounded cursor-pointer bg-gray-100 hover:bg-blue-100 
              h-24 p-4 shadow-md flex justify-between items-center
              ${isSelected ? 'bg-blue-200' : ''}
            `}
            onClick={() => {
              if (editable) {
                router.push(`/contributions/${data.metadata.datasetId}`);
              } else {
                router.push(`/datasets/${data.datasetId}`);
              }
            }}
          >
            {editable ? (
              <>
                <div>
                  <p className="font-semibold">{data.metadata.datasetId}</p>
                  <p className="text-gray-500 text-sm">
                    {data.metadata.createdAt &&
                      formatDate(data.metadata.createdAt)}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/edit/${data.metadata.datasetId}`);
                  }}
                  className="p-2 hover:bg-gray-200 rounded"
                  aria-label="edit dataset"
                >
                  <Pencil size={20} />
                </button>
              </>
            ) : (
              <div>
                <p className="font-semibold">{data.datasetId}</p>
                <p className="text-gray-500 text-sm">
                  {data.survey.charAt(0).toUpperCase() +
                    data.survey.substring(1).toLowerCase()}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="mx-2 lg:hidden">
        {!dataset && renderList()}
      </div>

      {/* Desktop */}
      <div className="mx-2 hidden lg:block">
        {renderList()}
      </div>
    </>
  );
};

export default DatasetList;
