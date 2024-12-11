import React from "react";
import Image from "next/image";
import catDownload from "../../image/loaderpage.gif";
interface Props {
  className?: string;
}

export const Loading: React.FC<Props> = ({}) => {
  return (
    <div className="flex items-center justify-center w-full mt-10 ">
      <Image src={catDownload} priority={true} alt="" width={100} height={100} />
    </div>
  );
};
