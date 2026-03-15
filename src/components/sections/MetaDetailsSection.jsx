// MetaDetailsSection.jsx
import React from 'react';
import ColorMarkdownRenderer from '../ui/ColorMarkdownRenderer';
import Link from 'next/link';
import FilterDisplay from './FilterDisplay';




function formatReadableDate(input) {
  input = String(input).trim();
  let date;

  // DD-MM-YYYY or DD/MM/YYYY
  if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(input)) {
    const [day, month, year] = input.split(/[-/]/);
    date = new Date(`${year}-${month}-${day}`);
  } 
  // YYYY-MM-DD or YYYY/MM/DD
  else if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(input)) {
    const [year, month, day] = input.split(/[-/]/);
    date = new Date(`${year}-${month}-${day}`);
  } 
  // Milliseconds
  else if (!isNaN(input)) {
    date = new Date(Number(input));
  } 
  else {
    return 'Invalid Date';
  }

  // Check for valid date
  if (isNaN(date.getTime())) return 'Invalid Date';

  // Format the date as: 9 July 2025
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}


export default function MetaDetailsSection({ elements, inserted, updated, filters }) {
  const titleEl = elements.find(el => el.name === 'title');
  const postNameEl = elements.find(el => el.name === 'name_of_post');
  const orgNameEl = elements.find(el => el.name === 'name_of_organisation');
  const post_date = elements.find(el => el.name === 'post_date');
  const update_date = elements.find(el => el.name === 'update_date');
  const descriptionEl = elements.find(el => el.name === 'description');
  const imageUrlEl = elements.find(el => el.name === 'image_url');
  

  const tableEls = Array.isArray(elements) ? elements?.filter(el => el.type === 'table') : [];
  return (
    <section aria-labelledby="meta-details-content my-10">
      {filters?.category && (
        <h2 className="text-xl text-gray-500 font-bold mb-2" style={{ textTransform: 'capitalize' }}>
          {filters.category.replace(/-/g, ' ')}
        </h2>
      )}
      {titleEl && (
        <h1 id="meta-details-content" className="text-2xl text-[#0312E6] font-extrabold mb-3">
          {titleEl.value}
        </h1>
      )}

      <FilterDisplay filters={filters} />

      {(update_date?.value || updated) && <p className="font-semibold text-[#ff0000] ">
        Updated on: {formatReadableDate(update_date?.value || updated)}
      </p>}
      {(post_date?.value || inserted) && (
        <p className="font-semibold text-[#ff0000] mb-2 ">
          Posted on: {formatReadableDate(post_date?.value || inserted)}
        </p>
      )}

      {descriptionEl?.value && (
        <ColorMarkdownRenderer content={descriptionEl.value} pClassName='text-lg'  />
      )}

      {orgNameEl && !descriptionEl && (
        <p className="leading-relaxed text-lg mb-4">
          <span className="text-[#0312E6]  font-semibold">{orgNameEl.value}</span>, {descriptionEl?.value}
        </p>
      )}

      {imageUrlEl?.value && (
        <div className="flex justify-center my-4">
          <img
            src={imageUrlEl?.value}
            alt={titleEl?.value || 'Post Image'}
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
      {postNameEl && (
        <p className="text-lg text-gray-800 mt-4">
          <span className="font-semibold">Post Name: <ColorMarkdownRenderer content={postNameEl.value} /></span>
        </p>
      )}

      {tableEls.map((table, tableIdx) => (
        <>
          {/* Section Heading */}
          <header className="bg-white text-center font-bold leading-tight space-y-1 mt-5">

            <h2 id="vacancy-details-heading" className="text-[#ff0000] font-bold text-xl md:text-2xl" >
              {postNameEl?.value || 'New Rojgar Result'}
            </h2>
            <h2 className="text-[#008101] text-lg md:text-xl">Sarkari Result</h2>
            <p className="text-[#2e01ff]">
              <Link href="https://newsarkariresult.co.in" target="_blank" rel="noopener noreferrer" aria-label="Visit NewSarkariResult.Co.In">
                NewSarkariResult.Co.In
              </Link>
            </p>
          </header>
          <div key={table.id || tableIdx} className="overflow-x-auto border-t my-6">
            {table.name && (
              <h3 className="text-center font-extrabold text-2xl md:text-3xl text-[#008101] ">
                <ColorMarkdownRenderer content={table.name} />
              </h3>
            )}
            <table className="min-w-full bg-white text-center border-collapse">
              <thead>
                <tr>
                  {table.columns.map((col) => (
                    <th
                      key={col.id}
                      scope="col"
                      className="bg-[#5c0a38] text-white px-2 py-1 tracking-wide font-bold text-center text-xl md:text-2xl border whitespace-nowrap"
                    >
                      <ColorMarkdownRenderer content={col.name} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="odd:bg-white even:bg-gray-50 hover:bg-[#f4ff81]">
                    {table.columns.map((col) => (
                      <td key={col.id} className="border px-2 py-3 text-lg">
                        <ColorMarkdownRenderer content={row[col.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ))}

    </section>
  );
}
