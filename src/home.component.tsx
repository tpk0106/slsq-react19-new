// import React, { useEffect, useRef } from "react";
// import { Splide, SplideSlide } from "@splidejs/react-splide";

// Default theme
import "@splidejs/react-splide/css";

// or other themes
import "@splidejs/react-splide/css/skyblue";
import "@splidejs/react-splide/css/sea-green";

// or only core styles
import "@splidejs/react-splide/css/core";

// import t2 from "./assets/images/tea 2.jpg";
// import beach1 from "./assets/images/beach1.jpg";
// import beach2 from "./assets/images/beach2.jpg";
// import beach3 from "./assets/images/beach3.jpg";
// import beach4 from "./assets/images/beach4.jpg";
// import beach5 from "./assets/images/beach5.jpg";
// import beach6 from "./assets/images/beach6.jpg";
// import sigiriya from "./assets/images/sigiriya.jpg";
// import elephant from "./assets/images/elephant.jpg";
// import lotus from "./assets/images/lotus.jpg";
// import nineArchBridge from "./assets/images/nine-arch-bridge.jpg";
// import poster1 from "./assets/images/IMG-20250823-WA0009.jpg";
// import train from "./assets/images/train.jpg";
// import bus from "./assets/images/bus.jpg";
// import peacock from "./assets/images/peacock.jpg";

const Home = () => {
  // const splide = new Splide(".splide");
  // const inputRef = useRef(splide);
  // new Splide("#splide", {
  //   classes: {
  //     pagination: "splide__pagination your-class-pagination",
  //     page: "splide__pagination__page your-class-page",
  //   },
  // });

  // new Splide("splide", {
  //   type: "loop",
  //   height: "9rem",
  //   perPage: 2,
  //   breakpoints: {
  //     640: {
  //       height: "6rem",
  //     },
  //   },
  // });

  // useEffect(() => {
  //   // useRef();
  //   // if (inputRef.current) {
  //   //   console.log(inputRef.current.splide.length);
  //   // }
  // });

  return (
    <>
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
        <div className="h1-screen w1-screen flex flex-row  left-1/4 right-1/4 -z-0 bg-[#EED3CC]">
          <div className="flex m-auto w-[100%]">
            <div className="flex justify-around">
              <section className="pb-10">
                <div className="w-[100%] m-auto sm:text-[1em] md:text-[1.5em] lg:text-[2em] px-10 sm:leading-relaxed lg:leading-loose text-center font-roboto">
                  {/*<div className="mt-0">
                     <div
                      id="splide"
                      className="splide m-auto w-[60%] h-[40%] md:w-[80%] md:h-[30%]"
                    >
                      <Splide
                        aria-label="SLSQ"
                        // ref={inputRef}
                        options={{
                          rewind: true,
                          width: 1700,
                          // gap: "1rem",
                          type: "loop",
                          wheelMinThreshold: 100,
                          autoplay: true,
                          pauseOnHover: true,
                          resetProgress: false,
                          height: "40rem",
                          mediaQuery: "min",
                        }}
                        // onArrowsMounted={(splide, prev, next) => {
                        //   console.log(prev, next);
                        // }}
                      >
                        <SplideSlide>
                          <img
                            src={poster1}
                            alt="Poster"
                            className="w-[40%] m-auto"
                          />
                        </SplideSlide>
                        <SplideSlide>
                          <img
                            src={beach2}
                            alt="Beach 2"
                            className="w-[40%] m-auto"
                          />
                        </SplideSlide>
                        <SplideSlide>
                          <img
                            src={beach3}
                            alt="Beach 3"
                            className="w-[40%] m-auto"
                          />
                        </SplideSlide>
                        <SplideSlide>
                          <img
                            src={beach4}
                            alt="Beach 4"
                            className="w-[100%] m-auto"
                          />
                        </SplideSlide>
                        <SplideSlide>
                          <img
                            src={beach5}
                            alt="Beach 5"
                            className="w-[80%] m-auto"
                          />
                        </SplideSlide>
                        <SplideSlide>
                          <img
                            src={beach6}
                            alt="Beach 6"
                            className="w-[40%] m-auto"
                          />
                        </SplideSlide>
                        <SplideSlide>
                          <img
                            src={train}
                            alt="Train"
                            className="w-[50%] m-auto"
                          />
                        </SplideSlide>
                        <SplideSlide>
                          <img src={lotus} alt="Lotus" />
                        </SplideSlide>
                        <SplideSlide>
                          <img src={bus} alt="bus" className="w-[90%] m-auto" />
                        </SplideSlide>
                        <SplideSlide>
                          <img
                            src={peacock}
                            alt="Peacock"
                            className="w-[70%] m-auto"
                          />
                        </SplideSlide>
                        <SplideSlide>
                          <img src={lotus} alt="Lotus" />
                        </SplideSlide>
                        <SplideSlide>
                          <img
                            src={elephant}
                            alt="Elephant"
                            className="w-[50%] m-auto"
                          />
                        </SplideSlide>
                        <SplideSlide>
                          <img src={nineArchBridge} alt="Nine Arch Bridge" />
                        </SplideSlide>
                        <SplideSlide>
                          <img src={sigiriya} alt="Sigiriya" />
                        </SplideSlide>
                      </Splide>
                    </div>
                  </div> */}
                  <div className="sm:text-body-laptop md:text-[2.1em] lg:text-[2.3em] pt-10 pb-10 text-center">
                    Welcome! ආයුබෝවන් , வணக்கம், اَلسَّلامُ عَلَيْكُم and G’day
                  </div>
                  <div className="white-text-container">
                    <div>
                      <div
                        className="text-content bg1-[url('/public/69-694072_roses-rose-pinkroses-pink-flowers-flower-floral-circle.png')] 
                        bg1-[url('/public/beach6.jpg')] bg-no-repeat bg-contain bg-center"
                      >
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
                  </div>
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
