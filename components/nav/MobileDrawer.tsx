'use client';

import React, { FC, useState, useContext } from 'react';
import Link from 'next/link';
import { Drawer, DrawerContent, DrawerBody, DrawerHeader } from "@heroui/drawer";
import { Menu } from "lucide-react";

import LoginContext from '@/context/LoginContext';
import strings from '../strings';

interface MobileDrawerProps {
  selected: number;
  onSelect: (value: number) => void;
  onClickSignOut?: () => void;
}

const MobileDrawer: FC<MobileDrawerProps> = ({ selected, onSelect, onClickSignOut }) => {
  const { login } = useContext(LoginContext);
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  /**
   * Render each drawer item
   */
  const DrawerItem = ({
    href,
    label,
    index,
    small,
    indent,
    onClick,
  }: {
    href: string;
    label: string;
    index?: number;
    small?: boolean;
    indent?: boolean;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      onClick={() => {
        if (index !== undefined) onSelect(index);
        close();
        onClick?.();
      }}
      className={`block py-3 ${indent ? 'ml-4' : ''}`}
    >
      <span
        className={`${
          small ? 'text-xs' : 'text-sm'
        } pl-2 link-drawer ${
          index !== undefined && selected === index
            ? 'text-yellow-500'
            : 'text-darkGrey'
        }`}
      >
        {label}
      </span>
    </Link>
  );

  return (
    <div className="sm:hidden left-0 w-full ml-4">
      {/* Button to open drawer */}
      <button onClick={() => setOpen(true)} className="p-2">
        <Menu size={32} />
      </button>

      {/* Drawer */}
      <Drawer isOpen={open} onOpenChange={setOpen} placement="left">
        <DrawerContent>
          <DrawerHeader className="text-lg font-semibold">
            {strings.navigation}
          </DrawerHeader>

          <DrawerBody className="font-sans">

            {/* MAIN LINKS */}
            <DrawerItem href="/" label={strings.navHome} index={0} />

            <DrawerItem href="/about/about" label={strings.navAbout} index={1} />
            <DrawerItem
              href="/about/whatis"
              label={`- ${strings.navWhatIs}`}
              small
              indent
            />
            <DrawerItem
              href="/about/privacy"
              label={`- ${strings.navPrivacy}`}
              small
              indent
            />

            <DrawerItem
              href="/datasets"
              label={strings.navDatasets}
              index={2}
            />

            <hr className="my-4" />

            {/* CONTRIBUTE + AUTH BLOCK */}
            <DrawerItem
              href="/submit"
              label={login.authenticated ? strings.navSubmit : strings.navContribute}
              index={3}
            />

            {login.authenticated && (
              <>
                <DrawerItem
                  href="/contributions"
                  label={strings.navContributions}
                  index={5}
                />
                <DrawerItem
                  href="/contracts"
                  label={strings.navContracts}
                  index={4}
                />
                <DrawerItem
                  href="/profile"
                  label={strings.navProfile}
                  index={6}
                />

                <div className="mt-10">
                  <DrawerItem
                    href="/"
                    label={strings.signOut}
                    onClick={onClickSignOut}
                  />
                </div>
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileDrawer;
