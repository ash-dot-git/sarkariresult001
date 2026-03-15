"use client";
import Link from "next/link";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <>
      <header>
        <div className="bg-[#cd0808] py-4 ">
          <div className="h-[160px] flex flex-col justify-center items-center text-center" style={{ fontFamily: 'Arial, sans-serif' }}>
            <Link href="/" aria-label="Sarkari Result" title="Sarkari Result">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight ">SARKARI RESULT</h1>
            <p className="text-xl sm:text-2xl md:text-[25px] font-bold text-white leading-tight ">
              NewSarkariResult.co.in
            </p>
            </Link>
          </div>
        </div>
        <Navbar />
      </header>
      {/* <header style={{ backgroundImage: "url('/15th.webp')", backgroundSize: '100% 100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="h-[160px] flex flex-col justify-center items-center text-center bg-transparent" style={{ fontFamily: 'Arial, sans-serif' }}>
          <Link href="/" aria-label="Sarkari Result" title="Sarkari Result">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight " style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            <span style={{ background: 'linear-gradient(to right, #FF9933, #000080, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Happy Independence Day
            </span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-[25px] font-bold text-white leading-tight " style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
            <span style={{ background: 'linear-gradient(to right, #FF9933, #000080, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NewSarkariResult.co.in
            </span>
          </p>
          </Link>
        </div>
        <Navbar />
      </header> */}
      
      {/* <Navbar /> */}
    </>
  );
}
