import { SplideSlide } from "@splidejs/react-splide";
import { resolveAsset } from "../utils/resolve-asset";

type carousal = {
  imageUrl: string;
  alt: string;
  classname: string;
};

const SpliderSlideImage = ({ ...props }: carousal) => {
  const index = props.imageUrl.lastIndexOf("/");
  const file = props.imageUrl.substring(index + 1);
  const mainSrc = resolveAsset(require("../assets/images/" + file));
  const mobileSrc = resolveAsset(require("../assets/images/mobile/" + file));
  return (
    <SplideSlide>
      <img
        src={mainSrc}
        srcSet={`${mainSrc} 1080w, ${mobileSrc} 480w`}
        alt={props.alt}
        className={props.classname}
      />
    </SplideSlide>
  );
};

export default SpliderSlideImage;
