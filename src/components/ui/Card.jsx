import Link from 'next/link';

export default function Card({ title, title_slug, index }) {
  const colorOrder = ['red', 'orange', 'pink', 'blue', 'indigo', 'green', 'purple', 'lime'];

  const colorClasses = {
    'red': 'bg-[#b00000] text-white',
    'orange': 'bg-[#e65100] text-white',
    'pink': 'bg-[#e91e63] text-white',
    'purple': 'bg-[#8e24aa] text-white',
    'blue': 'bg-[#2e01ff] text-white',
    'green': 'bg-[#008101] text-white',
    'lime': 'bg-[#827717] text-white',
    'indigo': 'bg-[#1a237e] text-white',
  };

  const selectedColor = colorOrder[index % colorOrder.length];
  const cardClass = colorClasses[selectedColor] || 'bg-blue-600';

  return (
    <div className={`h-full rounded-lg p-1 shadow-md hover:ring-2 ${cardClass} hover:bg-white hover:text-[#e65100] active:bg-white active:text-[#e65100]`}>
      <div className="flex min-h-[86px] items-center justify-center px-1 py-1 md:min-h-[96px] lg:min-h-[104px]">
        <h3 className="w-full text-center text-[0.92rem] font-semibold leading-snug md:text-base lg:text-lg">
          <Link
            href={`/${title_slug}`}
            title={`${title}`}
            target="_blank"
            rel="noopener"
            className="block text-clamp-3 hover:underline active:underline"
          >
            {title}
          </Link>
        </h3>
      </div>
    </div>
  );
}
