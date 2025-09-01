import { NavLink } from "react-router-dom";

type menuItem = {
  submenu: string | null;
  icon: string;
  label: string;
  routerLink: string;
  handleClick: () => void;
  key: string;
  classname: string | undefined;
};
const Menu = ({
  label,
  routerLink,
  icon,
  classname,
  handleClick,
}: menuItem) => {
  return (
    <li
      className={
        classname
          ? classname
          : "cursor-pointer items-center text-center py-4 m-auto hover:text-[#ffcccc] hover:font-bold"
      }
      key={label}
    >
      <NavLink to={routerLink} onClick={() => handleClick()}>
        {label}
      </NavLink>
    </li>
  );
};

export default Menu;
