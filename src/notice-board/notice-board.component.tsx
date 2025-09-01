import Card from "../generic/card.component";

const NoticeBoard = () => {
  return (
    <div>
      <div className="container flex m-auto">
        <div className="w-[100%] mx-5 mt-5">
          <div className="flex flex-col m-auto columns-1 justify-items-center gap-5 p-5">
            <div className="w-[100%] shadow-2xl p-5">
              <Card
                url="../assets/notice-board/Daily-News-Article.jpg"
                alt="Daily News Article"
                event="Notice-board"
                key="../assets/notice-board/Daily-News-Article.jpg"
              />
            </div>
            <div className="w-[100%] shadow-2xl p-5">
              <Card
                url="../assets/notice-board/New-Doc-2018-06-08-1_1-1024x708.jpg"
                alt="New Doc 8 June 2018"
                event="Notice-board"
                key="../assets/notice-board/New-Doc-2018-06-08-1_1-1024x708.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
