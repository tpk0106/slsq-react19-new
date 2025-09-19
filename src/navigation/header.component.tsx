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
  // const targetRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   // Scroll to the element when the component mounts or a dependency changes
  //   // if (targetRef.current) {
  //   //   targetRef.current.scrollIntoView({ behavior: "smooth" }); // 'smooth' for animated scroll
  //   // }
  // }, []); // Empty dependency array means it runs once on mount

  return (
    <>
      <div
        id="header"
        // ref={targetRef}
        className="container h-screen w-screen max-w-full overflow-scroll bg-[#EED3CC]"
      >
        <div className="md:hidden justify-end z1-[51] absolute1 relative">
          {/* mobile menu  */}

          <div
            className="menu-bars"
            id="menu-bars"
            onClick={() => handleMenuToggle()}
          >
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        </div>

        {/* main menu */}
        {/*  
          min-[540px]:min-h-[27%] for px 540 mobile 540X720 Surface Pro
          min-[664px]:min-h-[33%] xxs:min-h-[170px] (IPhone SE)       
        */}

        <nav
          id="main"
          className="rounded-lg 1shadow-lg overflow-hidden p-2 bg-[#7F1734] border-stone-200 
          shadow-stone-950/5 sticky z-40 top-0 mx-auto h-[20%] md:h-[25%] max-w-full 
          bg-cover bg-center shadow-[0px_10px_20px_0px_rgba(170,_83,_64,_0.7)] 
          min-[664px]:min-h-[33%] xxs:min-h-[170px]
          md:min-h-[200px] border-[1px] 
          min-[540px]:min-h-[27%]"
        >
          <div className="hidden md:flex">
            <div className="flex w-[100%] border1-4 border1-blue-500 bg-white">
              {/* logo column sm:10%, md:10%, lg:15%, XL: 20%, 2xl:15% */}
              <div
                className="hidden md:flex w-[10%] md:w-[15%] lg:w-[11%] xl:w-[12%] 
                           2xl:w-[19%] mt-2 p-1"
              >
                <div className="flex w-[100%] mx-auto">
                  <Link to="/">
                    <Logo />
                  </Link>
                </div>
              </div>

              {/* menu with address details lg:85% (15, & 85)  md:80% (10,90) xl:70% (20,80), 2xl:80% (15,85) */}

              <div className="hidden md:block w-full border-white bg-white">
                <div
                  className="w-[80%] md:w-[80%] lg:w-[85%] xl:w-[80%] 2xl:w-[80%] 
                               flex my-1 mx-auto bg-[#7F1734]"
                >
                  <div className="flex w-[20%] md:w-[10%] lg:w-[10%] xl:w-[20%] 2xl:w-[15%] items-center"></div>

                  <div
                    className="flex flex-col 
                              w-[50%] md:w-[90%] lg:w-[90%] xl:w-[80%] 2xl:w-[85%] 
                               text-[0.7em] md:text-[0.6em] lg:text-[.7em] xl:text-[.9em] 2xl:text-[1.3em]
                               items-center my-2 mr-2"
                  >
                    <div className="flex w-[100%] gap-x-1 text-[#000]">
                      <div
                        className="flex md:w-[30%] lg:w-[25%] xl:w-[20%] 2xl:w-[20%] rounded-md 
                                   shadow-md justify-center text-center border-1 border-white bg-[#fff] items-center"
                      >
                        <div>
                          <div>
                            <PhoneIcon className="h-4 w-4 lg:h-8 lg:w-8 text-[#B22222] mr-3" />
                          </div>
                        </div>
                        <div>07 1234 5678</div>
                      </div>
                      <div
                        className="flex md:w-[50%] lg:w-[40%] xl:w-[40%] 2xl-[30%] rounded-md 
                                   shadow-md justify-center text-center border-1 border-white bg-[#fff] items-center"
                      >
                        <div>
                          <EnvelopeOpenIcon className="h-4 w-4 lg:h-8 lg:w-8 text-[#B22222] mr-3" />
                        </div>
                        <div>secretary@srilankansqld.org</div>
                      </div>
                      <div
                        className="flex md:w-[40%] gl:w-[40%] xl:w-[40%] 2xl-[50%] rounded-md shadow-md justify-center 
                                   text-center border-1 border-white bg-[#fff] items-center"
                      >
                        <div>
                          <div>
                            <MapPinIcon className="h-4 w-4 lg:h-8 lg:w-8 text-[#B22222] mr-3" />
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
                      <div
                        className="flex w-[60%] lg:w-[45%] xl:w-[50%] 2xl:w-[50%] text-[70%] md:text-[100%] 
                                      right1-0 justify1-end"
                      >
                        <div className="mr-2">Colombo Time:</div>
                        <div>{<Clock />}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* end logo column */}

                <div
                  className="border1-4 border1-red-500 w1-[100%] rounded-tl-[20px] 
                                rounded-tr-[20px] bg-[#7F1734] m-auto py-2 h-[100%]"
                >
                  <div className="flex flex-1 items-center justify-between">
                    <nav
                      id="main-menu"
                      className="hidden md:flex flex-1 items-center justify-around border-[1px] w-full 
                                 text-sm md:text-[0.7em] lg:text-[0.8em] xl:text-[0.9em] md:mx-[2%] 2xl:text-[1em] 
                                 lg:mx-[5%] xl:mx-[10%] 2xl:mx-[8%] 
                                 rounded-[14px] bg-[#800000] shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.7)]
                               text-[#fff] font-semibold font-roboto"
                    >
                      <ul className="flex flex-1 text-center justify-between">
                        {navbarData.map((menu) => {
                          return (
                            <Menu
                              label={menu.label}
                              submenu={menu.subMenus}
                              routerLink={menu.routerLink}
                              icon={menu.icon}
                              classname={undefined}
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
              <div className="w-[10%] md:w-[15%] lg:w-[15%] xl:w-[15%] 2xl:w-[15%] flex bg-white">
                <div
                  className="w-full m-auto hidden md:flex md:w-[100%] md:items-start md:mt-5
                                lg:w-[100%] 
                                xl:w-[100%] 
                                2xl:w-[100%]"
                >
                  <SriLankaAustraliaCrossFlags />
                </div>
              </div>
            </div>
          </div>

          {/* mobile hedader with address details and logo */}
          <div className="flex w-[90%] flex-col min-[664px]:hidden mx-auto mb-2">
            <div className="flex w-[100%] mx-auto bg-white">
              <Link to="/" className="flex align-middle p-1">
                <div className="w-[15%] auto">
                  <Logo />
                </div>
              </Link>
              <div className="w-[35%] auto m-0 p-1">
                <SriLankaAustraliaCrossFlags />
              </div>
            </div>

            <div className="bg-[#7F1734] py-2">
              <div className="flex flex-col w-[80%] gap-x-1 text-[#000] text-[0.7em] m-auto gap-y-1">
                <div
                  className="flex rounded-sm shadow-sm justify-center text-center border-1 border-white 
                              bg-[#fff] items-center xxs:mx-2 xs:mx-0"
                >
                  <div>
                    <div>
                      <PhoneIcon className="h-4 w-4 justify-start mr-3 text-[#B22222]" />
                    </div>
                  </div>
                  <div>07 1234 5678</div>
                </div>
                <div
                  className="flex rounded-sm shadow-md justify-center text-center border-1 
                              border-white bg-[#fff] items-center xxs:mx-2 xs:mx-0"
                >
                  <div>
                    <EnvelopeOpenIcon className="h-4 w-4 mr-3 text-[#B22222]" />
                  </div>
                  <div>secretary@srilankansqld.org</div>
                </div>
                <div
                  className="flex rounded-sm shadow-md justify-center text-center border-1 
                              border-white bg-[#fff] items-center xxs:mx-2 xs:mx-0"
                >
                  <div>
                    <div>
                      <MapPinIcon className="h-4 w-4 mr-3 text-[#B22222]" />
                    </div>
                  </div>
                  <div>CITY EAST QLD, Queensland, AUSTRALIA</div>
                </div>
              </div>
            </div>

            <div
              className="flex w-[80%] rounded-sm shadow-md justify-center text-center mx-auto
                                  border-1 border-white bg-[#fff] font-bold pt-1"
            >
              <div className="flex w-[100%] xxs:text-[50%] text-[70%]">
                <div className="flex w-[40%]  justify-end">Colombo Time:</div>
                <div className="flex-grow w-[60%]">{<Clock />}</div>
              </div>
            </div>
          </div>

          {/* mobile hedader with address details and logo 
              mobile horizontal display
              664px width: (667X375 resolution)
              hidden for all mobile (from xxs) and above
          */}
          <div className="w-[90%] min-[664px]:flex flex-row xxs:hidden md:hidden mx1-auto mb-2 h-[70%] bg-white">
            <div className="flex w-[20%] m-auto bg-white p-1">
              <Link to="/" className="flex align-middle p-1 w-full">
                <div className="w-[60%] auto mx-auto">
                  <Logo />
                </div>
              </Link>
            </div>

            <div className="w-[60%] bg-[#7F1734] py-2 m-auto">
              <div className="flex flex-col w-[70%] gap-x-1 text-[#000] text-[0.7em] m-auto gap-y-1">
                <div
                  className="flex rounded-sm shadow-sm justify-center text-center border-1 border-white 
                              bg-[#fff] items-center xxs:mx-2 xs:mx-0"
                >
                  <div>
                    <div>
                      <PhoneIcon className="h-4 w-4 justify-start mr-3 text-[#B22222]" />
                    </div>
                  </div>
                  <div>07 1234 5678</div>
                </div>
                <div
                  className="flex rounded-sm shadow-md justify-center text-center border-1 
                              border-white bg-[#fff] items-center xxs:mx-2 xs:mx-0"
                >
                  <div>
                    <EnvelopeOpenIcon className="h-4 w-4 mr-3 text-[#B22222]" />
                  </div>
                  <div>secretary@srilankansqld.org</div>
                </div>
                <div
                  className="flex rounded-sm shadow-md justify-center text-center border-1 
                              border-white bg-[#fff] items-center xxs:mx-2 xs:mx-0"
                >
                  <div>
                    <div>
                      <MapPinIcon className="h-4 w-4 mr1-3 text-[#B22222]" />
                    </div>
                  </div>
                  <div>CITY EAST QLD, Queensland, AUSTRALIA</div>
                </div>
              </div>
              <div
                className="flex w-[80%] rounded-sm shadow-md justify-center text-center mx-auto
                                  border-1 border-white bg-[#fff] font-bold pt-1 mt-1"
              >
                <div className="flex w-[100%] xxs:text-[50%] text-[70%]">
                  <div className="flex w-[40%]  justify-end">Colombo Time:</div>
                  <div className="flex-grow w-[60%] ">{<Clock />}</div>
                </div>
              </div>
            </div>
            <div className="flex w-[20%]">
              <div className="flex w-[90%]">
                <div className="w-[100%] auto m-0">
                  <SriLankaAustraliaCrossFlags />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}

        <div id="mobile-header" className="flex">
          <div className="flex w-[100%] justify-around">
            <div className="flex justify-center w-[400px]">
              <nav
                id="mobileMenu"
                className="hidden flex-col absolute mt-0 border-[1px] w-[200px] text-sm rounded-[14px] 
                          bg-[#800000] shadow-[0px_10px_20px_0px_rgba(170,_83,_64,_0.7)]                            
                          text-[#FFCCCC] font-semibold font-roboto z-[100]"
              >
                <ul className="rounded-[14px]">
                  {navbarData.map((menu) => {
                    return (
                      <Menu
                        label={menu.label}
                        submenu={menu.subMenus}
                        routerLink={menu.routerLink}
                        icon={menu.icon}
                        classname={undefined}
                        handleClick={() => handleMenuToggle()}
                        key={menu.label}
                      />
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        {/* end Mobile menu */}

        {/* footer and content */}
        <div className="flex flex-col w-full pt-10 h-full bg-[#EED3CC]">
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Header;
