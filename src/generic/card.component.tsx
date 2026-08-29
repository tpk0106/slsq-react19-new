import { resolveAsset } from "../utils/resolve-asset";

type EventType = "Past" | "UpComing" | "Notice-board";

type ImageCard = {
  url: string;
  alt: string;
  event: EventType;
};

const Card = ({ url, alt, event }: ImageCard) => {
  const index = url.lastIndexOf("/");
  const file = url.substring(index + 1);

  const imgSrc =
    event === "Past"
      ? resolveAsset(require("../assets/events/" + file))
      : resolveAsset(require("../assets/notice-board/" + file));

  return (
    <div className="shadow-2xl shadow-gray-500 p-5">
      <img
        src={imgSrc}
        alt={alt}
        className="border-gray-600 m-auto  hover:border-gray-900"
      />
    </div>
  );
};

export default Card;
