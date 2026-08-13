// import { useEffect, useRef } from "react";
import CommitteeMembers from "../committe-members/committe-members.component";
import AboutUsItems from "../data/about-us-items";
import AboutUsItem from "../generic/about-us-item.component";

const AboutUs = () => {
  // const targetRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   // Scroll to the element when the component mounts or a dependency changes
  //   if (targetRef.current) {
  //     targetRef.current.scrollIntoView({ behavior: "smooth" }); // 'smooth' for animated scroll
  //   }
  // }, []); // Empty dependency array means it runs once on mount

  return (
    <div className="pb-10">
      <div
        id="liyawela"
        className="max-h-[98%] max-w-[90%] min-w-[40%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] 
                      mt1-0 text-[#7F1734] font-semibold mt-5"
      >
        <div className="flex-1 text-base md:text-xl lg:text-2xl xl:text-3xl mx-5 p-[1em] font-roboto">
          <div className="flex flex-col items-center content-center ">
            <p className="mb-3 drop-shadow-[2px_2px_rgba(255,255,255,.5)] text-black">
              Rules & Objectives
            </p>
            <p
              id="rules"
              className="mb-5 text-center drop-shadow-[2px_2px_rgba(255,255,255,.5)]"
            >
              We are a community organisation dedicated to the celebration and
              understanding of Sri Lankan culture within Queensland, Australia.
              As such, we have developed the following seven principles.
            </p>
            <p className="p-5 text-center drop-shadow-[2px_2px_rgba(255,255,255,.5)] text-black">
              The goals of the Sri Lanka Society of Queensland are:
            </p>
          </div>

          <div className="mt-8 text-center">
            <ul className="leading1-relaxed sm1:leading-normal text-[#7F1734]">
              {AboutUsItems.map((item, index) => {
                return (
                  <AboutUsItem
                    text={item.item}
                    liClass={
                      "m-[1em] drop-shadow-[2px_2px_rgba(255,255,255,.5)]"
                    }
                    spanClass={
                      "text-[#7F1734] font-[900] text-[2em] drop-shadow-[4px_4px_rgba(0,0,0,1)] mr-3"
                    }
                    key={index}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-base md:text-[20px] lg:text-[30px]">
        <CommitteeMembers />
      </div>
    </div>
  );
};

export default AboutUs;
