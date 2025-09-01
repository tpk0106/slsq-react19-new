import Card from "../generic/card.component";

const UpComingEvents = () => {
  return (
    <>
      <div className="max-w-[70%] m-auto shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)] mt-0 my-5">
        <div className="flex m-auto">
          <section className="py-10 px-5 w-[100%]">
            <div className="flex-auto w-[100%] m-auto p-4 columns-1 justify-items-center gap-5">
              <Card
                url="../assets/upcoming-events/New-Year-2021-page-001-1583x2048.jpg"
                alt="New Year 2021"
                event="UpComing"
                key="../assets/upcoming-events/New-Year-2021-page-001-1583x2048.jpg"
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default UpComingEvents;
