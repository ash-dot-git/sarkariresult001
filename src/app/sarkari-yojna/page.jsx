import ListingTable from "@/components/ui/ListingTable";
import { Dot } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Sarkari yojna",
  description: "Discover the latest Sarkari Yojna and government schemes in India. Stay updated on new initiatives, benefits, and eligibility criteria from various government bodies across the country.",
  alternates: {
    canonical: "https://newsarkariresult.co.in/sarkari-yojna",
  },
};

export default function LatestJobsPage() {
  return (
    <div className="container mx-auto px-4 py-5">
      <h1 className="text-3xl font-bold mb-2">Sarkari Yojna</h1>
      <p className="text-lg" >
        Welcome to <span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span>. Stay informed about the Latest Jobs of various competitive exams conducted by government bodies across India, whether you are waiting for the Job Notification of any recruitment exam, entrance exam or any other government exam then we update the Latest Job from time to time to keep you informed.
      <span className="text-xl text-[#0C0A8D]"><Link href='/'> Latest Updates</Link></span></p>
      <p className="mb-4">
        <Dot className="inline-block w-10 -mx-2 h-10 -my-1 align-middle" /><span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span>  में आपका स्वागत है। यहाँ आपको भारत सरकार और राज्य सरकारों द्वारा शुरू की गई नवीनतम सरकारी योजनाओं (Sarkari Yojna) की पूरी जानकारी मिलेगी। विभिन्न सरकारी निकायों द्वारा जारी नई योजनाओं, उनके लाभ, पात्रता और आवेदन प्रक्रिया के बारे में समय-समय पर अपडेट प्राप्त करें। </p>
      <ListingTable
        title="All Latest Sarkari Yojna"
        category="sarkari-yojna"
        items={100} // Set items per page
      />
      
    </div>
  );
}
