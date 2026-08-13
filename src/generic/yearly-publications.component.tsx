import React, { ReactNode } from "react";

type YearlyPublication = {
  year: string;
  months: {
    date: string;
    file: string;
  }[];
  index: number;
  children: ReactNode[];
};

const YearlyPublications = ({ ...publication }: YearlyPublication) => {
  const { year, months, index, children } = publication;
  return (
    <div
      key={index}
      className="flex flex-col md:flex-row shadow-[0px_5px_10px_0px_rgba(139,_0,_0,_0.15)] border-[1px] w-[100%]
                 my-4 rounded-[14px] bg-[#B222] text-[#7F1734] items-center border-white md:w-[95%] lg:w-[100%]"
    >
      <div
        className="mx-4 md:mx-10 my-5 flex-col items-center m-auto text-center 
                   text-sm md:text-[1.0em] lg:text-[1.0em] xl:text-[1.3em] 2xl:text-[1.3em]"
      >
        <div className="flex items-center w-[100%]">
          <div className="mx-auto">{year}</div>
        </div>
        <hr className="border-1 border-[#800020] p-2" />
        <div className="flex justify-between flex-col md:flex-row w-[100%] px-2">
          {months.length === 0 && <div> No publications for this year</div>}

          {React.Children?.map(children, (child, index) => {
            // 1. Type guard: Ensure child is a valid React element before cloning
            if (React.isValidElement(child)) {
              return (
                <div className="py-5">
                  {React.cloneElement(child, {
                    key: index, // Standard practice for list items
                    //   customIndex: index // If you need the index inside the child
                  })}
                  ;
                </div>
              );
            }
            return child; // Return non-element children (like strings) as-is
          })}
        </div>
      </div>
    </div>
  );
};

export default YearlyPublications;
