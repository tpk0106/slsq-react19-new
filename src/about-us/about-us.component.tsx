import React from "react";

const AboutUs = () => {
  return (
    <div className="">
      <div
        className="max-h-[98%] max-w-[90%] min-w-[40%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] 
                      mt-0 border1-[5px] border1-blue-700 text-[#7F1734] font-semibold"
      >
        <div className="flex-1 text-3xl mx-5 p-[1em]">
          <div className="flex flex-col items-center content-center ">
            <p className="text-base md:text-[20px] lg:text-[30px] mb-3">
              Rules & Objectives
            </p>
            <p
              id="rules"
              className="text-base md:text-[20px] lg:text-[30px] mb-5 drop1-shadow-[1px_1px_rgba(0,0,0,1)] text-center"
            >
              We are a community organisation dedicated to the celebration and
              understanding of Sri Lankan culture within Queensland, Australia.
              As such, we have developed the following seven principles.
            </p>
            <p className="text-base md:text-[20px] lg:text-[30px] p-5 text-center">
              The goals of the Sri Lanka Society of Queensland are:
            </p>
          </div>

          <div className="mt-8 text-center">
            <ul className="text-base md:text-[20px] lg:text-[30px] 1leading1-relaxed sm1:leading-normal text-[#7F1734]">
              <li className="m-[1em] drop1-shadow-[1px_1px_rgba(0,0,0,1)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop1-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                promote harmonious co-operation and friendship amongst all
                immigrants from Sri Lanka and Australians irrespective of race,
                religion, politics or other differences
              </li>
              <li className="m-[1em] drop1-shadow-[1px_1px_rgba(0,0,0,1)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop1-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                preserve, promote and project the culture of Sri Lanka.
              </li>
              <li className="m-[1em] drop1-shadow-[1px_1px_rgba(0,0,0,1)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop1-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                render assistance to students and immigrants from Sri Lanka.
              </li>
              <li className="m-[1em] drop1-shadow-[1px_1px_rgba(0,0,0,1)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop1-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                encourage and foster recreational, sporting and social
                activities.
              </li>
              <li className="m-[1em] drop1-shadow-[1px_1px_rgba(0,0,0,1)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop1-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                publish and circulate news of Sri Lanka and local events.
              </li>
              <li className="m-[1em] drop1-shadow-[1px_1px_rgba(0,0,0,1)]">
                <span className="text-[#7F1734] font-[900] text-[2em] drop1-shadow-[4px_4px_rgba(0,0,0,1)] mr-3">
                  To
                </span>
                render assistance to the people of Sri Lanka in times of need,
                at the discretion of the Management Committee.
              </li>
              <li className="m-[1em] drop1-shadow-[1px_1px_rgba(0,0,0,1)]">
                The Rules of the Society are those of a non-profit society.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
