import React from "react";
import { Committee_Members } from "../data/slsq-members";
import { pastPresidents } from "../data/past-presidents";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const CommitteeMembers = () => {
  return (
    <div>
      <div className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-5">
        <div className="flex m-auto">
          <section className="py-10 md:px-5 w-[100%]">
            <div
              className="flex w-[100%] m-auto justify-around
                          text-base md:text-xl lg:text-2xl xl:text-3xl max-[320px]:text-[0.9rem] sm:flex-row items-center"
            >
              <ul>
                {Committee_Members.map((member, index) => {
                  console.log("index : ", index);
                  return (
                    <>
                      <li key={index}>
                        <div
                          className="flex shadow-[0px_5px_10px_0px_rgba(139,_0,_0,_0.15)] border-[1px] p-[2px] w-[90%] m-auto md:w-full 
                          my-4 rounded-[14px] bg-[#B222] text-[#7F1734]"
                          // key={index}
                        >
                          <div
                            className="max-[320px]:mx-1 max-[375px]:mx-2 max-[425px]:p-4 
                                          max-[320px]:px-2 
                                          md:mx-10 my-5 flex justify-between w-full"
                          >
                            <div className="mr-4 md:mr-10 flex">
                              <div className="mx-2">
                                <UserCircleIcon className="h-4 w-4 md:h-8 md:w-8 text-[#B22222]" />
                              </div>
                              {member.post}
                            </div>
                            <div className="sm:mx-2">
                              {member.name.length > 0
                                ? member.name
                                : "----------"}
                            </div>
                          </div>
                        </div>
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <div className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-5 mb-5">
        <div className="flex m-auto">
          <section className="py-10 md:px-5 w-[100%]">
            <div
              className="flex w-[100%] m-auto justify-around items-center sm:flex-row
                          text-base md:text-xl lg:text-2xl xl:text-3xl max-[320px]:text-[0.9rem]"
            >
              <ul>
                {pastPresidents.map((president, index) => {
                  return (
                    <>
                      <li key={index}>
                        <div
                          className="shadow-[0px_5px_10px_0px_rgba(139,_0,_0,_0.15)] border-[1px] 
                        my-4 rounded-[14px] bg-[#B222] text-[#7F1734] w-[90%] m-auto md:w-full"
                        >
                          <div className="mx-10 my-5 flex justify-between">
                            <div className="mr-10">{president.name}</div>
                            <div>{president.period}</div>
                          </div>
                        </div>
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CommitteeMembers;
