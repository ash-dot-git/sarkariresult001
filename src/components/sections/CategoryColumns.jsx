import ListingTable from "@/components/ui/ListingTable";

export default function CategoryColumns() {
  return (
    <section className="container max-w-full mx-auto px-2" aria-labelledby="category-columns-heading">
      <h2 id="category-columns-heading" className="sr-only">Job Categories</h2>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
        {/* Order: 1st Row - Results and Latest Jobs */}
        <div className="order-1">
          <ListingTable title="Results" category="result" items={25}/>
        </div>
        <div className="order-2 md:order-3">
          <ListingTable title="Latest Jobs" category="latest-jobs" items={25}/>
        </div>

        {/* Remaining Cards */}
        {/* For mobile (and sm) - hidden on md and up */}
        <div className="order-3 md:order-2 md:hidden">
          <ListingTable title="Admit Cards" category="admit-cards" />
        </div>
        {/* For desktop (md and up) - hidden below md */}
        <div className="order-3 md:order-2 hidden md:block">
          <ListingTable title="Admit Cards" category="admit-cards" items={25}/>
        </div>
        <div className="order-4">
          <ListingTable title="Answer Key" category="answer-key" />
        </div>
        <div className="order-5">
          <ListingTable title="Syllabus" category="syllabus"  />
        </div>
        <div className="order-6">
          <ListingTable title="Admission" category="admission"  />
        </div>
        <div className="order-7 md:order-8">
          <ListingTable title="Documents" category="documents"  />
        </div>
        <div className="order-8 md:order-7">
          <ListingTable title="Offline Form" category="offline-form"  />
        </div>
        <div className="order-9 ">
          <ListingTable title="Sarkari Yojna" category="sarkari-yojna"  />
        </div>
        <div className="order-10 md:hidden">
          <ListingTable title="Upcoming" category="upcoming" />
        </div>
      </div>
    </section>
  );
}
