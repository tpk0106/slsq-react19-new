import { faFontAwesome } from "@fortawesome/free-solid-svg-icons";

import { MouseEvent } from "react";
type SLSQButton = {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  icon?: any | undefined | null;
  caption: string;
  classname: string;
};

const Button = ({ onClick, icon, caption, classname }: SLSQButton) => {
  return (
    <>
      <div className="flex justify-around">
        <button onClick={(e) => onClick(e)} className={classname}>
          {/* {icon && <FontAwesomeIcon icon={icon} />} */}
          <span className="pl-5">{caption}</span>
        </button>
      </div>
    </>
  );
};

export default Button;
