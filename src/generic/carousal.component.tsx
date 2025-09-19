import { Splide, SplideTrack } from "@splidejs/react-splide";

// Default theme
import "@splidejs/react-splide/css";

// or other themes
import "@splidejs/react-splide/css/skyblue";
import "@splidejs/react-splide/css/sea-green";

// or only core styles
import "@splidejs/react-splide/css/core";

import { Images } from "./../data/carousal-images";
import SpliderSlideImage from "./splider-slide-image.component";

const Carousal = () => {
  return (
    <div>
      <div
        className="w-full mt-6 m-auto 
                   shadow-[0px_10px_20px_0px_rgba(000,_10,_10,_0.15)] mx-auto md:mx-0
                   border-2 border-white rounded-lg border1-4 border1-blue-600 p-0"
      >
        {/* splide width cannot be set 100% since image becomes disfigured with 
        its original width. 80% is the best max */}

        <div id="splide" className="splide m-auto w-[100%]">
          <Splide
            hasTrack={false}
            aria-label="Sri Lankan images"
            options={{
              rewind: true,
              // autoWidth: true,
              // heightRatio: 1,
              // width: 2300,
              // height: "28rem",
              // lazyLoad: "sequential",
              // easing:linear,
              // width: "100vw",
              padding: { left: 0, right: 0, top: 0, bottom: 0 },
              type: "loop",
              wheelMinThreshold: 100,
              autoplay: true,
              pauseOnHover: true,
              resetProgress: false,

              breakpoints: {
                320: {
                  width: 420,
                  height: "3rem",
                },
                375: {
                  width: 1000,
                  height: "7rem",
                },
                425: {
                  width: 1000,
                  height: "7rem",
                },
                700: {
                  width: 1500,
                  height: "15rem",
                },
                667: {
                  width: 1000,
                  height: "15rem",
                },
                768: {
                  width: 1000,
                  height: "14rem",
                },
                1024: {
                  width: 2500,
                  height: "19rem",
                },
                1440: {
                  width: 2300,
                  height: "28rem",
                },
                2560: {
                  width: 2600,
                  height: "30rem",
                },
              },
            }}
          >
            <SplideTrack>
              {Images.map((image) => {
                return (
                  <SpliderSlideImage
                    imageUrl={image.imageUrl}
                    alt={image.alt}
                    classname={image.classname}
                  />
                );
              })}
            </SplideTrack>

            <div className="splide__progress">
              <div className="splide__progress__bar" />
            </div>

            <button className="splide__toggle mt-2" type="button">
              <span className="splide__toggle__play">Play</span>
              <span className="splide__toggle__pause">Pause</span>
            </button>
          </Splide>
        </div>
      </div>
    </div>
  );
};

export default Carousal;
