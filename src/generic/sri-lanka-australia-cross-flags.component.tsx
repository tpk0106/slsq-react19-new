// import SLAUSCrossFlags_1080 from "./../assets/images/srilanka_australia_crossed_flags-155X109.jpg";
// import SLAUSCrossFlags_400 from "./../assets/images/srilanka_australia_crossed_flags-40X28.jpg";

const SriLankaAustraliaCrossFlags = () => {
  return (
    <div>
      <img
        src={require("./../assets/images/srilanka_australia_crossed_flags-large.jpg")}
        srcSet={`${require("./../assets/images/srilanka_australia_crossed_flags-large.jpg")} 1080w, 
                 ${require("./../assets/images/srilanka_australia_crossed_flags-small.jpg")} 425w`}
        // sizes="(max-width: 2560px) 2560px"
        alt="Sri Lanka and Australia Cross Flags"
        className="md:w-[100%] md:h-[50%] lg:w-[100%] auto xl:w-[100%] auto 2xl:w-[100%] auto mx-auto"
      />
    </div>
  );
};

export default SriLankaAustraliaCrossFlags;
