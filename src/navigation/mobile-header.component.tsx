import React from "react";
import { Link } from "react-router-dom";

type HeaderProps = {
  logoMemo: React.ReactElement;
  sriLankaAustraliaCrossFlagsMemo: React.ReactElement;
  clock: React.ReactElement;
};

const MobileHeader = ({
  logoMemo,
  sriLankaAustraliaCrossFlagsMemo,
  clock,
}: HeaderProps) => {
  return (
    <>
      <div className="flex w-[90%] flex-col min-[667px]:hidden mx-auto mb-2">
        <div className="flex w-[100%] mx-auto bg-white">
          <Link to="/" className="flex align-middle p-1">
            <div className="w-[15%] auto">
              {/* <Logo /> */}
              {/* <LogoMemo /> */}
              {logoMemo}
            </div>
          </Link>
          <div className="w-[35%] auto m-0 p-1">
            {/* <SriLankaAustraliaCrossFlags /> */}
            {sriLankaAustraliaCrossFlagsMemo}
          </div>
        </div>

        <div className="flex border-2 m-auto p-2 w-[70%] my-7">
          <div
            className="flex-col w-[100%] rounded-sm 
                          shadow-md justify-center text-center mx-auto my-auto
                        bg-[#fff] font-bold"
          >
            <div className="flex w-[100%] xxs:text-[50%] text-[70%]">
              <div className="flex w-[40%] justify-end">Colombo Time:</div>

              <div className="flex-grow w-[60%]">{clock}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileHeader;
