// import { Link, Outlet } from "react-router-dom";
import navbarData from "../data/nav-data";
// import Menu from "../generic/menu.component";
// import Footer from "./footer.component";
import Clock from "../generic/local-current-date-time.component";
// import {
//   EnvelopeOpenIcon,
//   MapPinIcon,
//   PhoneIcon,
// } from "@heroicons/react/24/outline";

import Logo from "../generic/logo.component";
import SriLankaAustraliaCrossFlags from "../generic/sri-lanka-australia-cross-flags.component";
import React, { useMemo } from "react";
// import MenuGenerator from "../generic/menu-generator.component";
import MobileMenu from "../generic/mobile-menu.component";
import MobileMenuIcon from "../generic/mobile-menu-icon.component";
import MobileHeader from "./mobile-header.component";
import MainHeader from "./main-header.component";

// import SVGComponent from "../generic/svg.component";

// import { ReactComponent as myComp } from "/public/lisbon.svg";
// import { useEffect, useRef } from "react";

// import Clock from "../generic/local-current-date-time.component";

// const handleClickMenu = () => {
//   // const ele = document.getElementById("mobileMenu");
//   // ele?.classList.toggle("hidden");
// };

// const handleMenuToggle = () => {
//   const menuBars = document.getElementById("menu-bars");
//   menuBars?.classList.toggle("change");

//   const ele = document.getElementById("mobileMenu");
//   ele?.classList.toggle("hidden");
// };

// type headerProps = {
//   children: React.ReactElement;
// };

// const Header = ({ children }: headerProps) => {
const Header = () => {
  // const targetRef = useRef<HTMLDivElement | null>(null);

  // const memoizedMenu = useMemo(() => )

  // useEffect(() => {
  //   // Scroll to the element when the component mounts or a dependency changes
  //   if (targetRef.current) {
  //     targetRef.current.scrollIntoView({ behavior: "smooth" }); // 'smooth' for animated scroll
  //   }
  // }, []); // Empty dependency array means it runs once on mount

  const ClockMemo = React.memo(Clock);

  const SriLankaAustraliaCrossFlagsMemo = React.memo(
    SriLankaAustraliaCrossFlags
  );

  const LogoMemo = React.memo(Logo);

  return (
    <>
      <div
        id="header"
        // ref={targetRef}
        className="container h1-screen w-screen max-w-full overflow1-scroll overflow-hidden bg-[#EED3CC] border1-4 border1-red-400"
      >
        {/* mobile menu  */}
        <div className="md:hidden justify-end relative">
          <MobileMenuIcon />
        </div>

        {/* main menu */}
        {/*  
          min-[540px]:min-h-[27%] for px 540 mobile 540X720 Surface Pro
          min-[664px]:min-h-[33%] xxs:min-h-[170px] (IPhone SE)       
        */}

        <nav
          id="main"
          className="rounded-lg overflow-hidden p-2 bg-[#7F1734] 
          sticky z-40 top-0 mx-auto h-[20%] md:h1-[20%] max-w-full 
          bg-cover bg-center 1shadow-[0px_10px_8px_0px_rgba(170,_83,_64,_0.7)] 
          shadow-[0px_8px_8px_0px_rgba(0,_0,_0,_0.7)] 
          xxs:min-h-[170px] border-2 border-white border1-4 border1-blue-400"
        >
          <MainHeader
            logoMemo={<LogoMemo />}
            sriLankaAustraliaCrossFlagsMemo={
              <SriLankaAustraliaCrossFlagsMemo />
            }
            clock={<ClockMemo />}
            data={navbarData}
          />

          {/* mobile hedader with address details and logo */}

          <MobileHeader
            logoMemo={<LogoMemo />}
            sriLankaAustraliaCrossFlagsMemo={
              <SriLankaAustraliaCrossFlagsMemo />
            }
            clock={<Clock />}
          />

          {/* mobile hedader with address details and logo 
              mobile horizontal display
              664px width: (667X375 resolution)
              540px width: (540X720 resolution)
              hidden for all mobile (from xxs) and above
          */}

          <div
            className="w-[100%] min-[667px]:flex flex-row justify-between xxs:hidden md:hidden 
                           mb-2 h-[60%] bg-white"
          >
            <MobileHeader
              logoMemo={<LogoMemo />}
              sriLankaAustraliaCrossFlagsMemo={
                <SriLankaAustraliaCrossFlagsMemo />
              }
              clock={<Clock />}
            />
          </div>

          {/* end of 664px width: (667X375 resolution) */}
        </nav>

        {/* Mobile menu */}
        {/* upto max 720px (small, medium, large) */}

        <MobileMenu data={navbarData} />

        {/* end Mobile menu */}
      </div>
    </>
  );
};

export default Header;
