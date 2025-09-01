type EventType = "Past" | "UpComing" | "Notice-board";

type ImageCard = {
  url: string;
  alt: string;
  event: EventType;
  key: string;
};

const Card = ({ url, alt, event, key }: ImageCard) => {
  const index = url.lastIndexOf("/");
  const file = url.substring(index + 1);

  return (
    <div className="shadow-2xl shadow-gray-500 p-5" key={key}>
      <img
        src={
          event === "Past"
            ? require("../assets/events/" + file)
            : event === "UpComing"
            ? require("../assets/upcoming-events/" + file)
            : require("../assets/notice-board/" + file)
        }
        alt={alt}
        className="border-gray-600 m-auto  hover:border-gray-900"
      />
    </div>
  );
};

export default Card;
