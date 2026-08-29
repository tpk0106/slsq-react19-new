import React, { useState, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

interface Member {
  post: string;
  name: string;
}

interface President {
  name: string;
  period: string;
}

const CommitteeMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [presidents, setPresidents] = useState<President[]>([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Fetch committee members
    fetch(`${API_BASE}/api/about/members`)
      .then((res) => res.json())
      .then((data) =>
        setMembers(data.map((m: any) => ({ post: m.Post, name: m.Name }))),
      )
      .catch((err) => console.error("Error fetching members:", err));

    // Fetch past presidents
    fetch(`${API_BASE}/api/about/presidents`)
      .then((res) => res.json())
      .then((data) =>
        setPresidents(
          data.map((p: any) => ({
            name: p.PresidentName,
            period: String(p.PeriodFrom) === String(p.PeriodTo)
              ? `${p.PeriodFrom}`
              : Number(p.PeriodTo) === currentYear
                ? `${p.PeriodFrom} - To Date`
                : `${p.PeriodFrom} - ${p.PeriodTo}`,
          })),
        ),
      )
      .catch((err) => console.error("Error fetching presidents:", err));
  }, []);

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
                {members.map((member, index) => (
                  <li key={index}>
                    <div
                      className="flex shadow-[0px_5px_10px_0px_rgba(139,_0,_0,_0.15)] border-[1px] p-[2px] w-[90%] m-auto md:w-full 
                          my-4 rounded-[14px] bg-[#B222] text-[#7F1734]"
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
                          {member.name.length > 0 ? member.name : "----------"}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
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
                {presidents.map((president, index) => (
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
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CommitteeMembers;
