import ListingTable from "@/components/ui/ListingTable";
import { Dot } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Documents",
  description:
    "Find the latest government job openings. Stay informed about various competitive exams and recruitment notifications from government bodies across India.",
  alternates: {
    canonical: "https://newsarkariresult.co.in/documents",
  },
};

export default function LatestJobsPage() {
  return (
    <div className="container mx-auto px-4 py-5">
      <h1 className="text-3xl font-bold mb-2">Documents</h1>
      <p className="text-lg" >
        Welcome to <span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span>. Stay informed about the Documents of various competitive exams conducted by government bodies across India, whether you are waiting for the Job Notification of any recruitment exam, entrance exam or any other government exam then we update the Latest Job from time to time to keep you informed.
      <span className="text-xl text-[#0C0A8D]"><Link href='/'> Latest Updates</Link></span></p>
      <p className="mb-4">
        <Dot className="inline-block w-10 -mx-2 h-10 -my-1 align-middle" /><span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span> में आपका स्वागत है। भारत भर में सरकारी निकायों द्वारा आयोजित विभिन्न प्रतियोगी परीक्षाओं की नवीनतम नौकरियों के बारे में सूचित रहें, चाहे आप किसी भी भर्ती परीक्षा, प्रवेश परीक्षा या किसी अन्य सरकारी परीक्षा की नौकरी अधिसूचना की प्रतीक्षा कर रहे हों, तो हम आपको सूचित रखने के लिए समय-समय पर नवीनतम नौकरी अपडेट करते हैं|
      </p>
      <ListingTable
        title="All Documents"
        category="documents"
        items={100} // Set items per page
      />
      
    </div>
  );
}
