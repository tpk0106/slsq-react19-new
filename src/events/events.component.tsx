import { PastEventsData } from "../data/past-events";
import Card from "../generic/card.component";

const Events = () => {
  return (
    <div>
      <div className="max-w-[70%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-0 my-5">
        <div className="flex m-auto">
          <section className="py-10 px-5 w-[100%]">
            <div className="flex-auto w-[100%] m1-auto p-4 columns-1 justify-items-center gap1-3 grow1 md:columns1-2 lg:columns1-3">
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
