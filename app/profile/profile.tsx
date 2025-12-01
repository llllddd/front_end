"use client";

import { useAuth } from "@/auth/auth-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "@heroui/modal";
import { Avatar } from "@heroui/avatar";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function ProfilePage() {
  const { login, signOut } = useAuth();
  const router = useRouter();

  const [openChangeAffiliation, setOpenChangeAffiliation] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openChangeEmail, setOpenChangeEmail] = useState(false);

  function handleDeleteProfile() {
    // 触发你的自定义逻辑
    alert("TODO: implement delete profile logic");
  }

  return (
    <main className="mx-auto max-w-xl p-6 space-y-6">
      <Card shadow="sm">
        <CardHeader className="flex items-center gap-3">
          <Avatar
            showFallback
            name={login.name}
            size="lg"
            className="bg-primary text-white"
          />
          <div>
            <h2 className="text-lg font-semibold">{login.name}</h2>
            <p className="text-sm text-default-500">{login.email}</p>
          </div>
        </CardHeader>

        <CardBody className="space-y-4">
          {/* ORCID */}
          <div className="flex items-center gap-2">
            <span className="font-medium">ORCID:</span>
            <a
              href={`https://orcid.org/${login.orcid}`}
              target="_blank"
              className="text-primary underline"
            >
              {login.orcid}
            </a>

            <Tooltip content="Edit Email">
              <Button
                size="sm"
                isIconOnly
                onPress={() => setOpenChangeEmail(true)}
              >
                {/* <EditIcon fontSize="small" /> */}
              </Button>
            </Tooltip>
          </div>

          {/* Organization */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Organization:</span>
            <span>{login.organization ?? "Unaffiliated"}</span>

            {login.role === "ADMIN" && (
              <Tooltip content="Admin Tools">
                <Button
                  size="sm"
                  isIconOnly
                  onPress={() => setOpenAdmin(true)}
                >
                  {/* <GroupAddIcon fontSize="small" /> */}
                </Button>
              </Tooltip>
            )}
          </div>

          {/* Role */}
          {login.role && (
            <div>
              <span className="font-medium">Role:</span>{" "}
              {login.role.toLowerCase().replace(/_/g, " ")}
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex gap-4">
            {/* <Button
              color="primary"
              endContent={<BusinessIcon />}
              onPress={() => setOpenChangeAffiliation(true)}
            >
              Change Affiliation
            </Button> */}

            <Button
              color="danger"
              variant="light"
              onPress={handleDeleteProfile}
            >
              Delete Profile
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Admin Modal */}
      <Modal isOpen={openAdmin} onOpenChange={setOpenAdmin}>
        <ModalHeader>Admin Panel</ModalHeader>
        <ModalBody>
          <p>TODO: Admin functions...</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={() => setOpenAdmin(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Change Email Modal */}
      <Modal isOpen={openChangeEmail} onOpenChange={setOpenChangeEmail}>
        <ModalHeader>Change Email</ModalHeader>
        <ModalBody>
          <p>TODO: Implement change email form</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={() => setOpenChangeEmail(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </main>
  );
}
