'use client';

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Menu as MenuIcon, Search, ChevronDown } from "lucide-react";

// Lazy load SearchModal to avoid SSR issues
const SearchModal = dynamic(() => import("../modals/SearchModal"), {
    ssr: false,
});

const menuItems = [
    { label: "Home", href: "/" },
    { label: "Latest Job", href: "/latest-jobs" },
    { label: "Admit Card", href: "/admit-cards" },
    { label: "Result", href: "/result" },
    { label: "Admission", href: "/admission" },
    { label: "Syllabus", href: "/syllabus" },
    { label: "Answer Key", href: "/answer-key" },
];

const moreItems = [
    { label: "Documents", href: "/documents" },
    { label: "Offline Form", href: "/offline-form" },
    { label: "Sarkari Yojna", href: "/sarkari-yojna" },
    { label: "Upcoming", href: "/upcoming" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
];

export default function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="sticky top-0 z-50">
            <nav className="bg-[#05055f] h-[47px] flex items-center justify-between px-4 relative z-30">
                {/* Mobile hamburger */}
                <div
                    className="md:hidden text-white flex items-center"
                >
                    <h2 className="text-lg font-semibold cursor-pointer transform transition duration-200 leading-tight hover:scale-105  active:scale-105 active:text-[#e65100]">
                        {/* style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}> */}
                        <Link href="https://newsarkariresult.co.in" title="Sarkari Result">
                            {/* <span style={{ background: 'linear-gradient(to right, #FF9933, #000080, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> */}
                            Sarkari Result | NewSarkariResult.Co.In
                            {/* </span> */}
                        </Link>
                    </h2>
                </div>

                {/* Desktop menu */}
                <ul className="hidden md:flex text-white h-full items-center leading-tight tracking-wide">
                    {menuItems.map((item, index) => (
                        <li key={item.label} className="h-[47px]">
                            {/* <li key={item.label} className={`h-[47px] ${index > 0 ? 'border-l border-gray-400' : ''}`}> */}
                            <Link
                                href={item.href}
                                prefetch={true}
                                title={item.label}
                                className="px-2 hover:bg-[#982704] h-full flex items-center transition-colors duration-200"
                            // style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                            >
                                {/* <span style={{ background: 'linear-gradient(to right, #FF9933, #000080, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> */}
                                {item.label}
                                {/* </span> */}
                            </Link>
                        </li>
                    ))}
                    <li
                        className="relative h-[47px]"
                        onMouseEnter={() => setIsMoreOpen(true)}
                        onMouseLeave={() => setIsMoreOpen(false)}
                    >
                        <div className="h-full flex items-center px-2 cursor-pointer hover:bg-[#982704]">
                            <span className="text-sm font-semibold" title="View More Options" >
                                {/* style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}> */}
                                {/* <span style={{ background: 'linear-gradient(to right, #FF9933, #000080, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> */}
                                More
                                {/* </span> */}
                            </span>
                            <ChevronDown className="w-4 h-4 ml-1 text-white" />
                        </div>
                        {isMoreOpen && (
                            <ul className="absolute top-[47px] left-0 bg-[#4c4c4c]/90 text-white min-w-[180px] flex flex-col z-40">
                                {moreItems.map((sub) => (
                                    <li key={sub.label}>
                                        <Link
                                            href={sub.href}
                                            prefetch={true}
                                            title={sub.label}
                                            className="block px-4 py-2 text-sm font-semibold hover:bg-[#cd0808]"
                                            onClick={() => setIsMoreOpen(false)}
                                        >
                                            {sub.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                </ul>


                {/* Mobile hamburger */}
                <div
                    className="md:hidden text-white flex items-center cursor-pointer"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <MenuIcon className="w-6 h-6 mr-1" />
                    <span className="text-sm font-semibold" >
                        {/* style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}> */}
                        {/* <span style={{ background: 'linear-gradient(to right, #FF9933, #000080, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> */}
                        Menu
                        {/* </span> */}
                    </span>
                </div>

                {/* Search button */}
                <button
                    onClick={() => setShowModal(true)}
                    className="hidden md:flex cursor-pointer items-center self-center text-white hover:bg-[#982704] px-3 h-full"
                    aria-label="Search"
                    title="Search"
                >
                    <Search className="w-5 h-5" aria-hidden="true" />
                </button>
            </nav>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-[#05055f] text-white flex flex-col p-4 gap-2 z-35">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            title={item.label}
                            prefetch={true}
                            className="block hover:bg-[#982704] px-3 py-2 rounded"
                            onClick={() => setIsMobileMenuOpen(false)}
                        // style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
                        >
                            {/* <span style={{ background: 'linear-gradient(to right, #FF9933, #000080, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> */}
                            {item.label}
                            {/* </span> */}
                        </Link>
                    ))}
                    <details className="group">
                        <summary className="cursor-pointer px-3 py-2 rounded hover:bg-[#982704] flex items-center justify-between">
                            {/* style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}> */}
                            {/* <span style={{ background: 'linear-gradient(to right, #FF9933, #000080, #138808)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> */}
                            More
                            {/* </span> */}
                            <ChevronDown className="w-4 h-4" />
                        </summary>
                        <div className="pl-3 flex flex-col mt-1">
                            {moreItems.map((sub) => (
                                <Link
                                    key={sub.label}
                                    href={sub.href}
                                    title={sub.label}
                                    prefetch={true}
                                    className="text-sm py-1 hover:text-red-300"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {sub.label}
                                </Link>
                            ))}
                        </div>
                    </details>
                </div>
            )}

            {/* Floating Search Button for Mobile */}
            <div className="md:hidden fixed bottom-10 right-10 z-50">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    aria-label="Search"
                >
                    <Search className="w-6 h-6" />
                </button>
            </div>

            {/* Search Modal */}
            {showModal && (
                <SearchModal onClose={() => setShowModal(false)} />
            )}
        </div>
    );
}
