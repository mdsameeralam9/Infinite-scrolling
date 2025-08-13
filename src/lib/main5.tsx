import React, { useState } from "react";
import InfiniteScroll from "./Fun";

const WindowInfiniteScrollComponent: React.FC = () => {
  const [data, setData] = useState<number[]>(new Array(100).fill(1));

  const next = () => {
    setTimeout(() => {
      const newData = [...data, ...new Array(100).fill(1)];
      setData(newData);
    }, 2000);
  };

  return (
    <>
      <InfiniteScroll
        hasMore={true}
        next={next}
        loader={<h1>Loading...</h1>}
        dataLength={data.length}
      >
        {data.map((_, i) => (
          <div
            key={i}
            style={{ height: 30, margin: 4, border: "1px solid hotpink" }}
          >
            #{i + 1} row
          </div>
        ))}
      </InfiniteScroll>
    </>
  );
};

export default WindowInfiniteScrollComponent;
