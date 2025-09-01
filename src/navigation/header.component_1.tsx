import { Outlet } from "react-router-dom";
import navbarData from "../data/nav-data";
import Menu from "../generic/menu.component";
import Footer from "./footer.component";
import { useEffect, useRef } from "react";

const handleMenuToggle = () => {
  const menuBars = document.getElementById("menu-bars");
  menuBars?.classList.toggle("change");

  const ele = document.getElementById("mobileMenu");
  ele?.classList.toggle("hidden");

  // const menuBars1 = document.getElementById("menu-bars1");
  // menuBars1?.classList.toggle("change");

  const main = document.getElementById("main");
  main?.setAttribute("height", "200");

  // menuBars?.classList.toggle("hidden");
};

// export const SL_date = () => {
//   setTimeout(() => {
//     let ele = document.getElementById("timer");
//     let dt = new Date().toLocaleString("en-US", {
//       timeZone: "Asia/Colombo",
//     });
//     ele!.innerText = dt;
//   }, 2000);
//   return null;
// };

// export const SL_date = (): any => {
//   setTimeout(() => {
//     const ele = document.getElementById("timer");
//     ele?.innerText =
//     ele?.setAttribute(
//       "innerText",
//       new Date().toLocaleString("en-US", {
//         timeZone: "Asia/Colombo",
//       })
//     );
//   }, 2000);
//   return null;
// };
const Header = () => {
  return (
    <>
      <div className="container h-screen w-screen max1-h-full max-w-full overflow-scroll bg1-[#EED3CC] border-5 border-red-500">
        <div className="w-full md:hidden mt1-0 mr1-0 -right-14 right1-[20px] top1-10 mt1-4 mr1-10 justify-end border-5 border-red-500">
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
        <div className="w-full relative1 sticky z-60 h-[75px] bg-[#7F1734] md:hidden"></div>
        {/* <div mt-10 className=" sticky"> */}
        <nav
          id="main"
          className="rounded-lg 1shadow-lg overflow-hidden p-2 bg1-[#C32148] bg1-white bg1-[#800] bg-[#7F1734] bg1-[#AA5340] bg1-[#EED3CC] border-stone-200 
          shadow-stone-950/5 sticky1 top-0 mx-auto h-[25%]  max-w-full w1-full lg1:max-w-screen-xl  xl1:max-w-screen-xl
          bg1-[url('./assets/images1/background-3.png')] bg-cover bg-center shadow-[0px_10px_20px_0px_rgba(170,_83,_64,_0.7)] 
          shadow1-[0px_4px_6px_0px_rgba(0,_0,_0,_0.7)] z1-100 min-h-[200px] border-[1px] hidden relative1 z-50 md:block md:sticky mb-5"
        >
          <div className="flex items-center ">
            {/* <div id="timer">Local Time :{SL_date()}</div> */}
            {/* <hr className="ml-1 mr-1.5 hidden h-5 w-px border-l border-t-0 border-secondary-dark lg:block" /> */}
            <div className="flex-1 w-[100%] mt-10">
              <div className="flex flex-1 items-center justify-between">
                <nav
                  id="main-menu"
                  className="hidden md:flex lg:flex 3xl:flex flex-1 
                  items-center justify-around border-[1px] w-full 
                  text-sm mx-[10%] rounded-[14px] bg-[#800000] shadow-[0px_4px_6px_0px_rgba(0,_0,_0,_0.7)]
                  text-[#FFCCCC] font-semibold font-roboto"
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
        </nav>

        {/*NEW MOBILE MENU  */}

        {/* MOBILE MENU */}

        {/* <nav
          id="mobile-header"
          className="flex md:hidden rounded-lg overflow1-hidden p1-2 bg-[#7F1734] border-stone-200 
          shadow-stone-950/5 sticky top-0 mx1-auto h-[50%] w-full
          bg-cover bg-center shadow-[0px_10px_20px_0px_rgba(170,_83,_64,_0.7)] 
          min1-h-[100px] border-[1px]"
        > */}
        <div
          id="mobile-header"
          className="flex items-center w-[80%] m1-auto -m-10"
        >
          <div className="flex w-[100%] justify-around">
            <div className="flex justify-center w-[400px]">
              <nav
                id="mobileMenu"
                className="hidden flex-col absolute z-51 border1-5 border-green-600
                  items-center border-[1px] w-[200px] justify-center
                  text-sm rounded-[14px] bg-[#800000] shadow-[0px_10px_20px_0px_rgba(170,_83,_64,_0.7)] 
                  text-[#FFCCCC] font-semibold font-roboto"
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
                        handleClick={() => {}}
                        key={menu.label}
                      />
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>

          {/* <div className="flex w-full md:hidden justify1-end mt1-1 mr1-2 mt-0 mr-0 relative1 absolute z-50 border-5 border-white">
            <div
              className="menu-bars1"
              id="menu-bars"
              onClick={() => handleMenuToggle()}
            >
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </div> */}
          {/* <div className="flex w-full md:hidden justify-end mt1-1 mr1-2 mt-0 mr-0 relative">
              <div
                className="menu-bars"
                id="menu-bars"
                onClick={() => handleMenuToggle()}
              >
                <div className="bar1"></div>
                <div className="bar2"></div>
                <div className="bar3"></div>
              </div>
            </div>*/}
        </div>
        {/* </nav> */}

        {/*END NEW MOBILE MENU  */}

        {/* <div className="flex w-full md:hidden justify-end mt-1 mr-2">
          <div
            className="menu-bars"
            id="menu-bars"
            onClick={() => handleMenuToggle()}
          >
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        </div> */}
        {/* </div> */}
        <div className="flex flex-col w-full pt-10 h-full bg-[#EED3CC] bg1-[#fff] mt1-10">
          <Outlet />
          <Footer />
        </div>

        {/* <Footer /> */}
        {/* <div className="flex">
          <Footer />
        </div> */}
      </div>
    </>
  );
};

export default Header;
