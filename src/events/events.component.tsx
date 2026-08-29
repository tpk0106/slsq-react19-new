import { useState, useEffect } from "react";
import { API_BASE } from "../config/api";

interface EventImage {
  Id: number;
  EventPosterImageUrl: string;
  Caption: string | null;
  DisplayOrder: number;
}

interface EventData {
  EventId: number;
  EventName: string;
  EventDate: string;
  Description: string | null;
  images: EventImage[];
}

const formatDate = (isoDate: string): string => {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Events = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/events?type=Event`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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

            {loading ? (
              <div className="text-center py-10 text-gray-500">
                Loading events...
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No events to display.
              </div>
            ) : (
              <div className="flex-auto w-[100%] p-4 columns-1 justify-items-center">
                {events.map((event) => (
                  <div key={event.EventId} className="mb-8 w-full">
                    <h3 className="text-lg font-bold text-[#7F1734] mb-1 text-center">
                      {event.EventName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 text-center">
                      {formatDate(event.EventDate)}
                    </p>
                    {event.Description && (
                      <p className="text-sm text-gray-600 mb-3 text-center">
                        {event.Description}
                      </p>
                    )}
                    {event.images && event.images.length > 0 ? (
                      <div className="flex flex-col items-center gap-6">
                        {event.images.map((img) => (
                          <div
                            key={img.Id}
                            className="shadow-2xl shadow-gray-500 p-5 w-full"
                          >
                            <img
                              src={`${API_BASE}${img.EventPosterImageUrl}`}
                              alt={img.Caption || event.EventName}
                              className="border-gray-600 m-auto hover:border-gray-900 w-full object-contain"
                              onError={(e) => {
                                // Hide broken images (e.g. old uploads in temp folder)
                                (e.target as HTMLImageElement).parentElement!.style.display = "none";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 text-sm">
                        No images for this event.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Events;
