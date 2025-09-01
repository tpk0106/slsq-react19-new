import { DownloadIcon } from "./icons.component";

type DownloadButton = {
  handleClick: () => void;
  // icon: any; // typeof FontAwesomeIcon;
  text: string;
};

const Download = ({ handleClick, text }: DownloadButton) => {
  return (
    <>
      <div className="flex justify-around" key={text}>
        <button
          onClick={() => handleClick()}
          className="flex bg-[#800020] text-white rounded-sm px-15 md:px-5 lg:px-10 mt-2 mb-2 my-2 mx-2 p-1 shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)]
          hover:cursor-pointer hover:text-black hover:bg-[#FFF] hover:border-[#000] hover:shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)]"
        >
          <DownloadIcon cssstyle="w-[1em] h-[1em] mt-1" />
          <span className="pl-3">{text}</span>
        </button>
      </div>
    </>
  );
};

export default Download;
