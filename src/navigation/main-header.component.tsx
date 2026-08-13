import React from "react";
import { Link } from "react-router-dom";
import MenuGenerator from "../generic/menu-generator.component";

type HeaderProps = {
  logoMemo: React.ReactElement;
  sriLankaAustraliaCrossFlagsMemo: React.ReactElement;
  clock: React.ReactElement;
  data: NavData[];
};

type NavData = {
  routerLink: string;
  element: () => React.ReactElement;
  icon: string;
  label: string;
  subMenus: null;
};

// type NavbarData = {
//   data: NavData[];
// };

const MainHeader = ({
  logoMemo,
  sriLankaAustraliaCrossFlagsMemo,
  clock,
  data,
}: HeaderProps) => {
  return (
    <>
      <div className="hidden md:flex">
        <div className="flex w-[100%] bg-white">
          {/* logo column sm:10%, md:10%, lg:15%, XL: 20%, 2xl:15% */}
          <div
            className="hidden md:flex w-[10%] md:w-[15%] lg:w-[11%] xl:w-[12%] 
                           2xl:w-[19%] mt-2 p-1"
          >
            <div className="flex w-[100%] mx-auto">
              {/* <Link to="/"><Logo /></Link> */}
              <Link to="/">{logoMemo}</Link>
            </div>
          </div>

          {/* menu with address details lg:85% (15, & 85)  md:80% (10,90) xl:70% (20,80), 2xl:80% (15,85) */}

          <div className="hidden md:block w-full border-white bg-white">
            <div
              className="w-[80%] md:w-[80%] lg:w-[85%] xl:w-[80%] 2xl:w-[80%] 
                               flex my-1 mx-auto bg-[#7F1734]"
            >
              <div className="flex w-full border-2 border-white m-1">
                <div className="flex w-[20%] md:w-[10%] lg:w-[10%] xl:w-[20%] 2xl:w-[15%] items-center"></div>

                <div
                  className="flex flex-col 
                              w-[50%] md:w-[90%] lg:w-[90%] xl:w-[80%] 2xl:w-[85%] 
                               text-[0.7em] md:text-[0.6em] lg:text-[.7em] xl:text-[.5em] 2xl:text-[1em]
                               items-center px-[1%]"
                >
                  <div
                    className="flex flex1-grow w-[100%] rounded-md shadow-md justify-center text-center 
                                  border-1 border1-white bg-[#fff] font-bold h-25 py-2 m-2"
                  >
                    <div className="flex w-[40%] lg:w-[55%] xl:w-[50%] 2xl:w-[50%] justify-end"></div>
                    <div
                      className="flex w-[60%] lg:w-[45%] xl:w-[50%] 2xl:w-[50%]
                                   text-base md:text-[0.5rem] lg:text-[0.7rem] xl:text-[1rem] m-0"
                    >
                      <div className="flex w-full m-0">
                        <div className="w-[40%] text-right">Colombo Time:</div>
                        {/* <div className="w-[60%]">{children}</div> */}
                        <div className="w-[60%]">{clock}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* end logo column */}

            <div className="rounded-tl-[20px] rounded-tr-[20px] bg-[#7F1734] m-auto py-2 h-[100%]">
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
                    {/* {children} */}
                    <MenuGenerator data={data} classname="" />
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
              {sriLankaAustraliaCrossFlagsMemo}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainHeader;
