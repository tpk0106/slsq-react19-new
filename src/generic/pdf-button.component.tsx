interface PdfButtonProps {
  label: string;
  onClick: () => void;
}

const PdfButton = ({ label, onClick }: PdfButtonProps) => {
  return (
    <div className="py-5">
      <button
        type="button"
        onClick={onClick}
        className="bg-[#800020] text-white rounded-[.2em]
                   px-3 md:px-4 lg:px-10 mt-2 mb-2 my-2 mx-2 p-1
                   shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)]
                   hover:cursor-pointer
                   hover:text-black
                   hover:bg-[#FFF]
                   hover:border-[#000]
                   hover:shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)]"
      >
        {label}
      </button>
    </div>
  );
};

export default PdfButton;
