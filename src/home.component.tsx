// Default theme
import "@splidejs/react-splide/css";

// or other themes
import "@splidejs/react-splide/css/skyblue";
import "@splidejs/react-splide/css/sea-green";

// or only core styles
import "@splidejs/react-splide/css/core";
import { Link } from "react-router-dom";

// import poster_sankathana from "./assets/images/sankathana.webp";

import Carousal from "./generic/carousal.component";
// import Button from "./generic/button.component";
// import { useRef } from "react";

function displayInfo() {
  const e = document.getElementById("info");
  e?.classList.toggle("hidden");
}

const info = document.getElementById("info");

info?.addEventListener("scroll", function () {
  console.log("scrolling main:", info);
  console.log("scrolling main");
});

const Home = () => {
  // const bottomRef = useRef(null);

  // const ScrollToTop = () => {
  //   console.log("scroll");
  //   window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  //   // document.documentElement.scrollBy(500, 0);
  //   // document.documentElement.scrollTop = 0;
  //   // document.body.scrollTop = 0;
  // };

  // // https://medium.com/codingbeauty-tutorials/react-scroll-to-top-of-page-9e7e7ef88dd8
  // const scrollToBottom = () => {
  //   // bottomRef.current!.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <>
      <div
        id="info"
        className="w-[100%] md:w-[70%] min-h-[200px] md:min-h-[300px] hidden relative top-30 left-30 
                  m-auto rounded-[1em] border-1 border-[#000] 
                  shadow-[0px_10px_20px_0px_rgba(000,_10,_10,_0.15)] opacity-100 z-50 bg-[#800000] text-white"
      >
        <div className="px-5 py-5">
          <a href="##" onClick={() => displayInfo()}>
            X
          </a>
        </div>
        <div className="px-10 h-[500px] md:h-[300px]">
          In collaberation with Sri lanka society of queensland (SLSQ). with
          prof. Raj Somadeva. Brisbane, Sepetember 6, 2025 St james Church Hall
          165 Old Clevland Road, CoorParoo.
          {/* <div>
            <div>
              <iframe
                title="location"
                src="https://www.google.com/maps/place/165+Old+Cleveland+Rd,+Coorparoo+QLD+4151/@-27.4990403,153.0493531,17z/data=!3m1!4b1!4m6!3m5!1s0x6b915a4f098aaff9:0x25f213984681c99f!8m2!3d-27.4990403!4d153.051928!16s%2Fg%2F11rp37vnwh?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D"
                width={600}
                height={200}
                allowFullScreen={true}
              >
                Location
              </iframe>
            </div>
          </div> */}
        </div>
      </div>

      <div

      // data-aos="zoom-in"
      // // data-aos-offset="200"
      // data-aos-delay="50"
      // data-aos-duration="1000"
      // data-aos-easing="ease-in-out"
      // data-aos-mirror="true"
      // data-aos-once="false"
      // data-aos-anchor-placement="top-center"
      >
        <div
          // ref={ref}
          id="home"
          className="flex flex-row  left-1/4 right-1/4 -z-0 bg-[#EED3CC]"
        >
          <div className="flex m-auto w-[100%]">
            <div className="flex justify-around">
              <section className="pb-10">
                <div
                  className="w-[100%] m-auto 
                                sm:text1-[1em] 
                                md:text1-[1.5em] 
                                lg:text1-[2em]
                                xl:text1-[2em] 
                                2xl:text1-[2.1em]
                                px-10 sm:leading-relaxed lg:leading1-loose text-center"
                >
                  <div className="w-[100%] m-auto image-container" id="poster">
                    <div className="w-[60%] m-auto">
                      <Link to={"/"}>
                        <img
                          src={require("./assets/images/sankathana-large.webp")}
                          srcSet={`${require("./assets/images/sankathana-large.webp")} 1080w, 
                                   ${require("./assets/images/sankathana-small.webp")} 480w`}
                          alt="Poster"
                          className="w-[100%] rounded-[1em] border-2 border-white
                                      shadow-[0px_10px_20px_0px_rgba(000,_10,_10,_0.15)] 
                                      hover:scale-[0.95] 
                                      hover:duration-300
                                      hover1:scale1-x-[-1.1] 
                                      scale1x-[-1]"
                          // onClick={() => displayInfo()}
                        />
                      </Link>
                    </div>
                  </div>

                  <div className="flex-col w-full">
                    <div className="flex flex-col md:flex-row w-full">
                      <div className="w-[100%] md:w-[70%] md1:w-full">
                        <Carousal />
                      </div>

                      <div className="w-[100%] md:w-[30%] flex flex-col mt-10">
                        <div
                          className="sm:text-body-laptop 
                                     md:text-[1.0em] 
                                     lg:text-[1.8em] 
                                     xl:text-[2.2em] 
                                     2xl:text-[2.5em] 
                                     text-center font-semibold
                          drop-shadow-[2px_2px_rgba(255,255,255,.5)] p-4"
                          data-aos="flip-left"
                        >
                          Welcome! <br /> ආයුබෝවන්, <br /> வணக்கம், <br />
                          اَلسَّلامُ عَلَيْكُم <br /> and G’day
                        </div>
                        <div
                          className="lg:text-[1.5em] 
                                     xl:text-[1.8em] 
                                     2xl:text-[2.2em]"
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div
                        className="text-content drop-shadow-[2px_2px_rgba(255,255,255,.5)] 
                                 text-center p-4  mt-5
                                 lg:text-[1.5em]
                                 xl:text-[1.8em]
                                 2xl:text-[2.2em]"
                      >
                        This is the official website of the Sri Lanka Society of
                        Queensland Incorporated.
                      </div>
                    </div>

                    <div
                      className="drop-shadow-[2px_2px_rgba(255,255,255,.5)] text-center p-4
                                 lg:text-[1.5em]
                                 xl:text-[1.8em]
                                 2xl:text-[2.2em]"
                    >
                      <span className=" pl-2 text-[175%]">W</span>
                      hile Sri Lanka, jewel of the Indian Ocean, may be far from
                      where we live, <br /> it shall always be in our hearts as
                      a land of rich rainforests,
                      <br />
                      bountiful tea plantations and endless beaches.
                      <br />
                    </div>
                    <div
                      className="flex flex-col md:flex-row drop-shadow-[2px_2px_rgba(255,255,255,.5)] 
                                 text-center p-4 
                                 lg:text-[1.5em]
                                 xl:text-[1.8em]
                                 2xl:text-[2.2em]"
                    >
                      This website serves as virtual point of reference to the
                      Society and all its activities as well as a portal to
                      upcoming events and community announcements.
                    </div>
                    <div
                      className="drop-shadow-[2px_2px_rgba(255,255,255,.5)] text-center p-4 
                                    lg:text-[1.5em]
                                    xl:text-[1.8em]
                                    2xl:text-[2.2em]"
                    >
                      Please feel free to browse at your leisure. Feedback on
                      this website is welcome.
                    </div>
                  </div>
                  {/* <div ref={bottomRef}>
                    <Button
                      onClick={() => ScrollToTop()}
                      // (
                      //   event: MouseEvent<HTMLButtonElement>
                      // ): void {
                      //   ScrollTop();
                      // }}
                      caption={"Go to top"}
                      classname="bg-red-300"
                    />
                  </div> */}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="h1-screen w1-screen flex flex-row  left-1/4 right-1/4 -z-0 bg-[#EED3CC]">
        <div data-aos="fade-up-right">
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        </div>
      </div> */}

      {/* <div
        data-aos="flip-left"
        // data-aos-offset="200"
        data-aos-delay="50"
        data-aos-duration="1000"
        // data-aos-easing="ease-in-out"
        data-aos-mirror="true"
        data-aos-once="false"
        // data-aos-anchor-placement="top-center"
      >
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
          reprehenderit adipisci omnis dolorem quia est voluptates fuga
          assumenda. Ut ducimus exercitationem inventore facilis sapiente modi
          excepturi soluta officia consequuntur libero!
        </div>
      </div> */}

      {/* <div className="flex flex-col bg-yellow-100">
        <div
          data-aos="flip-left"
          // data-aos-offset="200"
          data-aos-delay="50"
          data-aos-duration="1000"
          data-aos-easing="ease-in-out"
          data-aos-mirror="true"
          data-aos-once="false"
          data-aos-anchor-placement="top-center"
        >
          <div className="h1-screen w1-screen flex flex-row  left-1/4 right-1/4 -z-0 bg-[#EED3CC]">
            <div className="flex m-auto w-[100%]">
              <div className="flex justify-around">
                <section className="pt-10 pb-10">
                  <div className="w-[100%] m-auto sm:text-[1em] md:text-[1.5em] lg:text-[2em] p-10 sm:leading-relaxed lg:leading-loose text-center font-roboto ">
                    <div className="sm:text-body-laptop md:text-[2.1em] lg:text-[2.3em] pt-10 pb-10 text-center">
                      Welcome! ආයුබෝවන් , வணக்கம், اَلسَّلامُ عَلَيْكُم and
                      G’day
                    </div>

                    <div className="text-content">
                      This is the official website of the Sri Lanka Society of
                      Queensland Incorporated. While Sri Lanka, jewel of the
                      Indian Ocean, may be far from where we live, it shall
                      always be in our hearts as a land of rich rainforests,
                      bountiful tea plantations and endless beaches. This
                      website serves as virtual point of reference to the
                      Society and all its activities as well as a portal to
                      upcoming events and community announcements. <br />
                      <br />
                      Please feel free to browse at your leisure. Feedback on
                      this website is welcome.
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div> */}

      {/* <div className="fade-right">
          xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        </div> */}

      {/* <div data-aos="zoom-in">Content that zooms into view.</div>
        <div
          data-aos="fade-right"
          // data-aos-offset="200"
          // data-aos-delay="50"
          // data-aos-duration="1000"
          // data-aos-easing="ease-in-out"
          // data-aos-mirror="true"
          // data-aos-once="false"
          // data-aos-anchor-placement="top-center"
        >
          <div className="h1-screen w1-screen flex flex-row  left-1/4 right-1/4 -z-0 bg-[#EED3CC]">
            <div className="flex m-auto w-[100%]">
              <div className="flex justify-around">
                <section className="pt-10 pb-10">
                  <div className="w-[100%] m-auto sm:text-[1em] md:text-[1.5em] lg:text-[2em] p-10 sm:leading-relaxed lg:leading-loose text-center font-roboto ">
                    <div className="sm:text-body-laptop md:text-[2.1em] lg:text-[2.3em] pt-10 pb-10 text-center">
                      Welcome! ආයුබෝවන් , வணக்கம், اَلسَّلامُ عَلَيْكُم and
                      G’day
                    </div>

                    <div className="text-content">
                      This is the official website of the Sri Lanka Society of
                      Queensland Incorporated. While Sri Lanka, jewel of the
                      Indian Ocean, may be far from where we live, it shall
                      always be in our hearts as a land of rich rainforests,
                      bountiful tea plantations and endless beaches. This
                      website serves as virtual point of reference to the
                      Society and all its activities as well as a portal to
                      upcoming events and community announcements. <br />
                      <br />
                      Please feel free to browse at your leisure. Feedback on
                      this website is welcome.
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Home;
