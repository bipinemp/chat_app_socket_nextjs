"use client";

import { FC } from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-10 xl:px-28 2xl:px-52">
      {children}
    </div>
  );
};

export default Container;
