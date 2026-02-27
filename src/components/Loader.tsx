"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const title = "Signsol Design";

const Loader = () => {
  const [done, setDone] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // const hasShownLoader = sessionStorage.getItem("hasShownLoader");
    // if (hasShownLoader) {
    //   setDone(true);
    // } else {
      setShouldShow(true);
    // }
  }, []);

  useEffect(() => {
    if (!shouldShow || done) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // sessionStorage.setItem("hasShownLoader", "true");
          setDone(true);
        },
      });

      const chars = gsap.utils.toArray<HTMLSpanElement>(".loader-char");

      tl.fromTo(
        chars,
        { y: "100%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.05,
        }
      );

      tl.to(chars, {
        opacity: 0,
        y: "-40%",
        duration: 0.6,
        ease: "power3.inOut",
      });

      tl.to(
        ".loader-panel-left",
        {
          x: "-100%",
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.3"
      );

      tl.to(
        ".loader-panel-right",
        {
          x: "100%",
          duration: 0.8,
          ease: "power3.inOut",
        },
        "<"
      );
    }, loaderRef);

    return () => ctx.revert();
  }, [shouldShow, done]);

  if (done || !shouldShow) return null;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] h-[100dvh] w-full overflow-hidden"
    >
      <div className="absolute inset-0 flex">
        <div className="loader-panel-left flex-1 bg-white" />
        <div className="loader-panel-right flex-1 bg-white" />
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2 md:gap-4 text-center">
          {/* SIGNSOL */}
          <div className="overflow-hidden">
            <span className="text-5xl md:text-8xl font-bold tracking-[0.3em] uppercase text-black flex">
              {"SIGNSOL".split("").map((char, index) => (
                <span
                  key={index}
                  className="loader-char inline-block translate-y-full"
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
          
          {/* DESIGN */}
          <div className="overflow-hidden">
            <span className="text-2xl md:text-4xl font-light tracking-[0.5em] uppercase text-gray-400 flex">
              {"DESIGN".split("").map((char, index) => (
                <span
                  key={index}
                  className="loader-char inline-block translate-y-full"
                >
                  {char}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
