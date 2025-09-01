import React, { useEffect, useState } from "react";

// const ColomboDateTime = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   // new Date().toLocaleString("en-AU", { timeZone: "Asia/Colombo" })
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     // new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })

//     return clearInterval(timer);
//   }, []);

//   return <>Colombo local Time : {currentTime.toLocaleTimeString()}</>;
// };

/* {currentTime1.toLocaleString("en-US", { timeZone: "Asia/Colombo" })} */

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Set up an interval to update the time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every 1000 milliseconds (1 second)

    // Clean up the interval when the component unmounts
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures effect runs only once on mount

  return (
    <div>
      <div>
        {currentTime.toLocaleString("en-AU", { timeZone: "Asia/Colombo" })}
      </div>
    </div>
  );
};

export default Clock;
//export default ColomboDateTime;
