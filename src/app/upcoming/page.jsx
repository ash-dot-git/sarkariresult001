// import ListingTable from "@/components/ui/ListingTable";
// import { Dot } from "lucide-react";
// import Link from "next/link";

// export const metadata = {
//   title: "Upcoming",
//   description:
//     "Find the latest upcoming for all government exams. Stay updated with the latest exam patterns and upcoming details.",
//   alternates: {
//     canonical: "https://newsarkariresult.co.in/upcoming",
//   },
// };

// export default function UpcomingPage() {
//   return (
//     <div className="container mx-auto px-4 py-4">
//       <h1 className="text-3xl font-bold mb-2">Upcoming</h1>
//       <p className=" text-lg" >
//         Welcome to <span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span>. Stay informed about the Upcoming of various competitive exams conducted by government bodies across India, whether you are waiting for the Upcoming of any recruitment exam, entrance exam or any other government exam then we update the Upcoming from time to time to keep you informed.
//         <span className="text-xl text-[#0C0A8D]"><Link href='/'> Latest Updates</Link></span></p>
//       <p className="mb-4">
//         <Dot className="inline-block w-10 -mx-2 h-10 -my-1 align-middle" />
//         <span className="text-xl font-semibold text-[#0C0A8D] ">
//           <Link href='/'>Sarkari Result </Link>
//         </span>
//         में आपका स्वागत है। भारत भर में सरकारी निकायों द्वारा आयोजित विभिन्न प्रतियोगी परीक्षाओं के सिलेबस के बारे में सूचित रहें, चाहे आप किसी भी भर्ती परीक्षा, प्रवेश परीक्षा या किसी अन्य सरकारी परीक्षा के सिलेबस का इंतजार कर रहे हों, तो हम आपको सूचित रखने के लिए समय-समय पर सिलेबस को अपडेट करते हैं।
//       </p>

//       <ListingTable
//         title="Upcoming"
//         category="upcoming"
//         items={100} // Set items per page
//       />
//     </div>
//   );
// }
import RelatedPosts from "@/components/sections/RelatedPosts";
import ListingTable from "@/components/ui/ListingTable";
import { Dot } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Upcoming Government Exams & Sarkari Notifications - Sarkari Result",
  description:
    "Get the latest updates on upcoming government exams, admit cards, results, answer keys, and recruitment notifications across India. Stay informed with accurate, verified, and real-time updates from Sarkari Result.",
  alternates: {
    canonical: "https://newsarkariresult.co.in/upcoming",
  },
  keywords: [
    "Upcoming Sarkari Exam",
    "Government Exam Updates",
    "Sarkari Result 2025",
    "Admit Cards",
    "Answer Key",
    "Recruitment Notifications",
    "Job Vacancies",
    "Government Jobs India",
    "Sarkari Result",
  ],
};

export default function UpcomingPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4 text-red-600">
        Upcoming Government Exams, Results & Notifications
      </h1>

      {/* Detailed SEO-friendly description */}
      <p className="text-lg mb-4">
        Welcome to <span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span>, your trusted platform for all government exam updates in India. Here, you can find real-time information about upcoming <strong>government job vacancies, exam dates, admit card releases, answer keys, and official notifications</strong> from central and state authorities.
      </p>


      <p className="mb-4 text-gray-700">
        <Dot className="inline-block w-6 h-6 mr-2 align-middle" />
        <span className="text-xl font-semibold text-[#0C0A8D]"><Link href='/'>Sarkari Result</Link></span> में आपका स्वागत है। भारत भर में सरकारी निकायों द्वारा आयोजित विभिन्न प्रतियोगी परीक्षाओं के आगामी विवरण, रिजल्ट, एडमिट कार्ड, परीक्षा तिथियां और भर्ती सूचनाएं सबसे पहले प्राप्त करें। हमारी टीम आधिकारिक स्रोतों से सत्यापित जानकारी समय पर अपडेट करती है ताकि अभ्यर्थियों को किसी भी महत्वपूर्ण तिथि की जानकारी से वंचित न रहना पड़े।
      </p>

      <p className="mb-6 text-gray-700">
        इस पृष्ठ पर आपको सभी आगामी सरकारी परीक्षाओं, भर्ती अधिसूचनाओं, एडमिट कार्ड, उत्तर कुंजी और परिणाम की जानकारी क्रमबद्ध और सरल तरीके से मिलेगी। नवीनतम अपडेट्स के लिए हमारी <span className="text-[#0C0A8D] font-semibold"><Link href='/latest'>Latest Updates</Link></span> सेक्शन देखें और समय रहते तैयारी शुरू करें।
      </p>

      {/* Listing Table */}
      <ListingTable
        title="Upcoming Exams & Notifications"
        category="upcoming"
        items={100} // Items per page
      />
      <p className="mb-4">
        Our experienced team monitors official government portals, recruitment boards, and employment news daily to ensure you receive the most accurate and verified information. We update details immediately after official announcements so that aspirants can plan their preparation without missing any important dates.
      </p>

      <p className="mb-4">
        This page lists <strong>upcoming exams, recruitment notifications, admit card releases, result announcements, and other government-related updates</strong> in a structured and easy-to-access format. Stay ahead in your preparation with <span className="text-xl text-[#0C0A8D]"><Link href='/latest'>Latest Updates</Link></span> and never miss any important information from central or state government bodies.
      </p>
      {/* Additional SEO paragraph */}
      <p className="mt-6 text-gray-800 text-sm leading-relaxed">
        At Sarkari Result, we focus on providing <strong>100% accurate and verified information</strong> about upcoming government jobs, exams, results, admit cards, answer keys, and official notices. Our coverage includes exams from UPSC, SSC, Banking, Railways, State Governments, Teaching, Defence, Police, PSU, and Judiciary. All updates are sourced directly from official portals and verified multiple times for authenticity.
        Stay connected with us to never miss any important government notification and get your exam preparation on track.
      </p>

      <RelatedPosts category={'new'} currentPostId={''} items={10} />
    </div>
  );
}
