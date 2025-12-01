'use client';

import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@heroui/button';
import { XCircle } from 'lucide-react';

import strings from '../strings';
import InfoPopover from './InfoPopover';

interface FileDropProps {
  required?: boolean;
  accept: Record<string, string[]>;
  maxFiles: number;
  label: string;
  acceptLabel: string;
  info?: string;
  files: File[];
  onUpdate: (files: File[]) => void;
}

const FileDrop: FC<FileDropProps> = ({
  required,
  accept,
  maxFiles,
  label,
  acceptLabel,
  info,
  files,
  onUpdate,
}) => {

  const handleDropFiles = (dropped: File[]) => {
    const arr = [...files];

    if (arr.length + dropped.length <= maxFiles) {
      arr.push(...dropped.map((file) => Object.assign(file)));
      onUpdate(arr);
    }
  };

  const handleRemoveFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const arr = [...files];
    arr.splice(index, 1);
    onUpdate(arr);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDropFiles,
    accept,
    multiple: maxFiles !== 1,
    maxFiles,
    maxSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10000000', 10), // 10MB fallback
  });

  return (
    <div className="mt-6 w-full">
      <div className="relative mb-2">
        {info && (
          <span className="absolute -left-8 sm:-left-12 top-1">
            <InfoPopover content={info} />
          </span>
        )}

        <label className="text-sm font-medium">
          {label}{' '}
          <span className="font-light">
            ({strings.max} {maxFiles} {strings.files}, {strings.maxSize})
          </span>
          {required && ' *'}
        </label>
      </div>

      <div
        {...getRootProps()}
        className="
          bg-white p-4 mb-6 border border-gray-300 
          rounded cursor-pointer text-gray-700
          hover:border-gray-400 transition
        "
      >
        <input {...getInputProps()} />

        {/* Dropzone Text */}
        <div className="text-center mb-4">
          <p className="mt-8 text-sm">{strings.dragAndDrop}</p>
          <p className="font-light text-sm my-3">
            ({acceptLabel})
          </p>
          <hr />
        </div>

        {/* Selected Files */}
        {files.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm mb-2">
              {strings.selectedFiles}:
            </h3>
            <ul className="list-disc ml-5">
              {files.map((file, index) => (
                <li key={index} className="py-2 flex justify-between items-center">
                  <p className="w-48 overflow-hidden text-ellipsis whitespace-nowrap">
                    {file.name}
                  </p>

                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    size="sm"
                    onPress={(e) => handleRemoveFile(index, e as any)}
                    aria-label="remove file"
                  >
                    <XCircle size={20} />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileDrop;
