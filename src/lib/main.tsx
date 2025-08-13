import React, { useState } from "react";
import InfiniteScroll from "./Fun";

const style: React.CSSProperties = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8,
};

const App: React.FC = () => {
  const [items, setItems] = useState<Array<unknown>>(Array.from({ length: 20 }));
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMoreData = () => {
    if (items.length >= 500) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      setItems((prevItems) => [...prevItems, ...Array.from({ length: 20 })]);
    }, 500);
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={400}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {items.map((_, index) => (
          <div style={style} key={index}>
            div - #{index}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default App
