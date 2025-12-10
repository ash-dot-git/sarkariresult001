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
    <div className={`rounded-lg p-1 overflow-hidden shadow-md hover:ring-2 ${cardClass} hover:bg-white hover:underline hover:text-[#e65100] active:bg-white active:text-[#e65100]`}>
      
        <div className="flex items-center justify-center h-16 md:h-20 lg:h-20 transform transition-transform duration-300 hover:scale-[1.05] active:scale-[1.05] active:underline">
          <h3 className="font-semibold text-center text-sm md:text-lg lg:text-xl break-words">
           <Link href={`/${title_slug}`} title={`${title}`} target="_blank" rel="noopener">{title}</Link>
          </h3>
        </div>
      
    </div>
  );
}
