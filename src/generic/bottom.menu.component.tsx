import { NavLink } from "react-router-dom";
import Menu from "./menu.component";

type menuItem = {
  submenu: string | null;
  icon: string;
  label: string;
  routerLink: string;
  handleClick: () => void;
  key: string;
  classname: string | undefined;
};

function FooterMenu({
  label,
  routerLink,
  icon,
  classname,
  handleClick,
}: menuItem) {
  return (
    <FooterMenu
      key={label}
      submenu={null}
      icon={icon}
      label={label}
      classname={undefined}
      routerLink={routerLink}
      handleClick={function (): void {
        handleClick();
      }}
    />
  );
}
// const FooterMenu = ({ label, routerLink, icon, handleClick }: menuItem) => {
//   return (
//     <li
//       className="cursor-pointer items1-center text-left py1-4 m1-auto hover:text-[#fff]"
//       key={label}
//     >
//       <NavLink to={routerLink} onClick={() => handleClick()}>
//         {label}
//       </NavLink>
//     </li>
//   );
// };

export default FooterMenu;
