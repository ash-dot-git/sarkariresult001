import ListingTable from "@/components/ui/ListingTable";
import { Dot } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Results",
  description:
    "Check the latest government exam results. Get timely updates and direct links to view your results.",
  alternates: {
    canonical: "https://newsarkariresult.co.in/result",
  },
};

export default function ResultPage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl text-[#0C0A8D] tracking-wide font-bold mb-2">Result</h1>
      <p className="text-lg" >
        Welcome to <span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span>.Stay informed about the results of various competitive exams conducted by government bodies across India, whether you are waiting for the results of any recruitment exam, entrance exam or any other government exam then we update the results from time to time to keep you informed.
      <span className="text-xl text-[#0C0A8D]"><Link href='/'> Latest Updates</Link></span></p>
      <p className="mb-4">
        <Dot className="inline-block w-10 -mx-2 h-10 -my-1 align-middle" /><span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span> में आपका स्वागत है। आप पुरे भारत में सरकारी संस्थानों द्वारा आयोजित विभिन्न प्रतियोगी परीक्षाओं के परिणामों के बारे में सूचित रहें, चाहे आप किसी भी भर्ती परीक्षा, प्रवेश परीक्षा या किसी अन्य सरकारी परीक्षा के परिणाम की प्रतीक्षा कर रहे हों, तो हम आपको सूचित रखने के लिए समय-समय पर परिणाम अपडेट करते हैं।
      </p>
      <ListingTable
        title="All Latest Examination Results"
        category="result"
        items={100} // Set items per page
      />
    </div>
  );
}
