import React from "react";

const handleMenuToggle = () => {
  const menuBars = document.getElementById("menu-bars");
  menuBars?.classList.toggle("change");

  const ele = document.getElementById("mobileMenu");
  ele?.classList.toggle("hidden");
};

const MobileMenuIcon = () => {
  return (
    <>
      {/* <div className="md:hidden justify-end relative"> */}
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
      {/* </div> */}
    </>
  );
};

export default MobileMenuIcon;
