'use client';

import React, { FC, useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
} from "@heroui/modal";
import{Tabs, Tab} from "@heroui/tabs";
import{Card, CardBody} from "@heroui/card";
import{Button} from "@heroui/button";
import { X, BookOpen } from "lucide-react";

import strings from "../strings";
import useFetch from "@/hooks/useFetch";
import formatDate from "@/utils/format-date";
import AssignRole from "./AssignRole";

interface AdminProps {
  open: boolean;
  onClose: () => void;
}

const Admin: FC<AdminProps> = ({ open, onClose }) => {
  const roles = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/db/roles`);
  const unassigned = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliations/none`);
  const assigned = useFetch(`${process.env.NEXT_PUBLIC_API_URL}/affiliations/assigned`);

  const [requests, setRequests] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState<any | undefined>(undefined);
  const [tab, setTab] = useState("unassigned");

  /** Update requests based on selected tab */
  useEffect(() => {
    if (tab === "assigned") {
      setRequests(assigned);
    } else {
      setRequests(unassigned);
    }
  }, [tab, unassigned, assigned]);

  return (
    <Modal isOpen={open} onClose={onClose} size="2xl" scrollBehavior="inside">
      {/* Header */}
      <ModalHeader className="flex justify-between font-sans">
        {strings.headerUsers}
        <Button
          isIconOnly
          variant="light"
          onPress={onClose}
          aria-label="close dialog"
        >
          <X size={20} />
        </Button>
      </ModalHeader>

      {/* Content */}
      <ModalBody className="font-sans">
        <p className="mb-6">{strings.noAffiliations}</p>

        <Tabs
          selectedKey={tab}
          onSelectionChange={(key) => setTab(key as string)}
          className="mb-6"
          color="primary"
          variant="underlined"
        >
          <Tab key="unassigned" title={strings.labelUnassigned} />
          <Tab key="assigned" title={strings.labelAssigned} />
        </Tabs>

        {/* REQUEST LIST */}
        {requests?.length > 0 ? (
          <div className="space-y-3">
            {requests.map((request) => (
              <Card
                key={request.requestId}
                shadow="sm"
                className="cursor-pointer hover:bg-gray-50"
              >
                <CardBody className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium">{request.name}</p>
                    {request.createdat && (
                      <p className="text-sm text-gray-500">
                        {`${request.role.charAt(0)}${request.role
                          .substring(1)
                          .toLowerCase()
                          .replace(/_/g, " ")}`}
                        {" — "}
                        {formatDate(request.createdat)}
                      </p>
                    )}
                  </div>

                  {/* "More" Button */}
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => setOpenDialog(request)}
                  >
                    <BookOpen size={20} />
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center mb-6">
            {tab === "unassigned" ? strings.noUnassigned : strings.noAssigned}
          </p>
        )}
      </ModalBody>

      {/* ASSIGN ROLE DIALOG */}
      {openDialog && (
        <AssignRole
          open={!!openDialog}
          affiliation={openDialog}
          roles={roles}
          onClose={() => setOpenDialog(undefined)}
          onSuccess={() => {
            setOpenDialog(undefined);
            onClose();
          }}
        />
      )}
    </Modal>
  );
};

export default Admin;
