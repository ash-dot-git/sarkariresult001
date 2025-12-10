"use client";

import Image from "next/image";

export default function Template1({
  orgName,
  postTitle,
  totalPosts,
  startDate,
  endDate,
  cyberName,
  whatsappLink,
  articleLink,
}) {
  return (
    <div className="relative w-[1000px] h-[600px] bg-white text-black flex flex-col border-[8px] border-blue-800 rounded-lg overflow-hidden shadow-xl p-6 font-sans">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-start mb-2">
        {/* Website QR */}
        <div className="flex flex-col items-center">
          <img
            src="/qrs/newsarkariresult_qr.png"
            alt="Website QR"
            width={70}
            height={70}
            className="border border-gray-400 rounded-sm bg-white"
          />
          <p className="text-[10px] mt-1 text-gray-600 font-medium">
            Website
          </p>
        </div>

        {/* Center Site Name with optional Cyber Name */}
        <div className="text-center leading-tight flex flex-col items-center">
          <h2 className="text-lg font-extrabold text-blue-800 tracking-wide">
            NEWSARKARIRESULT.CO.IN
          </h2>

          {/* Optional cyberName with generic message */}
          {cyberName && (
            <p className="text-[12px] text-gray-700 italic mt-1">
              Proudly shared by <span className="font-semibold text-blue-600">{cyberName}</span>
            </p>
          )}

          <p className="text-[12px] text-gray-600 mt-1">
            Scan or Visit for Latest Updates
          </p>
        </div>

        {/* Right QR (WhatsApp) */}
        <div className="flex flex-col items-center">
          <img
            src="/qrs/whatsappchannel_qr.webp"
            alt="WhatsApp Channel"
            width={70}
            height={70}
            className="border border-gray-400 rounded-sm bg-white"
          />
          <p className="text-[10px] mt-1 text-gray-600 font-medium">
            WhatsApp
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[2px] bg-blue-800 my-1" />

      {/* ===== Main Content ===== */}
      <div className="flex flex-col items-center justify-center text-center flex-grow px-6">
        {/* Organization Name */}
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase mb-2 text-blue-800">
          {orgName || "ORGANIZATION / BOARD NAME"}
        </h1>

        {/* Post / Exam Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-red-700 uppercase mb-1">
          {postTitle || "POST / EXAM / RESULT TITLE"}
        </h2>

        {/* Total Posts */}
        {totalPosts && (
          <p className="text-xl text-gray-700 mb-2 font-medium">
            Total Posts:{" "}
            <span className="font-bold text-blue-800">{totalPosts}</span>
          </p>
        )}

        {/* Dates Section */}
        <div className="border-[3px] border-blue-800 rounded-md text-lg px-5 py-2 max-w-[560px] w-full">
          <h3 className="text-xl font-bold text-blue-800 mb-3 underline">
            Important Dates
          </h3>
          <div className="flex justify-between text-lg font-semibold text-black">
            <p>
              <span className="text-green-700">Start Date:</span>{" "}
              {startDate || "—"}
            </p>

            <p>
              <span className="text-red-700 ml-[.5]">Last Date:</span>{" "}
              {endDate || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <div className="text-center text-[14px] font-medium border-t-[2px] border-blue-800 pt-2 mt-4">
        <p>
          Interested candidates can{" "}
          <a
            href={articleLink || "https://newsarkariresult.co.in"}
            className="text-blue-800 underline font-bold"
          >
            read full notification
          </a>{" "}
          before applying or{" "}
          <a
            href={whatsappLink || "#"}
            className="text-green-700 underline font-bold"
          >
            join WhatsApp channel
          </a>
          .
        </p>
      </div>
    </div>
  );
}
