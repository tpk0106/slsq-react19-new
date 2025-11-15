import { useEffect, useRef } from "react";
import CommitteeMembers from "../committe-members/committe-members.component";

const AboutUs = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the element when the component mounts or a dependency changes
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" }); // 'smooth' for animated scroll
    }
  }, []); // Empty dependency array means it runs once on mount

  return (
    <div ref={targetRef}>
      <div
        className="max-h-[98%] max-w-[90%] min-w-[40%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] 
                      mt-0 text-[#7F1734] font-semibold"
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
              <li className="m-[1em] drop-shadow-[2px_2px_rgba(255,255,255,.5)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                promote harmonious co-operation and friendship amongst all
                immigrants from Sri Lanka and Australians irrespective of race,
                religion, politics or other differences
              </li>
              <li className="m-[1em] drop-shadow-[2px_2px_rgba(255,255,255,.5)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                preserve, promote and project the culture of Sri Lanka.
              </li>
              <li className="m-[1em] drop-shadow-[2px_2px_rgba(255,255,255,.5)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                render assistance to students and immigrants from Sri Lanka.
              </li>
              <li className="m-[1em] drop-shadow-[2px_2px_rgba(255,255,255,.5)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                encourage and foster recreational, sporting and social
                activities.
              </li>
              <li className="m-[1em] drop-shadow-[2px_2px_rgba(255,255,255,.5)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                publish and circulate news of Sri Lanka and local events.
              </li>
              <li className="m-[1em] drop-shadow-[2px_2px_rgba(255,255,255,.5)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                render assistance to the people of Sri Lanka in times of need,
                at the discretion of the Management Committee.
              </li>
              <li className="m-[1em] drop-shadow-[2px_2px_rgba(255,255,255,.5)]">
                The Rules of the Society are those of a non-profit society.
              </li>
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
