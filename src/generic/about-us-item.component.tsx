type item = {
  text: string;
  liClass: string;
  spanClass: string;
};

const AboutUsItem = ({ text, liClass, spanClass }: item) => {
  return (
    <>
      <li className={liClass ?? ""}>
        <span className={spanClass ?? ""}>To</span>
        {text}
      </li>
    </>
  );
};

export default AboutUsItem;
