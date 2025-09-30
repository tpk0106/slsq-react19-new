import { SplideSlide } from "@splidejs/react-splide";

type carousal = {
  imageUrl: string;
  alt: string;
  classname: string;
};

const SpliderSlideImage = ({ ...props }: carousal) => {
  const index = props.imageUrl.lastIndexOf("/");
  const file = props.imageUrl.substring(index + 1);
  return (
    <SplideSlide>
      <img
        // data-splide-lazy={require("../assets/images/" + file)}
        src={require("../assets/images/" + file)}
        srcSet={`${require("../assets/images/" + file)} 1080w, 
                 ${require("../assets/images/mobile/" + file)} 480w`}
        // sizes="(max-width: 2560px) 2560px"
        alt={props.alt}
        className={props.classname}
      />
    </SplideSlide>
  );
};

export default SpliderSlideImage;
