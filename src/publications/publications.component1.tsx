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
import YearlyPublications from "../generic/yearly-publications.component";
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
      <div className="pb-5">
        <div
          id="id1"
          className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-5 my-5"
          // ref={targetRef}
        >
          <div
            className="flex m-auto"
            // ref={targetRef}
          >
            <section className="py-10 px-5 w-[100%]">
              <div className="flex flex-col md:flex-row m1-auto justify-around">
                <div>
                  {PUBLICATIONS.map((publication, index) => {
                    return (
                      <YearlyPublications
                        key={index}
                        year={publication.year.toString()}
                        months={publication.months}
                        index={index}
                        children={publication.months.map((p, idx) => (
                          <Publication
                            key={++idx}
                            year={Number(publication.year)}
                            months={publication.months}
                            month={p.date}
                            file={p.file}
                          />
                        ))}
                      />
                    );
                  })}
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="max-w-[90%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-0 my-5">
          <div className="flex m-auto">
            <section className="py-10 px-5 w-[100%]">
              <div
                className="flex flex-col md:flex-row w-[100%] m-auto justify-around 
                           text-sm md:text-[0.7em] lg:text-[1.0em] xl:text-[1.3em] 2xl:text-[1.3em] items-center"
              >
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
