import React from "react";
import { Committee_Members } from "../data/slsq-members";
import { pastPresidents } from "../data/past-presidents";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const CommitteeMembers = () => {
  return (
    <div>
      {/* <div className="w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-0">
        <div className="flex m-auto">
          <section className="py-10 px-5 w-[100%]">
            <div className="flex w-[100%] m-auto justify-around text-base md:text-2xl sm:flex-row items-center">
              <ul>
                {Committee_Members.map((member) => {
                  return (
                    <>
                      <li>
                        <div
                          className="shadow-[0px_5px_10px_0px_rgba(139,_0,_0,_0.15)] 
                                     md:p-5 border-[1px] 
                                     w-[250px] 
                                     md:w-[100%] 
                                     my-4 
                                     rounded-[14px] 
                                     bg-[#B222] 
                                     text-[#7F1734]"
                        >
                          <div className="basis-5/6 my-3 md:my-5 flex flex-col md:flex-row items-center">
                            <div className="flex flex1-col w-[50%] md:[70%] md:flex-row">
                              <div className="ml1-0">
                                <UserCircleIcon className="h-4 w-4  md:h-8 md:w-8 text-[#B22222]" />
                              </div>
                              <div className="text-sm md:text-xl lg:text-2xl">
                                <div className="mx-3 md:mx-10">
                                  {member.post.trim()}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div>{member.name}</div>
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
      </div> */}

      <div className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-5">
        <div className="flex m-auto">
          <section className="py-10 px-5 w-[100%]">
            <div className="flex w-[100%] m-auto justify-around text-base md:text-2xl l:3xl sm:flex-row items-center">
              <ul>
                {Committee_Members.map((member) => {
                  return (
                    <>
                      <li>
                        <div className="shadow-[0px_5px_10px_0px_rgba(139,_0,_0,_0.15)] border-[1px] my-4 rounded-[14px] bg-[#B222] text-[#7F1734]">
                          <div className="mx-4 md:mx-10 my-5 flex justify-between">
                            <div className="mr-4 md:mr-10 flex ">
                              <div className="mr-2">
                                <UserCircleIcon className="h-4 w-4 md:h-8 md:w-8 text-[#B22222]" />
                              </div>
                              {member.post}
                            </div>
                            <div>
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

      <div className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-5">
        <div className="flex m-auto">
          <section className="px-5 w-[100%]">
            <div className="flex w-[100%] m-auto justify-around text-base md:text-2xl l:3xl sm:flex-row items-center">
              <ul>
                {pastPresidents.map((president) => {
                  return (
                    <>
                      <li>
                        <div className="shadow-[0px_5px_10px_0px_rgba(139,_0,_0,_0.15)] border-[1px] my-4 rounded-[14px] bg-[#B222] text-[#7F1734]">
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
