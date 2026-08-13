import Menu from "../generic/menu.component";
import navbarData from "../data/nav-data";

import Clock from "../generic/local-current-date-time.component";
import MenuGenerator from "../generic/menu-generator.component";
import React from "react";

const formatDate = () => new Date().toLocaleDateString();

const handleClickMenu = () => {
  const ele = document.getElementById("mobileMenu");
  ele?.classList.toggle("hidden");
};

const Footer = ({ clock }: { clock: React.ReactElement }) => {
  // const ClockMemo = React.memo(Clock);
  return (
    <>
      <div
        className="w-[100%] bg-[#470000] text-[#fff] h-[655px] md:h-[400px] lg:h-auto 
                      shadow-[inset_0px_5px_15px_-3px_rgba(0,_0,_0,_0.2)]"
      >
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row w-full">
            <div className="flex flex-col md:flex-row w-[100%] md:w-[70%] md:mt-5">
              <div className="w-[35%] mt-3 md:mt-0 mx-auto md:w-[30%] m1-auto md:ml-[10%]">
                <ul
                  id="footer-menu"
                  className="flex flex-col leading-6 list-none"
                >
                  <MenuGenerator
                    data={navbarData}
                    classname={"cursor-pointer text-center"}
                  />
                  {/* {navbarData.map((menu) => {
                    return (
                      <Menu
                        label={menu.label}
                        submenu={menu.subMenus}
                        routerLink={menu.routerLink}
                        icon={menu.icon}
                        classname="cursor-pointer text-center"
                        handleClick={() => handleClickMenu}
                        key={menu.label}
                      />
                    );
                  })} */}
                </ul>
              </div>
              <div className="w-[100%] md:w-[70%] justify-around text-center my-5 md:my-0">
                <div>
                  &copy; {formatDate()} Sri Lanka Society of Queensland Inc.
                </div>
                <div>&copy; All rights reserved.</div>

                <div className="flex items-center m-auto">
                  <div className="flex flex-grow m1-auto">
                    <div className="flex w-[40%] justify-end md:justify-end md:w-[40%] lg:w-[45%] mr-2 text-[70%] md:text-[100%]">
                      Colombo Time:
                    </div>
                    <div className="flex w-[60%] md:w-[60%] lg:w-[55%] justify-start text-[70%] md:text-[100%]">
                      {/* {<Clock />} */}
                      {/* {<ClockMemo />} */}
                      {clock}
                    </div>
                  </div>
                </div>
                {/* <div>
                  <Menu
                    key={"admin"}
                    submenu={null}
                    icon={""}
                    label={"Administrator"}
                    routerLink={"admin"}
                    handleClick={() => handleClickMenu}
                    classname={"cursor-point text-center"}
                  />
                </div> */}
              </div>
            </div>
            <hr className="ml-1 mr-1.5 hidden h-100 w-px border-l border-t-0 border-secondary-dark" />
            <div className="flex flex-col w-[100%] md:w-[30%] py-5 text-center">
              <div className="m-auto">
                <div>
                  <p className="m-auto">Secretary</p>
                  <p className="m-auto">Sri Lanka Society of Queensland.</p>
                  <p className="m-auto">PO Box 15099,</p>
                  <p className="m-auto">CITY EAST QLD 4002.</p>
                </div>
                <div>
                  <div>
                    <p className="m-auto">
                      electronic mail : secretary&#64;srilankansqld.org
                    </p>
                  </div>

                  <div className="mt-2 mb-2 md:mb-0 md:mt-10 text-xs">
                    Developed by Thusith Kathaluwage using react
                    (v19)/typescript.♥️
                  </div>
                  <hr className="mx-5 border-1 border-gray-500" />
                </div>

                {/* this is a border with elephant display in mobile*/}
                <div
                  id="border-wrapper"
                  className="flex flex-col md:hidden w-[100%] h-[65px]"
                >
                  <div className="flex h-[100%]">
                    <div id="left-image" className="w-[50%]"></div>
                    <div id="right-image" className="w-[50%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* this is a border with elephant display */}
          <div
            id="border-wrapper"
            className="hidden md:flex flex-col w-[100%] md:h-[145px] 2xl:h-[130px] xl:h-[155px]"
          >
            <div className="flex h-[100%]">
              <div id="left-image" className="w-[50%]"></div>
              <div id="right-image" className="w-[50%]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
