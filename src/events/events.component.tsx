import { PastEventsData } from "../data/past-events";
import Card from "../generic/card.component";

const Events = () => {
  return (
    <div className="pb-5">
      <div className="max-w-[70%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-5 my-5">
        <div className="flex m-auto">
          <section className="py-10 px-5 w-[100%]">
            <div
              className="text-base md:text-[1.2rem] lg:text-[1.5rem] xl:text-[1.8rem] 2xl:text-[2.2rem] 
                text-center text-content drop-shadow-[2px_2px_rgba(255,255,255,1)] text-[#7F1734] font-[900]"
            >
              Past events
              <hr className="border-1 border-[#800020] mt-2" />
            </div>
            <div className="flex-auto w-[100%] p-4 columns-1 justify-items-center ">
              {PastEventsData.map((img, index) => {
                return (
                  <Card url={img.url} alt={img.alt} event="Past" key={index} />
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Events;
