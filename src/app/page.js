import Hero from "@/components/Hero";
import MenuButton from "@/components/MenuButton";
import Image from "next/image";

export default function Home() {
  return (
    <div className="overflow-hidden relative">
      <div className="absolute top-5 left-5 w-full h-full">
        <MenuButton/>
      </div>  
      <Hero/>
    </div>
  );
}
