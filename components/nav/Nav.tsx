"use client";

import React, { FC, useState, useEffect, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Tabs, Tab } from "@heroui/tabs";

import strings from "../strings";
import LoginContext from "@/context/LoginContext";
import MobileDrawer from "@/components/nav/MobileDrawer";
import logo from "@/images/logo-black.png";

interface NavProps {
  secondaryNav?: any;
  onClickSignOut?: () => void;
  feedbackTrigger?: boolean;
}

const Nav: FC<NavProps> = ({
  secondaryNav,
  onClickSignOut,
  feedbackTrigger,
}) => {
  const pathname = usePathname();
  const login = useContext(LoginContext);

  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState(0);

  /**
   * Convert Next.js pathname into selected nav/tab index
   */
  const setNavSelected = (path: string = pathname) => {
    const firstSegment = "/" + (path.split("/")[1] || "");

    switch (firstSegment) {
      case "/about":
        setSelected(1);
        break;
      case "/datasets":
        setSelected(2);
        break;
      case "/submit":
        setSelected(3);
        setTab(0);
        break;
      case "/contributions":
        setSelected(3);
        setTab(1);
        break;
      case "/contracts":
        setSelected(3);
        setTab(2);
        break;
      case "/profile":
      case "/admin":
        setSelected(3);
        setTab(3);
        break;
      case "/auth":
        setSelected(3);
        break;
      default:
        setSelected(0);
    }
  };

  useEffect(() => {
    setNavSelected();
  }, [pathname]);

  useEffect(() => {
    setNavSelected();
  }, [secondaryNav]);

  /**
   * Render main top navigation
   */
  const renderNav = () => (
    <ul className="flex list-none justify-around pl-0">
      <li className="py-6 pr-2 lg:px-3">
        <Link
          href="/"
          className={`link-nav ${selected === 0 ? "text-yellow-500" : "text-darkGrey"}`}
        >
          {strings.navHome}
        </Link>
      </li>
      <li className="py-6 px-2 lg:px-3">
        <Link
          href="/about/about"
          className={`link-nav ${selected === 1 ? "text-yellow-500" : "text-darkGrey"}`}
        >
          {strings.navAbout}
        </Link>
      </li>
      <li className="py-6 px-2 lg:px-3">
        <Link
          href="/datasets"
          className={`link-nav ${selected === 2 ? "text-yellow-500" : "text-darkGrey"}`}
        >
          {strings.navDatasets}
        </Link>
      </li>
      <li className="py-6 pl-2 lg:px-3">
        <Link
          href={login.authenticated ? "/submit" : "/auth/signin"}
          className={`link-nav ${selected === 3 ? "text-yellow-500" : "text-darkGrey"}`}
        >
          {strings.navContribute}
        </Link>
      </li>
    </ul>
  );

  /**
   * Render Contribute sub-nav
   *
   */
  type FeedbackProps = {
    feedbackTrigger: boolean;
  };
  const renderContributeNav = () => (
    <div className="hidden sm:inline absolute w-full top-20 md:top-16 pt-2">
      <Tabs
        selectedKey={tab.toString()}
        onSelectionChange={(key) => setTab(Number(key))}
        className="absolute xl:right-1/2 text-black"
        variant="underlined"
        disableAnimation
      >
        <Tab key="0" title={strings.navSubmit}>
          <Link href="/submit" />
        </Tab>
        <Tab key="1" title={strings.navContributions}>
          <Link href="/contributions" />
        </Tab>
        <Tab key="2" title={strings.navContracts}>
          <Link href="/contracts" />
        </Tab>
        <Tab key="3" title={strings.navProfile}>
          <Link href="/profile" />
        </Tab>
      </Tabs>
    </div>
  );

  return (
    <nav className="w-full bg-white flex justify-around items-center z-30 text-darkGrey py-2 md:py-0">
      {login.authenticated &&
        login.status === "VERIFIED" &&
        selected === 3 &&
        renderContributeNav()}

      <MobileDrawer
        selected={selected}
        onSelect={setSelected}
        onClickSignOut={onClickSignOut}
      />

      {/* Logo */}
      <Link
        href="/"
        className="flex md:w-72 lg:w-80 mr-4 md:mr-20 pl-2 md:pl-5 text-lg text-darkGrey text-left break-words"
      >
        <Image src={logo} alt="ECKO logo" width={118} height={46} />
        <h2 className="sm:hidden md:inline w-40 lg:w-44 font-medium text-sm lg:text-base pt-1 lg:pt-0 pl-2 md:pl-4">
          {strings.siteSubTitle}
        </h2>
      </Link>

      {/* Desktop navigation */}
      <div className="hidden sm:flex">
        {renderNav()}
      </div>
    </nav>
  );
};

export default Nav;
