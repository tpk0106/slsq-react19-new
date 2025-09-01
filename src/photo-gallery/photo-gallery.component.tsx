import { MouseEvent, useState } from "react";

import DisplayImage from "./display-image.component";
import {
  SinhalaNewYear2021,
  MemebersAndFriendsLunch,
  FoundersDayCelebrations2019,
  SLSQInvitedToBhutanKings41stBirthdayCelebrations,
  TalkByTinaFaulk,
  CleanWaterAppeal,
  SriLankanNewYearCulturalConcert2014,
  BookLaunch,
  NationalDanceTroupe2017,
  MembersAndFriendsGetTogether,
  SrilankanNewYearCulturalConcert2015,
  SrilankanNewYearCulturalConcert2016,
  SrilankanNewYearCulturalConcert2017,
  SrilankanNewYearCulturalConcert2018,
  DancingSchoolOpeningCeremony2020,
} from "../data/images";
import Button from "../generic/button.component";

let imagesSet: any;

const PhotoGallery = () => {
  const [showGallery, setShowGallery] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const galleryname = event.currentTarget as HTMLElement;

    imagesSet = [];

    switch (galleryname.textContent?.trim()) {
      case "Sinhala And Tamil New Year 2021":
        imagesSet = SinhalaNewYear2021;
        break;
      case "Members And Friends Lunch 2020":
        imagesSet = MemebersAndFriendsLunch;
        break;
      case "Dance School Opening Ceremony 2020":
        imagesSet = DancingSchoolOpeningCeremony2020;
        break;
      case "Founders Day Celebrations 2019":
        imagesSet = FoundersDayCelebrations2019;
        break;
      case "Sri Lankan New Year Cultural Concert 2018":
        console.log("2018");
        imagesSet = SrilankanNewYearCulturalConcert2018;
        break;
      case "SLSQ Invited to Bhutan King’s 41st Birthday Celebrations":
        imagesSet = SLSQInvitedToBhutanKings41stBirthdayCelebrations;
        break;
      case "Talk by Tina Faulk":
        imagesSet = TalkByTinaFaulk;
        break;
      case "Clean Water Appeal":
        imagesSet = CleanWaterAppeal;
        break;
      case "Sri Lankan New Year Cultural Concert 2014":
        imagesSet = SriLankanNewYearCulturalConcert2014;
        break;
      case "Book Launch -Dr Nimal Sedera 2017":
        imagesSet = BookLaunch;
        break;
      case "National Dance Troupe 2017":
        imagesSet = NationalDanceTroupe2017;
        break;
      case "Members and Friends Get-Together":
        imagesSet = MembersAndFriendsGetTogether;
        break;
      case "Sri Lankan New Year Cultural Concert 2015":
        imagesSet = SrilankanNewYearCulturalConcert2015;
        break;
      case "Sri Lankan New Year Cultural Concert 2016":
        console.log("SrilankanNewYearCulturalConcert2016");
        imagesSet = SrilankanNewYearCulturalConcert2016;
        break;
      case "Sri Lankan New Year Cultural Concert 2017":
        imagesSet = SrilankanNewYearCulturalConcert2017;
        break;
    }
    setShowGallery(true);
  };

  //const md = new remarkable();

  // const markup = {
  //   __html:
  //     "SLSQ Invited to Bhutan King’s 41" +
  //     <sup>st</sup> +
  //     "Birthday Celebrations",
  // };

  //const html = renderToString(markup as ReactNode);

  return (
    <>
      <div className="mx-5">
        <div
          id="photo-gallery"
          className="container m-auto w-[100%] mt-5 mb-10"
        >
          <div className="flex flex-col text-center py-5">
            <div>
              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Sinhala And Tamil New Year 2021"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)]  hover:cursor-pointer"
                />
              </div>
              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Members And Friends Lunch 2020"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)]  hover:cursor-pointer"
                />
              </div>
              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Dance School Opening Ceremony 2020"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)]  hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Founders Day Celebrations 2019"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)]  hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Sri Lankan New Year Cultural Concert 2018"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="National Dance Troupe 2017"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Book Launch -Dr Nimal Sedera 2017"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Sri Lankan New Year Cultural Concert 2017"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Sri Lankan New Year Cultural Concert 2016"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption={
                    "SLSQ Invited to Bhutan King’s 41st Birthday Celebrations"
                  }
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Sri Lankan New Year Cultural Concert 2015"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Clean Water Appeal"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Members and Friends Get-Together"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Talk by Tina Faulk"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>

              <div>
                <Button
                  onClick={(e) => handleClick(e)}
                  icon={null}
                  caption="Sri Lankan New Year Cultural Concert 2014"
                  classname="text-base md:text-[20px] lg:text-[30px] mb-5 text-white drop-shadow1-[1px_1px_rgba(0,0,0,1)] hover:drop-shadow1-[2px_2px_rgba(0,0,0,.5)] hover:cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div>
            {showGallery && (
              <DisplayImage
                images={imagesSet}
                setParentState={() => setShowGallery(false)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PhotoGallery;
