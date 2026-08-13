import React from "react";
import Menu from "./menu.component";

type NavData = {
  routerLink: string;
  element: () => React.ReactElement;
  icon: string;
  label: string;
  subMenus: null;
};

type NavMenus = {
  data: NavData[];
  classname: string;
};

const handleMenuToggle = () => {
  const menuBars = document.getElementById("menu-bars");
  menuBars?.classList.toggle("change");

  const ele = document.getElementById("mobileMenu");
  ele?.classList.toggle("hidden");
};

const MenuGenerator = ({ data, classname }: NavMenus) => {
  //  this used to stop re-render menu items
  const MenuMemo = React.memo(Menu);
  return (
    <>
      {data.map((menu, index) => {
        return (
          <MenuMemo
            label={menu.label}
            submenu={menu.subMenus}
            routerLink={menu.routerLink}
            icon={menu.icon}
            classname={classname}
            handleClick={() => {}}
            key={index.toString()}
          />
        );
      })}
    </>
  );
};

export default MenuGenerator;
