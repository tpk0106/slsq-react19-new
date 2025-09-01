import { Link, Outlet } from "react-router-dom";
import navbarData from "../data/nav-data";
import Menu from "../generic/menu.component";
import Footer from "./footer.component";
// import { useEffect, useRef } from "react";

// import Clock from "../generic/local-current-date-time.component";

// const handleClickMenu = () => {
//   // const ele = document.getElementById("mobileMenu");
//   // ele?.classList.toggle("hidden");
// };

const handleMenuToggle = () => {
  const menuBars = document.getElementById("menu-bars");
  menuBars?.classList.toggle("change");
  console.log("menubars", menuBars?.classList.item);

  const ele = document.getElementById("mobileMenu");
  ele?.classList.toggle("hidden");
  console.log("mobile menu", ele?.classList.item);
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
        <div className="w-full md:hidden justify-end relative1 absolute z-40 border-5 border-white">
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

        <div className="w-[100%] flex justify-around pt-4 mt-0">
          <Link to="/">
            <img
              src={`${process.env.PUBLIC_URL}logo.jpg`}
              alt="Sri Lanka Society of Queensland Inc logo"
            />
          </Link>
        </div>

        {/* main menu */}

        <nav
          id="main"
          className="rounded-lg 1shadow-lg overflow-hidden p-2 bg-[#7F1734] border-stone-200 
          shadow-stone-950/5 sticky top-0 mx-auto h-[20%] md:h-[25%] max-w-full 
          bg-cover bg-center shadow-[0px_10px_20px_0px_rgba(170,_83,_64,_0.7)] min-h-[200px] border-[1px]"
        >
          {/* <div className="flex text-[#fff] font-bold">
            <p>Colombo Time:</p>
            <div className="ml-5 font-roboto text-[50px]">
              {" "}
              {<ColomboDateTime />}
            </div>
          </div> */}

          <div className="flex items-center ">
            <div className="flex-1 w-[100%] mt-10">
              <div className="flex flex-1 items-center justify-between">
                <nav
                  id="main-menu"
                  className="hidden md:flex lg:flex 3xl:flex flex-1 items-center justify-around border-[1px] w-full 
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

        {/* Mobile menu */}

        <div id="mobile-header" className="flex">
          <div className="flex w-[100%] justify-around">
            <div className="flex justify-center w-[400px]">
              <nav
                id="mobileMenu"
                className="hidden flex-col absolute mt-0 z-51 border-[1px] w-[200px] text-sm rounded-[14px] 
                          bg-[#800000] shadow-[0px_10px_20px_0px_rgba(170,_83,_64,_0.7)]                            
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
        <div className="flex flex-col w-full pt-10 h-full  bg-[#EED3CC]">
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Header;
