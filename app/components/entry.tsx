'use client'

import dynamic from "next/dynamic";

const DynamicPlayer = dynamic(() => import("./player"), {
  ssr: false,
});

const Entry = () => {
  return <DynamicPlayer />;
}

export default Entry