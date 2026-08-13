import { Link, Outlet } from "react-router-dom";
import navbarData from "../data/nav-data";
import Menu from "../generic/menu.component";
import Footer from "./footer.component";
import Clock from "../generic/local-current-date-time.component";
import {
  EnvelopeOpenIcon,
  MapPinIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

import Logo from "../generic/logo.component";
import SriLankaAustraliaCrossFlags from "../generic/sri-lanka-australia-cross-flags.component";

// import SVGComponent from "../generic/svg.component";

// import { ReactComponent as myComp } from "/public/lisbon.svg";
// import { useEffect, useRef } from "react";

// import Clock from "../generic/local-current-date-time.component";

// const handleClickMenu = () => {
//   // const ele = document.getElementById("mobileMenu");
//   // ele?.classList.toggle("hidden");
// };

const handleMenuToggle = () => {
  const menuBars = document.getElementById("menu-bars");
  menuBars?.classList.toggle("change");

  const ele = document.getElementById("mobileMenu");
  ele?.classList.toggle("hidden");
};

const Header = () => {
  return (
    <>
      <div
        id="header"
        // ref={targetRef}
        className="container bg-[#f5f5] border-4 border-green-300"
      >
        {/* main menu */}
        {/*  
          min-[540px]:min-h-[27%] for px 540 mobile 540X720 Surface Pro
          min-[664px]:min-h-[33%] xxs:min-h-[170px] (IPhone SE)       
        */}

        <nav
          id="main"
          className="rounded1-lg overflow1-hidden p1-2 bg-[#7F1734] border1-stone-200 
          shadow1-stone-950/5 sticky z-40 
          top-0 
          mx-auto 
          h1-[20%] 
          md:h1-[25%] max-w-full 
          bg1-cover bg1-center 
          min1-[664px]:min-h-[33%] xxs:min1-h-[170px]
          md:min1-h-[200px] border-[1px] 
          min1-[540px]:min-h-[27%]"
        >
          <div className="hidden md:flex border-4 border-yellow-200">
            <div className="flex w-[100%] bg1-white bg-[#7F1734]">
              {/* logo column sm:10%, md:10%, lg:15%, XL: 20%, 2xl:15% */}
              <div
                className="hidden md:flex w-[10%] md:w1-[15%] lg:w1-[11%] xl:w1-[12%] 
                           2xl:w1-[19%] mt1-2 p1-1 border-4 border-green-500"
              >
                <div className="flex w-[100%] mx-auto bg-white h-[80%] border-4 border-blue-500">
                  <Link to="/">
                    <Logo />
                  </Link>
                </div>
              </div>

              {/* menu with address details lg:85% (15, & 85)  md:80% (10,90) xl:70% (20,80), 2xl:80% (15,85) */}

              <div className="hidden md:block w-full h-full border1-white bg-white border-4 border-blue-400">
                <div
                  className="w-[80%] md:w-[80%] lg:w-[85%] xl:w-[80%] 2xl:w-[80%] 
                               flex my1-1 mx-auto bg-[#7F1734] border-4 border-green-500"
                >
                  <div className="flex w-[10%] md:w-[10%] lg:w-[10%] xl:w-[20%] 2xl:w-[15%] items-center border-4 border-yellow-500"></div>
                  <div className="flex w-[90%] border-4 border-yellow-500">
                    <div
                      className="flex flex-col 
                              w-[50%] md:w1-[90%] lg:w1-[90%] xl:w1-[90%] 2xl:w1-[85%] 
                               text-[0.7em] md:text-[0.6em] lg:text-[.5em] xl:text-[.5em] 2xl:text-[1em]
                               items-center my-2 mr-2"
                    >
                      <div className="flex w-[100%] gap-x-1 text-[#000]">
                        <div
                          className="flex md:w-[30%] lg:w-[25%] xl:w-[20%] 2xl:w-[20%] rounded1-md border-4 border-yellow-200
                                   shadow-md justify-center text-center border-1 border1-white bg-[#fff] items-center"
                        >
                          <div>
                            <div>
                              <PhoneIcon className="h-4 w-4 lg:h-8 lg:w-8 text-[#B22222] mr-3 border-4 border-yellow-200" />
                            </div>
                          </div>
                          <div>07 1234 5678</div>
                        </div>
                        <div
                          className="flex md:w-[50%] lg:w-[40%] xl:w-[40%] 2xl-[30%] rounded-md border-4 border-yellow-200
                                   shadow-md justify-center text-center border-1 border1-white bg-[#fff] items-center"
                        >
                          <div>
                            <EnvelopeOpenIcon className="h-4 w-4 lg:h-8 lg:w-8 text-[#B22222] mr-3 border-4 border-yellow-200" />
                          </div>
                          <div>secretary@srilankansqld.org</div>
                        </div>
                        <div
                          className="flex md:w-[40%] gl:w-[40%] xl:w-[40%] 2xl-[50%] rounded-md shadow-md justify-center 
                                   text-center border-1 border1-white bg-[#fff] items-center border-4 border-yellow-200"
                        >
                          <div>
                            <div>
                              <MapPinIcon className="h-4 w-4 lg:h-8 lg:w-8 text-[#B22222] mr-3 border-4 border-yellow-200" />
                            </div>
                          </div>
                          <div>CITY EAST QLD, Queensland, AUSTRALIA</div>
                        </div>
                      </div>

                      <div
                        className="flex flex1-grow w-[100%] rounded-md shadow-md justify-center text-center 
                                  border-1 border-white bg-[#fff] font-bold mt-1"
                      >
                        <div className="flex w-[40%] lg:w-[55%] xl:w-[50%] 2xl:w-[50%] justify-end"></div>
                        <div className="flex w-[60%] lg:w-[45%] xl:w-[50%] 2xl:w-[50%]  lg:text-[60%] xl:text-[70%] md:text-[100%]">
                          <div className="w-[40%] text-right my-auto">
                            Colombo Time:
                          </div>
                          <div className="w-[60%]">{<Clock />}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* end logo column */}

                <div
                  className="rounded-tl-[20px] rounded-tr-[20px] bg-[#7F1734] m-auto py1-2 h1-[100%]
                border-4 border-blue-700
                "
                >
                  <div className="flex flex-1 items-center h-full justify-between border-4 border-green-800">
                    <nav
                      id="main-menu"
                      className="hidden md:flex flex-1 items1-center justify-around border1-[1px] w1-full 
                                 text-sm md:text-[0.5em] lg:text-[0.8em] xl:text-[0.9em] md:mx1-[2%] 2xl:text-[1em] 
                                 lg:mx1-[5%] xl:mx1-[10%] 2xl:mx1-[8%] 
                                 rounded1-[14px] bg-[#800000] shadow1-[0px_4px_6px_0px_rgba(0,_0,_0,_0.7)]
                               text-[#fff] font1-semibold font-roboto border-4 border-orange-700"
                    >
                      <ul className="flex flex-1 text-center justify-between border-4 border-yellow-200">
                        {navbarData.map((menu) => {
                          return (
                            <Menu
                              label={menu.label}
                              submenu={menu.subMenus}
                              routerLink={menu.routerLink}
                              icon={menu.icon}
                              classname={"menu"}
                              handleClick={() => {}}
                              key={menu.label}
                            />
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
              <div className="w-[10%] md:w1-[15%] lg:w1-[15%] xl:w1-[15%] 2xl:w1-[15%] flex bg-white  border-4 border-green-500">
                <div
                  className="w1-full m1-auto hidden md:flex md:w1-[100%] md:items1-start md:mt1-5
                                lg:w1-[100%] 
                                xl:w1-[100%] 
                                2xl:w1-[100%] h-[80%] border-4 border-blue-500"
                >
                  <SriLankaAustraliaCrossFlags />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}

        {/* end Mobile menu */}

        {/* footer and content */}
        <div className="flex flex-col w-full pt-10 h-full bg-[#EED3CC]">
          <Outlet />
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default Header;
