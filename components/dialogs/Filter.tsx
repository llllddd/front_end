'use client';

import React, { FC, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { Input } from '@heroui/input';
import { X } from 'lucide-react';
import strings from '../strings';

interface FilterProps {
  openDialog: boolean;
  onClose: () => void;
  onUpdate: (filters: any) => void;
}

const Filter: FC<FilterProps> = ({ openDialog, onClose, onUpdate }) => {
  const defaultFormValues = {
    datasetId: '',
    earliestYearCollected: '',
    latestYearCollected: '',
    countries: '',
    continents: '',
    survey: '',
    method: '',
    dataType: '',
    taxa: '',
    habitats: '',
  };

  const [formValues, setFormValues] = useState(defaultFormValues);

  const surveys = [
    { key: 'ORIGINAL', label: strings.original },
    { key: 'RESURVEY', label: strings.resurvey },
    { key: 'COMBINATION', label: strings.combination }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formValues);
    onClose();
  };

  return (
    <Modal
      isOpen={openDialog}
      onClose={onClose}
      backdrop="opaque"
      size="lg"
      scrollBehavior="inside"
      className="font-sans"
    >
      <form onSubmit={handleSubmit}>
        {/* HEADER */}
        <ModalHeader className="flex justify-between items-center">
          {strings.filterShow}
          <Button
            isIconOnly
            variant="light"
            radius="full"
            onPress={onClose}
          >
            <X size={18} />
          </Button>
        </ModalHeader>

        {/* CONTENT */}
        <ModalBody>
          <p className="mb-6">{strings.infoFilter}</p>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4 w-full sm:w-1/2">

              <Input
                label={strings.labelId}
                value={formValues.datasetId}
                onChange={(e) =>
                  setFormValues({ ...formValues, datasetId: e.target.value })
                }
                maxLength={280}
              />

              <div className="flex gap-4">
                <Input
                  type="number"
                  label={strings.labelFrom}
                  value={formValues.earliestYearCollected}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      earliestYearCollected: e.target.value
                    })
                  }
                />
                <Input
                  type="number"
                  label={strings.labelTo}
                  value={formValues.latestYearCollected}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      latestYearCollected: e.target.value
                    })
                  }
                />
              </div>

              <Input
                label={strings.labelCountries}
                value={formValues.countries}
                maxLength={280}
                onChange={(e) =>
                  setFormValues({ ...formValues, countries: e.target.value })
                }
              />

              <Input
                label={strings.labelContinents}
                value={formValues.continents}
                maxLength={280}
                onChange={(e) =>
                  setFormValues({ ...formValues, continents: e.target.value })
                }
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4 w-full sm:w-1/2">

              <Select
                label={strings.labelSurveyType}
                selectedKeys={formValues.survey ? [formValues.survey] : []}
                onSelectionChange={(keys) => {
                  const next = Array.from(keys)[0]?.toString() ?? "";
                  setFormValues({ ...formValues, survey: next });
                }}
              >
                {surveys.map(({ key, label }) => (
                  <SelectItem key={key}>
                    {label}
                  </SelectItem>
                ))}
              </Select>

              <Input
                label={strings.labelTaxa}
                value={formValues.taxa}
                maxLength={280}
                onChange={(e) =>
                  setFormValues({ ...formValues, taxa: e.target.value })
                }
              />

              <Input
                label={strings.labelHabitats}
                value={formValues.habitats}
                maxLength={280}
                onChange={(e) =>
                  setFormValues({ ...formValues, habitats: e.target.value })
                }
              />

            </div>
          </div>
        </ModalBody>

        {/* FOOTER */}
        <ModalFooter>
          <Button color="primary" type="submit" size="lg">
            {strings.filterApply}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default Filter;
