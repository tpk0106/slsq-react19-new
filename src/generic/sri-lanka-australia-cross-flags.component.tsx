import flagLarge from "./../assets/images/srilanka_australia_crossed_flags-large.jpg";
import flagSmall from "./../assets/images/srilanka_australia_crossed_flags-small.jpg";

const SriLankaAustraliaCrossFlags = () => {
  return (
    <div>
      <img
        src={flagLarge}
        srcSet={`${flagLarge} 1080w, ${flagSmall} 425w`}
        alt="Sri Lanka and Australia Cross Flags"
        className="md:w-[100%] md:h-[50%] lg:w-[100%] auto xl:w-[100%] auto 2xl:w-[100%] auto mx-auto"
      />
    </div>
  );
};

export default SriLankaAustraliaCrossFlags;
