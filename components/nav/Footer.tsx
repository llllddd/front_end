'use client';

import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar"
import strings from '../strings';
import logo from '@/images/logo-white.png';
import { form } from '@heroui/theme';

interface FooterProps {
  onNavSelect?: () => void;
}

const Footer: FC<FooterProps> = ({ onNavSelect }) => {
  return (
    <footer className="bg-mainDark w-full py-10 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start px-6">

        {/* Left logo + subtitle */}
        <NavbarBrand
          as={Link}
          href="/"
          onClick={() => onNavSelect?.()}
          className="flex items-center mb-6 lg:mb-0"
        >
          <Image
            src={logo}
            alt="ECKO logo"
            width={118}
            height={46}
          />
          <h2 className="text-white font-medium text-sm lg:text-base pl-4 w-44">
            {strings.siteSubTitle}
          </h2>
        </NavbarBrand>

        {/* Right navigation */}
        <NavbarContent className="flex gap-6 text-white text-sm lg:text-base">
          <NavbarItem>
            <Link
              href="/"
              onClick={() => onNavSelect?.()}
              className="hover:text-yellow-500"
            >
              {strings.navHome}
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/about/about"
              onClick={() => onNavSelect?.()}
              className="hover:text-yellow-500"
            >
              {strings.navWhatIs}
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/about/privacy"
              onClick={() => onNavSelect?.()}
              className="hover:text-yellow-500"
            >
              {strings.navPrivacy}
            </Link>
          </NavbarItem>

          <NavbarItem>
            <Link
              href="/about/about"
              onClick={() => onNavSelect?.()}
              className="hover:text-yellow-500"
            >
              {strings.navContact}
            </Link>
          </NavbarItem>
        </NavbarContent>
      </div>
    </footer>
  );
};

export default Footer;
