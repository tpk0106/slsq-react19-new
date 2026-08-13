import React, { useCallback, useMemo } from "react";
import Header from "../navigation/header.component";
import { Outlet } from "react-router-dom";
import Footer from "../navigation/footer.component";
import Clock from "../generic/local-current-date-time.component";
import SriLankaAustraliaCrossFlags from "../generic/sri-lanka-australia-cross-flags.component";
// import Clock from "../generic/local-current-date-time.component";
// import MenuGenerator from "../generic/menu-generator.component";
// import navbarData from "../data/nav-data";

// const SriLankaAustraliaCrossFlagsMemo = React.memo(SriLankaAustraliaCrossFlags);

const Root = () => {
  const ClockMemo = React.memo(Clock);
  // const menus = <MenuGenerator data={navbarData} />;
  // const memoizedHeaderWithMenus = useMemo(
  //   () => <Header children={menus} />,
  //   []
  // );
  // const callbackHeader = useCallback(() => memoizedHeaderWithMenus, []);
  return (
    <div className="container h-screen w-screen max-w-full overflow-scroll">
      <div className="fixed z-50 w-screen shadow-[0px_8px_8px_0px_rgba(0,_0,_0,_0.7)] ">
        <Header />
        {/* {callbackHeader()} */}
      </div>
      {/* <Header children={<Clock />} /> */}
      <div className="pt-[170px] bg-[#EED3CC]">
        <Outlet />
      </div>
      <Footer clock={<ClockMemo />} />
    </div>
  );
};

export default Root;
