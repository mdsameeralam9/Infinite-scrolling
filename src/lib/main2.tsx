import React, { useState } from "react";
import InfiniteScroll from "./Fun";

const style: React.CSSProperties = {
  height: 30,
  border: "1px solid green",
  margin: 6,
  padding: 8,
};

const App: React.FC = () => {
  const [items, setItems] = useState<unknown[]>(Array.from({ length: 20 }));

  const fetchMoreData = () => {
    setTimeout(() => {
      setItems((prevItems) => [...prevItems, ...Array.from({ length: 20 })]);
    }, 1500);
  };

  return (
    <div>
      <h1>demo: Pull down to refresh</h1>
      <hr />
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        pullDownToRefresh
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>
            ↓ Pull down to refresh
          </h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>
            ↑ Release to refresh
          </h3>
        }
        refreshFunction={fetchMoreData}
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
