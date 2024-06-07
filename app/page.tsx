import dynamic from "next/dynamic";

const DynamicPlayer = dynamic(() => import("./components/player"), {
  ssr: false,
});

export default function Home() {
  return <DynamicPlayer />;
}
