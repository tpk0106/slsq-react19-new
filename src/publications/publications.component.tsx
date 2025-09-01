import Publication from "../generic/publication.component";
import { PUBLICATIONS } from "../data/publications";

// older version
//import "react-pdf/dist/esm/Page/AnnotationLayer.css";
//import "react-pdf/dist/esm/Page/TextLayer.css";
// version 10.1.0
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import Membership_form_Revised from "../assets/publications/Membership-Form-Revised.pdf";
import NominationForm from "../assets/publications/NominationForm.doc";
import ProxyForm from "../assets/publications/ProxyForm.doc";
import Download from "../generic/download.component";
import { useEffect, useRef } from "react";
// import { Console } from "console";
// import { DivideIcon } from "@heroicons/react/24/outline";

const Publications = () => {
  // const handleDownloadConstitutionClick = () => {
  //   // const ele = e.target as HTMLElement;
  //   // let url = ele.attributes.item(0)?.value.substring(1);

  //   fetch(constitution_pdf).then((res) => {
  //     res.blob().then((blob) => {
  //       const fileUrl = window.URL.createObjectURL(blob);
  //       const aLink = document.createElement('a');
  //       aLink.href = fileUrl;
  //       aLink.download = 'SLSQ-Constitution';
  //       aLink.click();
  //     });
  //   });

  //   return;
  // };

  // const goToTop = document.getElementById("go-to-top");
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the element when the component mounts or a dependency changes
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" }); // 'smooth' for animated scroll
    }
  }, []); // Empty dependency array means it runs once on mount

  const handleDownloadMembershipFormClick = () => {
    fetch(Membership_form_Revised).then((res) => {
      res.blob().then((blob) => {
        const fileUrl = window.URL.createObjectURL(blob);
        const aLink = document.createElement("a");
        aLink.href = fileUrl;
        aLink.download = "Membership-Form-Revised";
        aLink.click();
      });
    });
  };

  const handleDownloadNominationFormClick = () => {
    fetch(NominationForm).then((res) => {
      res.blob().then((blob) => {
        const fileUrl = window.URL.createObjectURL(blob);
        const aLink = document.createElement("a");
        aLink.href = fileUrl;
        aLink.download = "NominationForm";
        aLink.click();
      });
    });
  };

  const handleDownloadProxyFormClick = () => {
    fetch(ProxyForm).then((res) => {
      res.blob().then((blob) => {
        const fileUrl = window.URL.createObjectURL(blob);
        const aLink = document.createElement("a");
        aLink.href = fileUrl;
        aLink.download = "ProxyForm";
        aLink.click();
      });
    });
  };

  return (
    <>
      <div>
        <div
          id="id1"
          className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-0 my-5"
          ref={targetRef}
        >
          <div className="flex m-auto" ref={targetRef}>
            <section className="py-10 px-5 w-[100%]">
              <div className="flex w-[100%] flex-col md:flex-row m-auto justify-around text-base md:text-2xl  items-center">
                <ul>
                  {/* <div className="flex flex-col max1-w-[70%] m-auto justify-around text-base md:text-2xl sm:flex-row items-center"> */}
                  {PUBLICATIONS.map((publication) => {
                    return (
                      <>
                        <li>
                          <div
                            className="flex flex-col md:flex-row shadow-[0px_5px_10px_0px_rgba(139,_0,_0,_0.15)] p1-5 border-[1px] w-[100%]
                                          my-4 rounded-[14px] bg-[#B222] text-[#7F1734] items-center"
                          >
                            <div className="mx-4 md:mx-10 my-5 flex-col items-center m-auto text-center">
                              <div className="flex items-center w-[100%]">
                                <div className="mx-10">{publication.year}</div>
                              </div>
                              <hr className="border-1 border-[#800020]" />
                              <div className="flex justify-between flex-col md:flex-row items-center">
                                {publication.months.length === 0 && (
                                  <div> No publications for this year</div>
                                )}
                                {publication.months.map((m) => {
                                  return (
                                    <div className="py-5">
                                      <Publication
                                        year={Number(publication.year)}
                                        months={publication.months}
                                        month={m.date}
                                        file={m.file}
                                        key={publication.year.toString()}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </li>
                      </>
                    );
                  })}
                  {/* </div> */}
                </ul>
              </div>
            </section>
          </div>
        </div>

        <div className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-0 my-5">
          <div className="flex m-auto">
            <section className="py-10 px-5 w-[100%]">
              <div className="flex flex-col md:flex-row w-[100%] m-auto justify-around text-base md:text-2xl sm:flex-row items-center">
                <div>
                  <Download
                    handleClick={() => handleDownloadMembershipFormClick()}
                    text="Membership Form download"
                  />
                </div>
                <div>
                  <Download
                    handleClick={() => handleDownloadNominationFormClick()}
                    text="Nomination Form download"
                  />
                </div>
                <div>
                  <Download
                    handleClick={() => handleDownloadProxyFormClick()}
                    text="Proxy Form download"
                  />
                </div>
              </div>
            </section>
            {/* <button
              id="go-to-top"
              onClick={() => {
                const ele = document.getElementById("header");
                console.log(ele);
                ele?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Go to top
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Publications;

// https://stackoverflow.com/questions/44561037/loop-in-return-statement-of-a-component-in-react-js
