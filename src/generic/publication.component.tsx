import PDFGenerator from "./pdf-generator.component";
import { useState } from "react";

type publication = {
  year: number;
  months: publicationFile[];
  month: string;
  file: string;
  key: string;
};

type publicationFile = {
  date: string;
  file: string;
};

const Publication = ({ ...publication }: publication) => {
  const [showPublication, setShowPublication] = useState(false);
  const [url, setUrl] = useState<string>("");

  const handleClick = async (e: MouseEvent) => {
    const ele = e.target as HTMLElement;
    let url = ele.attributes.item(0)?.value.substring(1);

    setUrl(url!);
    setShowPublication(true);
    return;
  };

  const tags = [];
  const num = parseInt(publication.year.toString());

  if (isNaN(num)) {
    const atag = (
      <>
        <a
          href={`#../assets/publications/SLSQConstitution/${getMonth(
            publication.month
          )}/${publication.file}`}
          target="_self"
          className="bg-[#800020] text-white rounded-sm px-3 md:px-4 lg:px-10 mt-2 mb-2 my-2 mx-2 p-1 shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)]
          hover:cursor-pointer hover:text-black hover:bg-[#FFF] hover:border-[#000] hover:shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)]"
          onClick={(e: any) => handleClick(e)}
          key={publication.year}
        >
          {publication.month}
        </a>
      </>
    );
    tags.push(atag);
  } else {
    const atag = (
      <>
        <a
          href={`#../assets/publications/${publication.year.toString()}/${getMonth(
            publication.month
          )}/${publication.file}`}
          target="_self"
          className="bg-[#800020] text-white rounded-sm px-3 md:px-4 lg:px-10 mt-2 mb-2 my-2 mx-2 p-1 shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)]
          hover:cursor-pointer hover:text-black hover:bg-[#FFF] hover:border-[#000] hover:shadow-[0px_10px_20px_0px_rgba(139,_0,_0,_0.15)]"
          onClick={(e: any) => handleClick(e)}
          key={publication.year}
        >
          {publication.month}
        </a>
      </>
    );
    tags.push(atag);
  }

  //https://stackoverflow.com/questions/73922429/how-do-i-load-a-pdf-from-url-in-react-with-react-pdf
  // https://codesandbox.io/p/sandbox/react-pdf-ts-5x9z4?file=%2Fsrc%2Fcomponents%2FPDFDocument.tsx%3A62%2C40

  return (
    <>
      {tags}

      <div>
        {showPublication && (
          <PDFGenerator
            pdfurl={url}
            setParentState={() => {
              setShowPublication(false);
            }}
            key={url}
          />
        )}
      </div>
    </>
  );
};

const getMonth = (month: string) => {
  let monthName = "";
  switch (month) {
    case "January":
      return (monthName = "01");
    case "February":
      return (monthName = "02");
    case "March":
      return (monthName = "03");
    case "April":
      return (monthName = "04");
    case "May":
      return (monthName = "05");
    case "June":
      return (monthName = "06");
    case "July":
      return (monthName = "07");
    case "August":
      return (monthName = "08");
    case "September":
      return (monthName = "09");
    case "October":
      return (monthName = "10");
    case "November":
      return (monthName = "11");
    case "December":
      return (monthName = "12");
    default:
      return (monthName = "constitution");
  }
};

export default Publication;
