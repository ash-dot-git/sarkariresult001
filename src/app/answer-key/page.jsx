import ListingTable from "@/components/ui/ListingTable";
import { Dot } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Answer Key",
  description:
    "NewSarkariresult.co.in के Answer Key Page पर आपका स्वागत है, यहां आप Examination के Answer Key के नवीनतम अपडेट पा सकते हैं।",
  alternates: {
    canonical: "https://newsarkariresult.co.in/answer-key",
  },
};

export default function AnswerKeyPage() {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl text-[#0C0A8D] tracking-wide font-bold mb-2">Answer Key</h1>
      <p className="text-lg" >
        Welcome to <span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span>.Stay informed about the Answer Key of various competitive exams conducted by government bodies across India, whether you are waiting for the Answer Key of any recruitment exam, entrance exam or any other government exam then we update the Answer Key from time to time to keep you informed.
      <span className="text-xl text-[#0C0A8D]"><Link href='/'> Latest Updates</Link></span></p>
      <p className="mb-4">
        <Dot className="inline-block w-10 -mx-2 h-10 -my-1 align-middle" /><span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span>में आपका स्वागत है। भारत भर में सरकारी निकायों द्वारा आयोजित विभिन्न प्रतियोगी परीक्षाओं की उत्तर कुंजी के बारे में सूचित रहें, चाहे आप किसी भी भर्ती परीक्षा, प्रवेश परीक्षा या किसी अन्य सरकारी परीक्षा की उत्तर कुंजी का इंतजार कर रहे हों, तो हम आपको सूचित रखने के लिए समय-समय पर उत्तर कुंजी अपडेट करते हैं।
      </p>
      <ListingTable
        title="Answer Key"
        category="answer-key"
        items={100} // Set items per page
      />
    </div>
  );
}
