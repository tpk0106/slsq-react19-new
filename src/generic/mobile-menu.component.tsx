import React, { FC } from "react";
import MenuGenerator from "./menu-generator.component";

type NavData = {
  routerLink: string;
  element: () => React.ReactElement;
  icon: string;
  label: string;
  subMenus: null;
};

type NavbarData = {
  data: NavData[];
};

const MobileMenu = ({ data }: NavbarData) => {
  return (
    <>
      <div id="mobile-header" className="flex">
        <div className="flex w-[100%] justify-around">
          <div className="flex justify-center w-[400px]">
            <nav
              id="mobileMenu"
              className="hidden absolute mt-0 border-[1px] 
                          max-[430px]:w-[200px] 
                          min-[667px]:w-[600px]                           
                          min-[540px]:w-[520px]
                          text-sm rounded-[14px] 
                          bg-[#800000] shadow-[0px_10px_20px_0px_rgba(170,_83,_64,_0.7)]                            
                          text-[#FFCCCC] font-semibold font-roboto z-[100]"
            >
              <ul className="flex max-[430px]:flex-col min-[667px]:flex-row max-[540px]:flex-row rounded-[14px]">
                <MenuGenerator data={data} classname="" />
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
