import ListingTable from "@/components/ui/ListingTable";
import { Dot } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Syllabus",
  description:
    "Find the latest syllabus for all government exams. Stay updated with the latest exam patterns and syllabus details.",
  alternates: {
    canonical: "https://newsarkariresult.co.in/syllabus",
  },
};

export default function SyllabusPage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-2">Syllabus</h1>
      <p className=" text-lg" >
        Welcome to <span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span>. Stay informed about the Syllabus of various competitive exams conducted by government bodies across India, whether you are waiting for the Syllabus of any recruitment exam, entrance exam or any other government exam then we update the Syllabus from time to time to keep you informed.
        <span className="text-xl text-[#0C0A8D]"><Link href='/'> Latest Updates</Link></span></p>
      <p className="mb-4">
        <Dot className="inline-block w-10 -mx-2 h-10 -my-1 align-middle" />
        <span className="text-xl font-semibold text-[#0C0A8D] ">
          <Link href='/'>Sarkari Result </Link>
        </span>
        में आपका स्वागत है। भारत भर में सरकारी निकायों द्वारा आयोजित विभिन्न प्रतियोगी परीक्षाओं के सिलेबस के बारे में सूचित रहें, चाहे आप किसी भी भर्ती परीक्षा, प्रवेश परीक्षा या किसी अन्य सरकारी परीक्षा के सिलेबस का इंतजार कर रहे हों, तो हम आपको सूचित रखने के लिए समय-समय पर सिलेबस को अपडेट करते हैं।
      </p>

      <ListingTable
        title="Syllabus"
        category="syllabus"
        items={100} // Set items per page
      />
    </div>
  );
}
