import React, { useEffect, useState } from "react";
import Card from "../../components/Card";
import "./index.css";
import useDocumentMeta from "../../hooks/useTitle";

const THRESHOLD = 20;

const ListWithHeight: React.FC = () => {
  useDocumentMeta({ title: "Scroll | Height" });
  const [state, setState] = useState<number[]>([]);

  const generateMoreCard = () => {
    const data = [...Array(10).keys()];
    setState((s) => [...s, ...data]);
  };

  useEffect(() => {
    generateMoreCard();
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, clientHeight, scrollTop } = e.currentTarget;
    const scrollRemain = scrollHeight - (clientHeight + scrollTop);
    if (scrollRemain < THRESHOLD) {
      generateMoreCard();
    }
  };

  return (
    <div className="listWithHeight" onScroll={(e) => handleScroll(e)}>
      {state.map((_, index) => (
        <Card key={index} label={`Card No. is ` + (index + 1)} />
      ))}
    </div>
  );
};

export default ListWithHeight;
