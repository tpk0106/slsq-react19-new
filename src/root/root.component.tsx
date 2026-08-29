import React, { useEffect, useRef, useState } from "react";
import Header from "../navigation/header.component";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../navigation/footer.component";
import Clock from "../generic/local-current-date-time.component";

// import Clock from "../generic/local-current-date-time.component";
// import MenuGenerator from "../generic/menu-generator.component";
// import navbarData from "../data/nav-data";

// const SriLankaAustraliaCrossFlagsMemo = React.memo(SriLankaAustraliaCrossFlags);

const Root = () => {
  const ClockMemo = React.memo(Clock);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Smooth scroll to top whenever the route changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  // Show/hide the scroll-to-top button based on scroll position
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 300);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // const menus = <MenuGenerator data={navbarData} />;
  // const memoizedHeaderWithMenus = useMemo(
  //   () => <Header children={menus} />,
  //   []
  // );
  // const callbackHeader = useCallback(() => memoizedHeaderWithMenus, []);
  return (
    <div
      ref={scrollRef}
      className="container h-screen w-screen max-w-full overflow-y-auto flex flex-col"
    >
      <div className="fixed z-50 w-screen shadow-[0px_8px_8px_0px_rgba(0,_0,_0,_0.7)] ">
        <Header />
        {/* {callbackHeader()} */}
      </div>
      {/* <Header children={<Clock />} /> */}
      <div className="pt-[170px] bg-[#EED3CC] flex-1">
        <Outlet />
      </div>
      <Footer clock={<ClockMemo />} />

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-[#800020] text-white
                     w-12 h-12 rounded-full shadow-lg
                     flex items-center justify-center
                     hover:bg-[#5a0016] transition-all duration-300
                     opacity-90 hover:opacity-100"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Root;
