import Menu from "../generic/menu.component";
import navbarData from "../data/nav-data";
// import FooterMenu from "../generic/bottom.menu.component";
import Clock from "../generic/local-current-date-time.component";

const formatDate = () => new Date().toLocaleDateString();

const handleClickMenu = () => {
  const ele = document.getElementById("mobileMenu");
  ele?.classList.toggle("hidden");
};

const Footer = () => {
  return (
    <>
      <div
        className="w-[100%] bg-[#470000] text-[#fff] h-[600px] md:h-[400px] bg-cover bg-center 
                      shadow-[inset_0px_5px_15px_-3px_rgba(0,_0,_0,_0.2)]"
      >
        <div className="flex">
          <div className="flex flex-col md:flex-row w-full">
            <div className="flex flex-col md:flex-row w-[100%] md:w-[70%] md:m-auto">
              <div className="w-[35%] ml-50 md:w-[30%] m-auto md:ml-[10%] mt-5">
                <ul
                  id="footer-menu"
                  className="flex flex-col text1-[1.1em] leading-6 list-none"
                >
                  {navbarData.map((menu) => {
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
                  })}
                </ul>
              </div>
              <div className="w-[100%] md:w-[70%] m1-auto justify-around text-center my-5 md:my-0">
                <div>
                  &copy; {formatDate()} Sri Lanka Society of Queensland Inc.
                </div>
                <div>All rights reserved.</div>
                <div className="flex items-center">
                  <div className="flex text1-[#fff] font-1bold items-center text1-center m-auto">
                    <div>Colombo Time:</div>
                    <div className="ml-5">{<Clock />}</div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="ml-1 mr-1.5 hidden h-100 w-px border-l border-t-0 border-secondary-dark lg:block" />
            <div className="flex flex-col w-[100%] md:w-[30%] py-5 m-auto text-center">
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

                  <div className="mt-20 text-xs">
                    Developed by Thusith Kathaluwage using react
                    (v19)/typescript.♥️
                  </div>
                  <hr className="mx-5 border-1 border-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
