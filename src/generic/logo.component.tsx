import SlsqLogo from "../assets/images/SRI LANKA SOCIETY OF QUEENSLAND INC.svg";

const Logo = () => {
  return (
    <div>
      <img
        src={SlsqLogo}
        alt="Sri Lanka Society of Queensland Inc logo"
        className="md:w-[100%] auto lg:w-[100%] auto xl:w-[100%] auto 2xl:w-[50%] auto mx-auto"
      />
    </div>
  );
};

export default Logo;
