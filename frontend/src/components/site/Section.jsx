import React from "react";
export default function Section({ id, className = "", children, wide = false }) {
  return (
    <section id={id} className={`py-14 sm:py-20 lg:py-24 ${className}`}>
      <div className={`relative z-[1] mx-auto w-full ${wide ? "max-w-[1240px]" : "max-w-6xl"} px-4 sm:px-6 lg:px-10`}>
        {children}
      </div>
    </section>
  );
}
