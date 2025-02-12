"use client";
import React, { useEffect, useRef } from "react";

export const SplashCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const background = backgroundRef.current;

    if (!cursor || !background) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;
      cursor.style.transform = `translate(-50%, -50%) scale(1)`;
      
      const trail = document.createElement("div");
      trail.className =
        "fixed w-8 h-8 rounded-full pointer-events-none bg-gradient-to-r from-pink-500 to-orange-500 opacity-50";
      trail.style.left = `${clientX}px`;
      trail.style.top = `${clientY}px`;
      trail.style.transform = "translate(-50%, -50%)";
      background.appendChild(trail);

      setTimeout(() => {
        trail.style.opacity = "0";
        setTimeout(() => {
          if (background.contains(trail)) {
            background.removeChild(trail);
          }
        }, 200);
      }, 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={backgroundRef}
        className="fixed inset-0 pointer-events-none z-50"
      >
        <div
          ref={cursorRef}
          className="fixed w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 pointer-events-none z-50 mix-blend-screen"
        />
      </div>
    </>
  );
};
