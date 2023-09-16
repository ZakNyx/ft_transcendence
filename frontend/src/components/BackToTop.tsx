import React, { useEffect, useState } from "react";

export default function BackToTop() {
  const [backToTopButton, setBackToTopButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100)
        setBackToTopButton(true);
      else
        setBackToTopButton(false);
    });
  }, []);

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
  <div className="">
    {backToTopButton && (
      <button onClick={scrollUp} className=" fixed bottom-12 right-12 h-6 md:h-12 w-6 md:w-12 rounded-full font-bold text-xl bg-npc-light-gray hover:bg-gray-400 hover:transition-all ">
      ^</button>
    )}
  </div>);
}
